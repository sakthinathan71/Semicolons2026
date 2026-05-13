import { NextRequest, NextResponse } from "next/server";
import { MarketSignal } from "@/lib/intelligence";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BriefRequestBody {
  signals: MarketSignal[];
}

interface BriefResponse {
  summary: string;
  threat_level: "Low" | "Medium" | "High" | "Critical";
  strategic_recommendation: {
    action: string;
    details: string;
    rationale: string;
  };
  kpi_impact: string;
}

// ─── Fallback Brief (No API Key) ──────────────────────────────────────────────

function buildFallbackBrief(signals: MarketSignal[]): BriefResponse {
  const highImpact = signals.filter((s) => s.impact === "High").length;
  const uniqueBrands = [...new Set(signals.map((s) => s.brand))];
  return {
    summary: `Detected ${signals.length} market signal(s) across ${uniqueBrands.length} competitor(s). ${highImpact} high-impact event(s) require immediate attention.`,
    threat_level: highImpact >= 3 ? "Critical" : highImpact >= 1 ? "High" : "Medium",
    strategic_recommendation: {
      action: highImpact >= 1 ? "Pricing & Marketing Defense" : "Maintain Position",
      details: `Reinforce Olivela's brand value narrative across ${signals[0]?.category ?? "key"} categories. Prepare influencer-led counter-campaign if competitor activity persists beyond 48 hours.`,
      rationale: highImpact >= 1
        ? `${highImpact} competitor(s) executed high-impact moves. Historical data indicates a 72-hour response window before market share erosion begins.`
        : "Conditions are stable. Standard monitoring cadence is sufficient.",
    },
    kpi_impact: "Conversion Rate, Average Order Value, Brand Equity Index",
  };
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildGeminiPrompt(signals: MarketSignal[]): string {
  return `
You are the "LuxeLens Intelligence Agent," an elite retail strategy consultant specializing in the global luxury market.

EVALUATION CRITERIA:
- Luxury positioning: Never recommend a race-to-the-bottom price war. Maintain brand exclusivity.
- Agility: Identify moves executable within 24-48 hours.
- Data-driven: Base all reasoning on the signals provided.

MARKET SIGNALS:
${JSON.stringify(signals, null, 2)}

OUTPUT FORMAT (Strict JSON, no markdown, no extra keys):
{
  "summary": "One concise sentence summarizing the competitive shift.",
  "threat_level": "Low | Medium | High | Critical",
  "strategic_recommendation": {
    "action": "Pricing | Marketing | Product | Operations | Social",
    "details": "Specific tactical steps Olivela should take.",
    "rationale": "Data-backed reason for this recommendation."
  },
  "kpi_impact": "Which business metric(s) will this protect or improve?"
}`.trim();
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BriefRequestBody;

    if (!Array.isArray(body?.signals)) {
      return NextResponse.json({ error: "Invalid request: 'signals' must be an array." }, { status: 400 });
    }

    const signals = body.signals.slice(0, 15); // Limit to control token usage

    const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // No API key configured — return a smart local brief
      return NextResponse.json(buildFallbackBrief(signals));
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildGeminiPrompt(signals) }] }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
        // Enforce a timeout so a slow API call doesn't hang the request
        signal: AbortSignal.timeout(20_000),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "Unknown error");
      console.error("[Gemini API Error]", geminiRes.status, errText);
      // Return smart fallback instead of propagating a 5xx
      return NextResponse.json(buildFallbackBrief(signals));
    }

    const geminiData = await geminiRes.json();
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const parsed: BriefResponse = JSON.parse(rawText);
    return NextResponse.json(parsed);
  } catch (error) {
    // Handle JSON parse errors, network errors, and AbortError
    console.error("[generate-brief] Unhandled error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
