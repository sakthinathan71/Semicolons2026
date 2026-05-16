import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MarketSignal } from "@/lib/intelligence";
import { createLogger } from "@/lib/logger";
import { MAX_SIGNALS_PER_BRIEF, GEMINI_TIMEOUT_MS } from "@/lib/constants";

const logger = createLogger("generate-brief");

// ─── Request / Response Schemas (Zod) ─────────────────────────────────────────

const RequestSchema = z.object({
  signals: z.array(z.any()).min(0).max(MAX_SIGNALS_PER_BRIEF),
  targetRegion: z.string().optional().default("Global"),
  analysisDepth: z.string().optional().default("Executive Summary"),
});

const BriefResponseSchema = z.object({
  summary: z.string(),
  threat_level: z.enum(["Low", "Medium", "High", "Critical"]),
  strategic_recommendation: z.object({
    action: z.string(),
    details: z.string(),
    rationale: z.string(),
  }),
  kpi_impact: z.string(),
});

export type BriefResponse = z.infer<typeof BriefResponseSchema>;

// ─── Fallback Brief ───────────────────────────────────────────────────────────

function buildFallbackBrief(signals: MarketSignal[]): BriefResponse {
  const highImpact = signals.filter((s) => s.impact === "High").length;
  const uniqueBrands = [...new Set(signals.map((s) => s.brand))];
  return {
    summary: `Detected ${signals.length} market signal(s) across ${uniqueBrands.length} competitor(s). ${highImpact} high-impact event(s) require immediate attention.`,
    threat_level: highImpact >= 3 ? "Critical" : highImpact >= 1 ? "High" : "Medium",
    strategic_recommendation: {
      action: highImpact >= 1 ? "Pricing & Marketing Defense" : "Maintain Position",
      details: `Reinforce our brand value narrative across ${signals[0]?.category ?? "key"} categories. Prepare influencer-led counter-campaign if competitor activity persists beyond 48 hours.`,
      rationale:
        highImpact >= 1
          ? `${highImpact} competitor(s) executed high-impact moves. Historical data indicates a 72-hour response window before market share erosion begins.`
          : "Conditions are stable. Standard monitoring cadence is sufficient.",
    },
    kpi_impact: "Conversion Rate, Average Order Value, Brand Equity Index",
  };
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(signals: MarketSignal[], region: string, depth: string): string {
  return `
You are the "LuxeLens Intelligence Agent," an elite retail strategy consultant specializing in the global luxury market.
You are focusing on the ${region} region.
The desired output depth is: ${depth}. Provide appropriate tone and tactical depth for this level.

RULES:
- Never recommend price-matching or race-to-the-bottom tactics.
- Prioritize brand exclusivity and product storytelling.
- Use Indian Rupees (₹) for any financial figures mentioned.
- All recommendations must be executable within 24-48 hours.
- Respond ONLY with valid JSON matching the schema below. No markdown, no prose.

MARKET SIGNALS:
${JSON.stringify(signals, null, 2)}

OUTPUT SCHEMA (strict JSON):
{
  "summary": "string — one sentence summary of competitive shift",
  "threat_level": "Low | Medium | High | Critical",
  "strategic_recommendation": {
    "action": "Pricing | Marketing | Product | Operations | Social",
    "details": "string — specific tactical steps",
    "rationale": "string — data-backed reasoning"
  },
  "kpi_impact": "string — which metrics this protects or improves"
}`.trim();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await req.json().catch(() => null);
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn("Invalid request body", parsed.error.flatten());
      return NextResponse.json(
        { error: "Invalid request. 'signals' must be an array." },
        { status: 400 }
      );
    }

    const signals: MarketSignal[] = parsed.data.signals.slice(0, MAX_SIGNALS_PER_BRIEF);

    // 2. Check for API key — server-side only (no NEXT_PUBLIC_ prefix)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      logger.warn("GEMINI_API_KEY not configured — returning fallback brief");
      return NextResponse.json(buildFallbackBrief(signals));
    }

    // 3. Call Gemini API
    logger.info(`Calling Gemini API with ${signals.length} signals`);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(signals, parsed.data.targetRegion, parsed.data.analysisDepth) }] }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
        signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      logger.error(`Gemini returned ${geminiRes.status}`, errText);
      return NextResponse.json(buildFallbackBrief(signals));
    }

    // 4. Parse and validate Gemini response with Zod
    const geminiData = await geminiRes.json();
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      logger.error("Gemini returned non-JSON response", rawText.slice(0, 200));
      return NextResponse.json(buildFallbackBrief(signals));
    }

    const validated = BriefResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      logger.error("Gemini response failed schema validation", validated.error.flatten());
      return NextResponse.json(buildFallbackBrief(signals));
    }

    logger.info("Brief generated successfully");
    return NextResponse.json(validated.data);
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "TimeoutError";
    logger.error(
      isTimeout ? "Gemini API request timed out" : "Unhandled error in generate-brief",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
