import { MarketSignal } from "./intelligence";

export const DEMO_SCRIPT: Array<{ delay: number; signal: Partial<MarketSignal> }> = [
  {
    delay: 0,
    signal: {
      brand: "Sabyasachi",
      event: "Out of Stock",
      category: "Bridal Couture",
      impact: "High",
      details: "Flagship heritage lehengas depleted — 1,200 waitlisted buyers across boutiques.",
      visualSimilarity: 0.94,
    },
  },
  {
    delay: 3000,
    signal: {
      brand: "Instagram",
      event: "Viral Search Spike +340%",
      category: "Marketing",
      impact: "Positive",
      details: "Competitor stockout driving massive search demand for bridal alternatives.",
      socialMetrics: { 
        views: "2.4M", 
        velocity: 96, 
        sentiment: "Positive",
        platform: "Instagram",
        keywords: ["#SabyasachiSoldOut", "#BridalLehenga", "#WeddingSeason"]
      },
    },
  },
  {
    delay: 7000,
    signal: {
      brand: "Aza Fashions",
      event: "Flash Promotion (-15%)",
      category: "Bridal Couture",
      impact: "High",
      details: "Aza Fashions attempting to capture overflow traffic with a sudden discount.",
    },
  },
  {
    delay: 11000,
    signal: {
      brand: "Tata CLiQ Luxury",
      event: "Strategy Deployed: Visual Match Boost",
      category: "Internal Action",
      impact: "Positive",
      details: "Similar Anita Dongre lehenga promoted to hero slot. Performance Ads bid increased +20%.",
    },
  },
  {
    delay: 15000,
    signal: {
      brand: "Tata CLiQ Luxury",
      event: "Revenue Impact: +22% Conversion",
      category: "Revenue",
      impact: "Positive",
      details: "Bridal category conversion rate surged within 3 hours of competitor stockout.",
    },
  },
  {
    delay: 19000,
    signal: {
      brand: "Tata CLiQ Luxury",
      event: "Automated Escalation",
      category: "Supply Chain",
      impact: "Neutral",
      details: "Warehouse notified to route extra bridal inventory to Tier-1 city fulfillment centers.",
    },
  }
];
