import { NextRequest, NextResponse } from 'next/server';
import { MarketSignal } from '@/lib/intelligence';

export async function POST(req: NextRequest) {
  try {
    const { signals } = await req.json();
    
    // In a real app, use the official @google/genai SDK.
    // For this prototype, we'll use a direct fetch to the Gemini REST API to keep dependencies light
    // or simulate a highly dynamic response if the key is missing to not break the demo.
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback dynamic mock if no real API key is provided
      const summary = `Detected ${signals.length} market shifts across ${new Set(signals.map((s: MarketSignal) => s.brand)).size} competitors.`;
      const action = signals.some((s: MarketSignal) => s.impact === 'High') 
        ? "Immediate pricing defense required." 
        : "Maintain current positioning.";
        
      return NextResponse.json({
        summary,
        threat_level: signals.some((s: MarketSignal) => s.impact === 'High') ? 'High' : 'Medium',
        strategic_recommendation: {
          action: "Pricing & Marketing Pivot",
          details: `Execute counter-measures for ${signals[0]?.brand || 'competitor'} activity.`,
          rationale: action
        },
        kpi_impact: "Conversion Rate & Brand Equity"
      });
    }

    const prompt = `
You are the "LuxeLens Intelligence Agent," an elite retail strategy consultant specializing in the global luxury market.
YOUR TASK: Analyze the following signals and output a structured strategic response.

EVALUATION CRITERIA:
- Luxury positioning: Never suggest a race-to-the-bottom price war.
- Exclusivity: Prioritize scarcity and brand story.
- Agility: Identify moves that can be executed within 24-48 hours.

SIGNALS:
${JSON.stringify(signals, null, 2)}

OUTPUT FORMAT (Strict JSON):
{
  "summary": "One sentence summary of the competitive shift.",
  "threat_level": "Low | Medium | High | Critical",
  "strategic_recommendation": {
    "action": "Marketing | Pricing | Product | Operations",
    "details": "Specific tactical steps.",
    "rationale": "The 'Why' behind this move based on the data provided."
  },
  "kpi_impact": "Which business metric will this protect/improve?"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const jsonResult = JSON.parse(resultText);

    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 });
  }
}
