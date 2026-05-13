"use client";

import React, { useState, lazy, Suspense } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Activity, Play, Square, Loader2 } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";

// ─── Lazy-loaded dashboard panels (code splitting per route) ──────────────────
// Each panel is only downloaded when the user navigates to it — reduces initial bundle

const IntelligenceHub = lazy(() => import("@/components/dashboard/IntelligenceHub"));
const StrategyAI      = lazy(() => import("@/components/dashboard/StrategyAI"));
const PriceWatch      = lazy(() => import("@/components/dashboard/PriceWatch"));
const SocialVelocity  = lazy(() => import("@/components/dashboard/SocialVelocity"));
const SettingsView    = lazy(() => import("@/components/dashboard/SettingsView"));
const MarketAlerts    = lazy(() => import("@/components/dashboard/MarketAlerts"));
const ComingSoon      = lazy(() => import("@/components/dashboard/ComingSoon"));

// ─── Panel Skeleton ───────────────────────────────────────────────────────────

function PanelSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true" aria-label="Loading panel...">
      <div className="glass rounded-[40px] border border-white/5 h-48" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-[40px] border border-white/5 h-32" />
        ))}
      </div>
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabName =
  | "Intelligence Hub"
  | "Strategy AI"
  | "Price Watch"
  | "Social Velocity"
  | "Market Alerts"
  | "Settings";

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { signals, startSimulation, stopSimulation, isSimulating } = useIntelligence();
  const [activeTab, setActiveTab] = useState<TabName>("Intelligence Hub");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showSimulationControls = activeTab !== "Settings" && activeTab !== "Market Alerts";

  function renderPanel() {
    switch (activeTab) {
      case "Intelligence Hub":
        return <IntelligenceHub signals={signals} isSimulating={isSimulating} />;
      case "Strategy AI":
        return <StrategyAI signals={signals} />;
      case "Price Watch":
        return <PriceWatch signals={signals} />;
      case "Social Velocity":
        return <SocialVelocity signals={signals} />;
      case "Settings":
        return <SettingsView />;
      case "Market Alerts":
        return <MarketAlerts signals={signals} />;
      default:
        return <ComingSoon activeTab={activeTab} />;
    }
  }

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as TabName)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className="flex-1 ml-0 lg:ml-64 p-6 lg:p-10 overflow-y-auto max-h-screen"
        id="main-content"
        aria-label={`${activeTab} panel`}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10"
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar-nav"
            >
              <Activity className="w-5 h-5 text-luxury-gold" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-3xl font-light tracking-tight">{activeTab}</h1>
              <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">
                Strategic Market Intelligence Suite
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {showSimulationControls && (
              <div className="flex items-center">
                {!isSimulating ? (
                  <button
                    onClick={startSimulation}
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all group shadow-lg"
                    aria-label="Start market intelligence simulation"
                  >
                    <Play className="w-3.5 h-3.5 fill-green-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <span>Start Simulation</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSimulation}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all group shadow-lg"
                    aria-label="Stop market intelligence simulation"
                  >
                    <Square className="w-3.5 h-3.5 fill-red-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    <span>End Simulation</span>
                  </button>
                )}
                <div className="h-10 w-[1px] bg-white/10 mx-4 hidden sm:block" aria-hidden="true" />
              </div>
            )}

            {/* Live status indicator */}
            <div
              role="status"
              aria-live="polite"
              className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center space-x-3 backdrop-blur-md"
            >
              {isSimulating
                ? <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" aria-hidden="true" />
                : <Activity className="w-4 h-4 text-white/20" aria-hidden="true" />
              }
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {isSimulating ? "AI Pulse Active" : "Feed Paused"}
              </span>
            </div>
          </div>
        </header>

        {/* ── Panel Area ─────────────────────────────────────────────────── */}
        {/* aria-live="polite" announces new signals to screen readers */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
        >
          <ErrorBoundary context={activeTab}>
            <Suspense fallback={<PanelSkeleton />}>
              {renderPanel()}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
