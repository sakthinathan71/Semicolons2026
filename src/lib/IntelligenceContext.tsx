"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import {
  MarketSignal,
  AIRecommendation,
  BrandConfig,
  synthesizeRecommendation,
  mockInitialSignals,
  SIMULATION_EVENTS,
} from "@/lib/intelligence";

// ─── Types ────────────────────────────────────────────────────────────────────

export type { BrandConfig };

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

// ─── Initial Brand Data ───────────────────────────────────────────────────────

const INITIAL_BRANDS: BrandConfig[] = [
  { id: "1", name: "Olivela", website: "olivela.com", instagram: "@olivela", isCompetitor: false },
  { id: "2", name: "Net-a-Porter", website: "net-a-porter.com", instagram: "@netaporter", isCompetitor: true },
  { id: "3", name: "Farfetch", website: "farfetch.com", instagram: "@farfetch", isCompetitor: true },
  { id: "4", name: "Mytheresa", website: "mytheresa.com", instagram: "@mytheresa", isCompetitor: true },
  { id: "5", name: "Saks Fifth Avenue", website: "saksfifthavenue.com", instagram: "@saks", isCompetitor: true },
  { id: "6", name: "Neiman Marcus", website: "neimanmarcus.com", instagram: "@neimanmarcus", isCompetitor: true },
  { id: "7", name: "Bergdorf Goodman", website: "bergdorfgoodman.com", instagram: "@bergdorfs", isCompetitor: true },
  { id: "8", name: "Moda Operandi", website: "modaoperandi.com", instagram: "@modaoperandi", isCompetitor: true },
];

const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 1,
    title: "Inventory Alert: Limited Drops",
    competitor: "Prada",
    threat: "Medium",
    action: "Accelerate Capsule Release",
    logic:
      "Prada's 'Eternal' collection is 80% sold out in 4 hours. Market demand for sustainable leather is peaking. Move our drop forward by 48h to capture the high-intent buyer window.",
    urgency: "24 Hours",
  },
];

const SIMULATION_INTERVAL_MS = 3000;
const MAX_SIGNALS = 50;
const MAX_RECOMMENDATIONS = 5;

// ─── Context Setup ────────────────────────────────────────────────────────────

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function IntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<BrandConfig[]>(INITIAL_BRANDS);
  const [signals, setSignals] = useState<MarketSignal[]>(mockInitialSignals);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [isSimulating, setIsSimulating] = useState(false);

  // Use a ref for the interval to avoid stale closures and prevent double-registration in StrictMode
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Use a ref for brands so the interval callback always has the latest value
  const brandsRef = useRef(brands);

  useEffect(() => {
    brandsRef.current = brands;
  }, [brands]);

  const triggerMockEvent = useCallback(() => {
    const activeCompetitors = brandsRef.current.filter(
      (b) => b.isCompetitor && b.name.toLowerCase() !== "olivela"
    );

    // Gracefully stop simulation if no competitors are configured
    if (activeCompetitors.length === 0) {
      setIsSimulating(false);
      return;
    }

    const randomBrand =
      activeCompetitors[Math.floor(Math.random() * activeCompetitors.length)].name;
    const randomEvent = SIMULATION_EVENTS[Math.floor(Math.random() * SIMULATION_EVENTS.length)];

    const hasSimilarity = Math.random() > 0.7;
    const hasPrediction = Math.random() > 0.6;
    const isSocial =
      randomEvent.category === "Marketing" || randomEvent.event.toLowerCase().includes("viral");

    const newSignal: MarketSignal = {
      id: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      brand: randomBrand,
      event: randomEvent.event,
      category: randomEvent.category,
      details: randomEvent.details,
      impact: randomEvent.impact,
      time: "Just now",
      visualSimilarity: hasSimilarity ? parseFloat((0.75 + Math.random() * 0.2).toFixed(2)) : undefined,
      prediction: hasPrediction
        ? {
            event: "Potential Price Adjustment",
            probability: Math.floor(65 + Math.random() * 25),
            timeframe: "24-48h",
          }
        : undefined,
      socialMetrics: isSocial
        ? {
            views: `${(Math.random() * 10).toFixed(1)}M`,
            velocity: Math.floor(70 + Math.random() * 30),
            sentiment:
              Math.random() > 0.6 ? "Positive" : Math.random() > 0.5 ? "Mixed" : "Negative",
          }
        : undefined,
    };

    const newRec = synthesizeRecommendation(newSignal);

    setSignals((prev) => [newSignal, ...prev.slice(0, MAX_SIGNALS - 1)]);
    setRecommendations((prev) => {
      // Prevent duplicate recommendations for the same brand + title
      const isDuplicate = prev.some(
        (r) => r.title === newRec.title && r.competitor === newRec.competitor
      );
      if (isDuplicate) return prev;
      return [newRec, ...prev.slice(0, MAX_RECOMMENDATIONS - 1)];
    });
  }, []); // No deps — uses brandsRef to avoid stale closure

  // Manage interval lifecycle cleanly
  useEffect(() => {
    if (isSimulating) {
      // Clear any existing interval before setting a new one (handles React StrictMode double-invoke)
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(triggerMockEvent, SIMULATION_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isSimulating, triggerMockEvent]);

  const startSimulation = useCallback(() => setIsSimulating(true), []);
  const stopSimulation = useCallback(() => setIsSimulating(false), []);

  const executeStrategy = useCallback((strategy: AIRecommendation) => {
    const newSignal: MarketSignal = {
      id: `action-${Date.now()}`,
      brand: "Olivela",
      event: `Strategy Deployed: ${strategy.action}`,
      category: "Internal Action",
      details: `Counter-measure executed against ${strategy.competitor}'s recent activity.`,
      impact: "Positive",
      time: "Just now",
    };
    setSignals((prev) => [newSignal, ...prev.slice(0, MAX_SIGNALS - 1)]);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      signals,
      recommendations,
      brands,
      setBrands,
      triggerMockEvent,
      startSimulation,
      stopSimulation,
      isSimulating,
      executeStrategy,
    }),
    [signals, recommendations, brands, setBrands, triggerMockEvent, startSimulation, stopSimulation, isSimulating, executeStrategy]
  );

  return (
    <IntelligenceContext.Provider value={contextValue}>
      {children}
    </IntelligenceContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIntelligence() {
  const context = useContext(IntelligenceContext);
  if (context === undefined) {
    throw new Error("useIntelligence must be used within an IntelligenceProvider");
  }
  return context;
}
