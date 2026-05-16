import React, { useMemo } from "react";
import { Sparkles, Brain, Activity, BarChart3, FileText, AlertTriangle, TrendingUp, Clock, DollarSign } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { PulseItem } from "@/components/ui/PulseItem";
import StrategyPanel from "@/components/dashboard/StrategyPanel";
import { MarketSignal } from "@/lib/intelligence";

interface IntelligenceHubProps {
  signals: MarketSignal[];
  isSimulating: boolean;
}

// ─── ROI Calculation ────────────────────────────────────────────────────────────

function calculateROI(signals: MarketSignal[]) {
  const highImpact = signals.filter(s => s.impact === "High").length;
  const stockouts = signals.filter(s => s.event.includes("Stock")).length;

  // Industry benchmark: luxury e-commerce AOV = $850
  // Stockout arbitrage window = 48 hours
  // Capture rate with real-time response = ~15% of competitor lost demand
  const aov = 850;
  const dailyTrafficLoss = stockouts * 2400; // avg sessions lost per stockout
  const captureRate = 0.15;
  const revenue = Math.floor(dailyTrafficLoss * captureRate * aov);

  return {
    revenueAtRisk: `$${(highImpact * 45_000).toLocaleString()}`,
    opportunityWindow: `${Math.max(0, 48 - (signals.length * 0.5))}h`,
    estimatedCapture: `$${revenue.toLocaleString()}`,
  };
}

export default function IntelligenceHub({ signals, isSimulating }: IntelligenceHubProps) {
  const roi = useMemo(() => calculateROI(signals), [signals]);

  return (
    <>

      {/* ── ROI Widget ─────────────────────────────────────────────────── */}
      <div className="mb-6 bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 border border-luxury-gold/30 rounded-[32px] p-8 shadow-[0_0_40px_rgba(200,160,89,0.1)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-700 group-hover:scale-110">
          <DollarSign className="w-32 h-32 text-luxury-gold" aria-hidden="true" />
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-luxury-gold/20 rounded-xl">
            <TrendingUp className="w-5 h-5 text-luxury-gold" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">Live Revenue Opportunity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Estimated Capture</p>
            <p className="text-4xl font-black text-luxury-gold tracking-tighter">{roi.estimatedCapture}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1 flex items-center space-x-1.5">
              <Clock className="w-3 h-3" />
              <span>Action Window</span>
            </p>
            <p className="text-4xl font-black tracking-tighter">{roi.opportunityWindow}</p>
          </div>
          <div>
            <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest mb-1">Revenue At Risk</p>
            <p className="text-4xl font-black text-red-400 tracking-tighter">{roi.revenueAtRisk}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Visual Similarity" value="89.2%" trend="up" sub="Overlap detected" icon={Sparkles} />
        <StatCard label="Predictive Confidence" value="94%" trend="up" sub="ML Model v2.4" icon={Brain} />
        <StatCard label="Market Velocity" value={isSimulating ? "High" : "Stable"} trend="up" sub="Live Engagement" icon={Activity} />
        <StatCard label="Active Alerts" value={signals.length} trend="stable" sub="3 High Impact" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-8">
          <section className="glass rounded-[40px] p-10 border border-white/5 relative overflow-hidden min-h-[600px] shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-medium flex items-center space-x-3 tracking-tight">
                <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-luxury-gold animate-pulse' : 'bg-white/20'}`}></span>
                <span>Neural Market Pulse</span>
              </h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-luxury-gold transition-colors flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Export JSON Feed</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {signals.length > 0 ? (
                signals.map((signal) => (
                  <PulseItem key={signal.id} {...signal} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-white/20 border border-dashed border-white/10 rounded-3xl">
                  <Activity className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-xs uppercase tracking-widest font-bold">No active signals. Start simulation.</p>
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="xl:col-span-4">
          <StrategyPanel />
        </div>
      </div>
    </>
  );
}
