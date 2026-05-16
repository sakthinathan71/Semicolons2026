"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import {
  MarketSignal,
  AIRecommendation,
  BrandConfig,
  synthesizeRecommendation,
  generateSyntheticSignal,
  mockInitialSignals,
  SIMULATION_EVENTS,
} from "@/lib/intelligence";
import { DEMO_SCRIPT } from "@/lib/demoScript";
import {
  PRIMARY_BRAND_LOWER,
  MAX_SIGNALS,
  MAX_RECOMMENDATIONS,
  SIMULATION_INTERVAL_MS,
} from "@/lib/constants";
import { createLogger } from "@/lib/logger";

const logger = createLogger("IntelligenceContext");

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
  startLiveDemo: () => void;
  isSimulating: boolean;
  isDemoing: boolean;
  executeStrategy: (strategy: AIRecommendation) => void;
};

// ─── Initial Brand Data ───────────────────────────────────────────────────────

const INITIAL_BRANDS: BrandConfig[] = [
  { id: "1", name: "Tata CLiQ Luxury", website: "luxury.tatacliq.com", instagram: "@tatacliqluxury", isCompetitor: false },
  { id: "2", name: "Pernia's Pop-Up Shop", website: "perniaspopupshop.com", instagram: "@perniaspopupshop", isCompetitor: true },
  { id: "3", name: "The Collective", website: "thecollective.in", instagram: "@thecollectiveindia", isCompetitor: true },
  { id: "4", name: "Aza Fashions", website: "azafashions.com", instagram: "@azafashions", isCompetitor: true },
  { id: "5", name: "Nykaa Luxe", website: "nykaa.com", instagram: "@nykaaluxe", isCompetitor: true },
  { id: "6", name: "Ensemble India", website: "ensembleindia.com", instagram: "@ensembleindia", isCompetitor: true },
  { id: "7", name: "Sabyasachi", website: "sabyasachi.com", instagram: "@sabyasachiofficial", isCompetitor: true },
  { id: "8", name: "Manish Malhotra", website: "manishmalhotra.in", instagram: "@manishmalhotraworld", isCompetitor: true },
  { id: "9", name: "Anita Dongre", website: "anitadongre.com", instagram: "@anitadongre", isCompetitor: true },
];

const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: 1,
    title: "Inventory Alert: Bridal Season Drops",
    competitor: "Sabyasachi",
    threat: "Medium",
    action: "Accelerate Capsule Release",
    logic:
      "Sabyasachi's 'Heritage' collection is 80% sold out in 4 hours. Market demand for premium bridal wear is peaking. Move our drop forward by 48h to capture the high-intent buyer window.",
    urgency: "24 Hours",
  },
];





// ─── Context Setup ────────────────────────────────────────────────────────────

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

type SocialPlatform = "TikTok" | "Instagram" | "Twitter" | "Weibo";

interface SocialMetrics {
  views: string;
  velocity: number;
  sentiment: "Positive" | "Mixed" | "Negative";
  platform: SocialPlatform;
  influencer?: {
    name: string;
    followers: string;
  };
  keywords: string[];
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function IntelligenceProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<BrandConfig[]>(INITIAL_BRANDS);
  const [signals, setSignals] = useState<MarketSignal[]>(mockInitialSignals);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDemoing, setIsDemoing] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const demoTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const brandsRef = useRef(brands);

  useEffect(() => {
    brandsRef.current = brands;
  }, [brands]);

  const triggerMockEvent = useCallback(() => {
    try {
      const newSignal = generateSyntheticSignal(brandsRef.current);
      const newRec = synthesizeRecommendation(newSignal);

      setSignals((prev) => [newSignal, ...prev.slice(0, MAX_SIGNALS - 1)]);
      setRecommendations((prev) => {
        const isDuplicate = prev.some(r => r.title === newRec.title && r.competitor === newRec.competitor);
        if (isDuplicate) return prev;
        return [newRec, ...prev.slice(0, MAX_RECOMMENDATIONS - 1)];
      });
    } catch (error) {
      logger.error("Simulation event failed", error);
    }
  }, []);

  const startLiveDemo = useCallback(() => {
    stopSimulation(); // Ensure random simulation is off
    setIsDemoing(true);

    DEMO_SCRIPT.forEach((step) => {
      const timeout = setTimeout(() => {
        const newSignal: MarketSignal = {
          id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          time: "Just now",
          ...step.signal,
        } as MarketSignal;

        const newRec = synthesizeRecommendation(newSignal);

        setSignals((prev) => [newSignal, ...prev.slice(0, MAX_SIGNALS - 1)]);
        setRecommendations((prev) => {
          const isDuplicate = prev.some(
            (r) => r.title === newRec.title && r.competitor === newRec.competitor
          );
          if (isDuplicate) return prev;
          return [newRec, ...prev.slice(0, MAX_RECOMMENDATIONS - 1)];
        });
      }, step.delay);

      demoTimeoutsRef.current.push(timeout);
    });
  }, []);

  // Manage interval lifecycle cleanly
  useEffect(() => {
    if (isSimulating) {
      // Clear any existing interval before setting a new one (handles React StrictMode double-invoke)
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(triggerMockEvent, SIMULATION_INTERVAL_MS);
    }

    if (!isSimulating && !isDemoing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      demoTimeoutsRef.current.forEach(clearTimeout);
      demoTimeoutsRef.current = [];
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      demoTimeoutsRef.current.forEach(clearTimeout);
    };
  }, [isSimulating, isDemoing, triggerMockEvent]);

  const startSimulation = useCallback(() => {
    setIsDemoing(false);
    demoTimeoutsRef.current.forEach(clearTimeout);
    demoTimeoutsRef.current = [];
    setIsSimulating(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    setIsDemoing(false);
    demoTimeoutsRef.current.forEach(clearTimeout);
    demoTimeoutsRef.current = [];
  }, []);

  const executeStrategy = useCallback((strategy: AIRecommendation) => {
    const newSignal: MarketSignal = {
      id: `action-${Date.now()}`,
      brand: "LuxeLens",
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
      startLiveDemo,
      isSimulating,
      isDemoing,
      executeStrategy,
    }),
    [signals, recommendations, brands, setBrands, triggerMockEvent, startSimulation, stopSimulation, startLiveDemo, isSimulating, isDemoing, executeStrategy]
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
