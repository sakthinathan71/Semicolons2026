// ─── Types ────────────────────────────────────────────────────────────────────

export type BrandConfig = {
  id: string;
  name: string;
  website: string;
  instagram: string;
  isCompetitor: boolean;
};

export type SignalImpact = "High" | "Medium" | "Low" | "Positive" | "Neutral";
export type SentimentType = "Positive" | "Negative" | "Mixed";
export type ThreatLevel = "High" | "Medium" | "Low";

export type Prediction = {
  event: string;
  probability: number; // 0-100
  timeframe: string;
};

export type PlatformType = "TikTok" | "Instagram" | "Twitter" | "Weibo";

export type SocialMetrics = {
  views: string;
  velocity: number; // 0-100
  sentiment: SentimentType;
  platform?: PlatformType;
  influencer?: {
    name: string;
    followers: string;
  };
  keywords?: string[];
};

export type MarketSignal = {
  id: string;
  brand: string;
  event: string;
  category: string;
  details: string;
  impact: SignalImpact;
  time: string;
  visualSimilarity?: number; // 0.0 - 1.0
  prediction?: Prediction;
  socialMetrics?: SocialMetrics;
};

export type AIRecommendation = {
  id: number;
  title: string;
  competitor: string;
  threat: ThreatLevel;
  action: string;
  logic: string;
  urgency: string;
  predictedMove?: string;
};

// ─── Simulation Event Catalogue ───────────────────────────────────────────────

export const SIMULATION_EVENTS: Array<{
  event: string;
  category: string;
  impact: SignalImpact;
  details: string;
}> = [
  { event: "Price Drop (-15%)", category: "Bridal Couture", impact: "High", details: "Flash sale detected on flagship lehengas" },
  { event: "New Drop", category: "Jewelry", impact: "Positive", details: "Limited edition heritage Polki capsule announced" },
  { event: "Viral Post", category: "Marketing", impact: "Medium", details: "Influencer-driven wedding season engagement spike" },
  { event: "Out of Stock", category: "Sherwanis", impact: "High", details: "Global inventory depleted on hero wedding product" },
  { event: "Price Increase (+5%)", category: "Accessories", impact: "Neutral", details: "Standard festive pricing adjustment" },
  { event: "Flash Promotion", category: "Sarees", impact: "High", details: "48-hour exclusive member pricing event" },
  { event: "New Collection Launch", category: "RTW", impact: "Positive", details: "Festive ready-to-wear line goes live online" },
  { event: "Influencer Collab", category: "Marketing", impact: "Medium", details: "Major celebrity endorsement revealed on Instagram" },
  { event: "Stock Clearance", category: "Footwear", impact: "Low", details: "End of season markdown on luxury juttis" },
];

// ─── AI Recommendation Synthesizer ────────────────────────────────────────────

export function synthesizeRecommendation(signal: MarketSignal): AIRecommendation {
  const lowerEvent = signal.event.toLowerCase();
  const isPricing = lowerEvent.includes("price") || lowerEvent.includes("flash") || lowerEvent.includes("promotion");
  const isSocial = lowerEvent.includes("viral") || signal.category === "Marketing";
  const isStock = lowerEvent.includes("stock") || lowerEvent.includes("drop") || lowerEvent.includes("launch");

  if (isPricing) {
    return {
      id: Date.now(),
      title: `Price Response: ${signal.category}`,
      competitor: signal.brand,
      threat: signal.impact === "High" ? "High" : "Medium",
      action: "Marketing Adjustment",
      logic: `AI detected a ${signal.details} move by ${signal.brand}. Cross-referencing historical patterns, we predict a secondary move in ${signal.category} within 72h. Recommend preparing a counter-narrative around product quality differentiation.`,
      urgency: "Immediate",
      predictedMove: `Secondary markdown on ${signal.category} accessories`,
    };
  }

  if (isSocial) {
    const velocity = signal.socialMetrics?.velocity ?? 75;
    const sentiment = signal.socialMetrics?.sentiment ?? "Positive";
    return {
      id: Date.now(),
      title: `Engagement Counter: ${signal.brand}`,
      competitor: signal.brand,
      threat: "Medium",
      action: "Social Blitz",
      logic: `${signal.brand} content is scaling at ${velocity}% velocity. Sentiment is ${sentiment}. Suggest counter-posting via Influencer Tier 1 within the next 6 hours to recapture share-of-voice.`,
      urgency: "Immediate",
      predictedMove: "Viral saturation in < 12h",
    };
  }

  if (isStock) {
    return {
      id: Date.now(),
      title: `Stockout Arbitrage: ${signal.category}`,
      competitor: signal.brand,
      threat: signal.impact === "High" ? "High" : "Medium",
      action: "Storefront Boost",
      logic: `${signal.brand} ${signal.event} in ${signal.category}. High-intent buyers are now searching for alternatives. Recommend boosting matching SKUs to homepage hero and increasing paid search bid by 20%.`,
      urgency: "2 Hours",
      predictedMove: "Capture competitor lost sales within 24-48h window",
    };
  }

  return {
    id: Date.now(),
    title: `Trend Counter: ${signal.category}`,
    competitor: signal.brand,
    threat: "Medium",
    action: "Social Program Update",
    logic: `${signal.brand} is gaining velocity in ${signal.category}. Visual similarity matching shows an 88% overlap with our upcoming collection. Consider accelerating our launch timeline.`,
    urgency: "24 Hours",
    predictedMove: "Competitor expansion into Sustainable segment",
  };
}

// ─── Mock Initial Data ─────────────────────────────────────────────────────────

export const mockInitialSignals: MarketSignal[] = [
  {
    id: "init-1",
    brand: "Manish Malhotra",
    event: "Price Increase (+5%)",
    category: "Bridal Couture",
    details: "Standard festive pricing adjustment across signature lehengas",
    impact: "Positive",
    time: "12m ago",
    prediction: { event: "Market stabilization expected", probability: 85, timeframe: "7 days" },
  },
  {
    id: "init-2",
    brand: "Sabyasachi",
    event: "Out of Stock",
    category: "Jewelry",
    details: "Heritage choker sets sold out across all storefronts",
    impact: "High",
    time: "1h ago",
    prediction: { event: "Restock anticipated", probability: 60, timeframe: "14 days" },
  },
  {
    id: "init-3",
    brand: "Pernia's Pop-Up Shop",
    event: "Viral Post",
    category: "Marketing",
    details: "Festive season campaign reaches 4.2M impressions",
    impact: "Neutral",
    time: "45m ago",
    visualSimilarity: 0.92,
    socialMetrics: { 
      views: "4.2M", 
      velocity: 94, 
      sentiment: "Positive",
      platform: "Instagram",
      influencer: { name: "Diipa Khosla", followers: "2.1M" },
      keywords: ["#DesiWedding", "#FestiveEdit", "#LuxuryIndianWear"]
    },
  },
  {
    id: "init-4",
    brand: "Aza Fashions",
    event: "Flash Promotion",
    category: "Sarees",
    details: "Unexpected 15% markdown on premium silk sarees",
    impact: "High",
    time: "2h ago",
    prediction: { event: "Counter-promotions expected from rivals", probability: 75, timeframe: "24 hours" },
  }
];
