import { describe, it, expect } from "vitest";
import { synthesizeRecommendation, mockInitialSignals } from "@/lib/intelligence";
import type { MarketSignal } from "@/lib/intelligence";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const priceSignal: MarketSignal = {
  id: "test-1",
  brand: "Gucci",
  event: "Price Drop (-10%)",
  category: "Bags",
  details: "Flash sale detected",
  impact: "High",
  time: "Just now",
};

const socialSignal: MarketSignal = {
  id: "test-2",
  brand: "Prada",
  event: "Viral Post",
  category: "Marketing",
  details: "Influencer spike",
  impact: "Medium",
  time: "Just now",
  socialMetrics: { views: "2.1M", velocity: 88, sentiment: "Positive" },
};

const stockSignal: MarketSignal = {
  id: "test-3",
  brand: "Hermès",
  event: "Out of Stock",
  category: "Accessories",
  details: "Global inventory depleted",
  impact: "High",
  time: "Just now",
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("synthesizeRecommendation", () => {
  it("produces a Price Response rec for price-related signals", () => {
    const rec = synthesizeRecommendation(priceSignal);
    expect(rec.title).toContain("Price Response");
    expect(rec.competitor).toBe("Gucci");
    expect(rec.threat).toBe("High");
    expect(rec.urgency).toBe("Immediate");
  });

  it("produces an Engagement Counter rec for social/viral signals", () => {
    const rec = synthesizeRecommendation(socialSignal);
    expect(rec.title).toContain("Engagement Counter");
    expect(rec.action).toBe("Social Blitz");
    expect(rec.logic).toContain("88%");
  });

  it("produces a Stockout Arbitrage rec for out-of-stock events", () => {
    const rec = synthesizeRecommendation(stockSignal);
    expect(rec.title).toContain("Stockout Arbitrage");
    expect(rec.action).toBe("Storefront Boost");
  });

  it("always returns a recommendation with all required fields", () => {
    const rec = synthesizeRecommendation(priceSignal);
    expect(rec).toHaveProperty("id");
    expect(rec).toHaveProperty("title");
    expect(rec).toHaveProperty("competitor");
    expect(rec).toHaveProperty("threat");
    expect(rec).toHaveProperty("action");
    expect(rec).toHaveProperty("logic");
    expect(rec).toHaveProperty("urgency");
  });
});

describe("mockInitialSignals", () => {
  it("contains at least one pricing or stock signal for PriceWatch", () => {
    const priceOrStock = mockInitialSignals.filter(
      (s) => s.event.toLowerCase().includes("price") || s.event.toLowerCase().includes("stock")
    );
    expect(priceOrStock.length).toBeGreaterThan(0);
  });

  it("contains at least one social signal for SocialVelocity", () => {
    const social = mockInitialSignals.filter((s) => s.socialMetrics != null);
    expect(social.length).toBeGreaterThan(0);
  });

  it("all signals have unique IDs", () => {
    const ids = mockInitialSignals.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
