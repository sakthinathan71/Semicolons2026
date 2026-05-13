export type Prediction = {
  event: string;
  probability: number;
  timeframe: string;
};

export type MarketSignal = {
  id: string;
  brand: string;
  event: string;
  category: string;
  details: string;
  impact: "High" | "Medium" | "Low" | "Positive" | "Neutral";
  time: string;
  visualSimilarity?: number;
  prediction?: Prediction;
  socialMetrics?: {
    views: string;
    velocity: number; // 0-100
    sentiment: "Positive" | "Negative" | "Mixed";
  };
};

export type AIRecommendation = {
  id: number;
  title: string;
  competitor: string;
  threat: "High" | "Medium" | "Low";
  action: string;
  logic: string;
  urgency: string;
  predictedMove?: string;
};

export function synthesizeRecommendation(signal: MarketSignal): AIRecommendation {
  const isPricing = signal.event.toLowerCase().includes("price");
  const isSocial = signal.event.toLowerCase().includes("viral") || signal.category === "Marketing";
  
  if (isPricing) {
    return {
      id: Date.now(),
      title: `Price Response: ${signal.category}`,
      competitor: signal.brand,
      threat: signal.impact === "High" ? "High" : "Medium",
      action: "Marketing Adjustment",
      logic: `AI detected a ${signal.details} move. Cross-referencing historical patterns, we predict a secondary move in ${signal.category} within 72h.`,
      urgency: "Immediate",
      predictedMove: "Secondary markdown on accessories"
    };
  }

  if (isSocial) {
    return {
       id: Date.now(),
       title: `Engagement Counter: ${signal.brand}`,
       competitor: signal.brand,
       threat: "Medium",
       action: "Social Blitz",
       logic: `${signal.brand} content is scaling at ${signal.socialMetrics?.velocity}% velocity. Sentiment is ${signal.socialMetrics?.sentiment}. Suggest counter-posting via Influencer Tier 1.`,
       urgency: "Immediate",
       predictedMove: "Viral saturation in < 12h"
    };
  }

  return {
    id: Date.now(),
    title: `Trend Counter: ${signal.category}`,
    competitor: signal.brand,
    threat: "Medium",
    action: "Social Program Update",
    logic: `${signal.brand} is gaining velocity. Visual similarity matching shows a 88% overlap with our upcoming 'Aura' collection.`,
    urgency: "24 Hours",
    predictedMove: "Competitor expansion into Sustainable segment"
  };
}

export const mockInitialSignals: MarketSignal[] = [
  {
    id: "1",
    brand: "Louis Vuitton",
    event: "Price Increase (+5%)",
    category: "Neverfull Collection",
    details: "Standard annual adjustment",
    impact: "Positive",
    time: "12m ago",
    prediction: { event: "Market stabilization", probability: 85, timeframe: "7 days" }
  },
  {
    id: "2",
    brand: "Hermès",
    event: "Viral Post",
    category: "Marketing",
    details: "Spring/Summer 26 Launch",
    impact: "Neutral",
    time: "45m ago",
    visualSimilarity: 0.92,
    socialMetrics: { views: "4.2M", velocity: 94, sentiment: "Positive" }
  }
];


