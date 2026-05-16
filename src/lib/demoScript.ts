import { MarketSignal } from "./intelligence";

export const DEMO_SCRIPT: Array<{ delay: number; signal: Partial<MarketSignal> }> = [
  {
    delay: 0,
    signal: {
      brand: "Net-a-Porter",
      event: "Out of Stock",
      category: "Gucci Horsebit Loafer",
      impact: "High",
      details: "Global inventory depleted — 4,200 waitlisted buyers",
      visualSimilarity: 0.94,
    },
  },
  {
    delay: 3000,
    signal: {
      brand: "Instagram / TikTok",
      event: "Viral Search Spike +340%",
      category: "Marketing",
      impact: "Positive",
      details: "Competitor stockout driving search demand for alternatives",
      socialMetrics: { views: "2.4M", velocity: 96, sentiment: "Positive" },
    },
  },
  {
    delay: 9000,
    signal: {
      brand: "Olivela",
      event: "Strategy Deployed: Homepage Boost",
      category: "Internal Action",
      impact: "Positive",
      details: "Milano Loafer promoted to hero slot. Google Ads bid +20%.",
    },
  },
  {
    delay: 14000,
    signal: {
      brand: "Olivela",
      event: "Revenue Impact: +18% Conversion",
      category: "Revenue",
      impact: "Positive",
      details: "Loafer category conversion rate increased within 2 hours of competitor stockout.",
    },
  },
];
