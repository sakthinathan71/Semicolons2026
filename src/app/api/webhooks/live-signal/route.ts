import { NextRequest, NextResponse } from "next/server";
import { MarketSignal } from "@/lib/intelligence";

/**
 * Live Signal Webhook
 * 
 * This endpoint allows external systems (or a presenter via Postman) to inject
 * live market signals directly into the application.
 * 
 * Usage:
 * POST /api/webhooks/live-signal
 * {
 *   "brand": "Hermès",
 *   "event": "PRICE FLOOR BREACH — Birkin 25 (-5%)",
 *   "category": "Iconic Bags",
 *   "impact": "High",
 *   "details": "First price reduction on Birkin line in 14 years. Detected across 3 storefronts.",
 *   "secret": "DEMO_WEBHOOK_SECRET"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Security check (in production, use a more robust auth mechanism)
    if (body.secret !== (process.env.WEBHOOK_SECRET || "DEMO_WEBHOOK_SECRET")) {
      return NextResponse.json({ error: "Forbidden: Invalid secret" }, { status: 403 });
    }

    // Map the incoming payload to a full MarketSignal object
    const signal: MarketSignal = {
      id: `webhook-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      brand: body.brand,
      event: body.event,
      category: body.category,
      impact: body.impact,
      details: body.details,
      time: "Just now",
      // Include optional fields if provided
      visualSimilarity: body.visualSimilarity,
      prediction: body.prediction,
      socialMetrics: body.socialMetrics,
    };

    // In a real, scaled application, we would insert this into a database (e.g. Supabase)
    // and rely on Realtime subscriptions to push it to connected clients.
    // Since LuxeLens AI currently stores signals in-memory via React Context,
    // this webhook simply validates and returns the formatted signal so a client
    // could potentially poll for it (if polling was implemented).
    // For a hackathon demo, triggering this endpoint demonstrates the *architecture*
    // of accepting live external events.

    return NextResponse.json({ 
      success: true, 
      message: "Signal processed successfully", 
      signal 
    }, { status: 201 });

  } catch (error) {
    console.error("[Webhook Error]:", error);
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
