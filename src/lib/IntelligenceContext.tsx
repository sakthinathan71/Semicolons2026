"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { MarketSignal, AIRecommendation, synthesizeRecommendation, mockInitialSignals } from "@/lib/intelligence";

export type BrandConfig = {
  id: string;
  name: string;
  website: string;
  instagram: string;
  isCompetitor: boolean;
};

type IntelligenceContextType = {
  signals: MarketSignal[];
  recommendations: AIRecommendation[];
  brands: BrandConfig[];
  setBrands: React.Dispatch<React.SetStateAction<BrandConfig[]>>;
  triggerMockEvent: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  isSimulating: boolean;
  executeStrategy: (strategy: AIRecommendation) => void;
};

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export function IntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<BrandConfig[]>([
    { id: "1", name: "Olivela", website: "olivela.com", instagram: "@olivela", isCompetitor: false },
    { id: "2", name: "Net-a-Porter", website: "net-a-porter.com", instagram: "@netaporter", isCompetitor: true },
    { id: "3", name: "Farfetch", website: "farfetch.com", instagram: "@farfetch", isCompetitor: true },
    { id: "4", name: "Mytheresa", website: "mytheresa.com", instagram: "@mytheresa", isCompetitor: true },
    { id: "5", name: "Saks Fifth Avenue", website: "saksfifthavenue.com", instagram: "@saks", isCompetitor: true },
    { id: "6", name: "Neiman Marcus", website: "neimanmarcus.com", instagram: "@neimanmarcus", isCompetitor: true },
    { id: "7", name: "Bergdorf Goodman", website: "bergdorfgoodman.com", instagram: "@bergdorfs", isCompetitor: true },
    { id: "8", name: "Moda Operandi", website: "modaoperandi.com", instagram: "@modaoperandi", isCompetitor: true },
  ]);

  const [signals, setSignals] = useState<MarketSignal[]>(mockInitialSignals);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 1,
      title: "Inventory Alert: Limited Drops",
      competitor: "Prada",
      threat: "Medium",
      action: "Accelerate Capsule Release",
      logic: "Prada's 'Eternal' collection is 80% sold out in 4 hours. Market demand for sustainable leather is peaking. Move our drop forward by 48h.",
      urgency: "24 Hours"
    }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const triggerMockEvent = useCallback(() => {
    const activeCompetitors = brands.filter(b => b.isCompetitor && b.name.toLowerCase() !== 'olivela');
    if (activeCompetitors.length === 0) {
      setIsSimulating(false);
      return;
    }
    
    const randomBrand = activeCompetitors[Math.floor(Math.random() * activeCompetitors.length)].name;
    
    const events: Array<{ event: string, category: string, impact: MarketSignal['impact'], details: string }> = [
      { event: "Price Drop (-10%)", category: "Bags", impact: "High", details: "Flash sale detected" },
      { event: "New Drop", category: "Shoes", impact: "Positive", details: "Limited edition release" },
      { event: "Viral Post", category: "Marketing", impact: "Medium", details: "Social engagement spike" },
      { event: "Out of Stock", category: "Watches", impact: "High", details: "Inventory depleted" }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const hasSimilarity = Math.random() > 0.7;
    const hasPrediction = Math.random() > 0.6;
    const isSocial = randomEvent.category === "Marketing" || randomEvent.event.includes("Viral");

    const newSignal: MarketSignal = {
      id: Math.random().toString(36).substr(2, 9),
      brand: randomBrand,
      event: randomEvent.event,
      category: randomEvent.category,
      details: randomEvent.details,
      impact: randomEvent.impact,
      time: "Just now",
      visualSimilarity: hasSimilarity ? 0.75 + Math.random() * 0.2 : undefined,
      prediction: hasPrediction ? {
        event: "Potential Price Adjustment",
        probability: Math.floor(65 + Math.random() * 25),
        timeframe: "24-48h"
      } : undefined,
      socialMetrics: isSocial ? {
        views: `${(Math.random() * 10).toFixed(1)}M`,
        velocity: Math.floor(70 + Math.random() * 30),
        sentiment: Math.random() > 0.5 ? "Positive" : Math.random() > 0.5 ? "Mixed" : "Negative"
      } : undefined
    };

    const newRec = synthesizeRecommendation(newSignal);

    setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
    setRecommendations(prev => {
      // Avoid duplicate recommendations for the same event
      if (prev.some(r => r.title === newRec.title && r.competitor === newRec.competitor)) return prev;
      return [newRec, ...prev.slice(0, 4)];
    });
  }, [brands]);

  // Cleanup interval on unmount or when simulation state changes
  React.useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (isSimulating) {
      id = setInterval(() => {
        triggerMockEvent();
      }, 3000);
      setIntervalId(id);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [isSimulating, triggerMockEvent]);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const executeStrategy = useCallback((strategy: AIRecommendation) => {
    const newSignal: MarketSignal = {
      id: Math.random().toString(36).substr(2, 9),
      brand: "Olivela", // The primary brand executing the strategy
      event: `Strategy Deployed: ${strategy.action}`,
      category: "Internal Action",
      details: `Counter-measure executed against ${strategy.competitor}'s recent activity.`,
      impact: "Positive",
      time: "Just now",
    };
    
    setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
  }, []);

  return (
    <IntelligenceContext.Provider value={{ 
      signals, 
      recommendations, 
      triggerMockEvent, 
      startSimulation, 
      stopSimulation, 
      isSimulating, 
      brands, 
      setBrands,
      executeStrategy
    }}>
      {children}
    </IntelligenceContext.Provider>
  );
}

export function useIntelligence() {
  const context = useContext(IntelligenceContext);
  if (context === undefined) {
    throw new Error("useIntelligence must be used within an IntelligenceProvider");
  }
  return context;
}
