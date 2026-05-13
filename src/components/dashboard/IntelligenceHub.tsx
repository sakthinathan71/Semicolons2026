import React from "react";
import { Sparkles, Brain, Activity, BarChart3, FileText } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { PulseItem } from "@/components/ui/PulseItem";
import StrategyPanel from "@/components/dashboard/StrategyPanel";
import { MarketSignal } from "@/lib/intelligence";

interface IntelligenceHubProps {
  signals: MarketSignal[];
  isSimulating: boolean;
}

export default function IntelligenceHub({ signals, isSimulating }: IntelligenceHubProps) {
  return (
    <>
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
