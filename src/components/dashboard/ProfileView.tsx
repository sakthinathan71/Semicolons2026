"use client";

import React from "react";
import { User, Shield, Zap, Activity, Clock, MapPin, Key, LogOut, Sparkles, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntelligence } from "@/lib/IntelligenceContext";

export default function ProfileView() {
  const { isSimulating, signals } = useIntelligence();

  const stats = [
    { label: "Strategic Clearance", value: "Level 4 (Omni)", icon: Shield, color: "text-blue-400" },
    { label: "Intelligence Velocity", value: "14.2 ops/sec", icon: Activity, color: "text-green-400" },
    { label: "Active Nodes", value: "12 Global", icon: MapPin, color: "text-luxury-gold" },
    { label: "Session Integrity", value: "99.9%", icon: Key, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── Executive Header ────────────────────────────────────────────────── */}
      <div className="glass rounded-[40px] border border-luxury-slate p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <User className="w-64 h-64 text-luxury-gold" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5 border-2 border-luxury-gold/30 flex items-center justify-center overflow-hidden shadow-2xl">
              <User className="w-16 h-16 text-luxury-gold" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-luxury-charcoal border border-luxury-gold/30 rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="w-5 h-5 text-luxury-gold fill-luxury-gold" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h2 className="text-4xl font-light tracking-tight text-white">Executive Director</h2>
              <span className="bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mx-auto md:mx-0">
                Authorized: Sakthi Nathan
              </span>
            </div>
            <p className="text-white/40 max-w-2xl font-light leading-relaxed">
              Managing Director of Global Strategy at LuxeLens Intelligence. Overseeing omni-channel pricing integrity and competitive market arbitration across 12 high-velocity retail nodes.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
               <div className="flex items-center space-x-2 text-[10px] text-white/60 font-bold uppercase tracking-widest">
                  <Clock className="w-4 h-4 text-luxury-gold" />
                  <span>Last Active: 2m ago</span>
               </div>
               <div className="flex items-center space-x-2 text-[10px] text-white/60 font-bold uppercase tracking-widest">
                  <MapPin className="w-4 h-4 text-luxury-gold" />
                  <span>Location: Singapore Node</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Strategic Synthesis ───────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-[40px] border border-luxury-slate p-8 space-y-6 h-full">
            <h3 className="text-xl font-medium tracking-tight flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span>AI Strategic Synthesis</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-start">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">+12.4% Revenue Gap</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white/90">Arbitrage Efficiency</h4>
                    <p className="text-xs text-white/40 mt-1">Successfully captured 8 opportunites via SKU matching in the last 24h.</p>
                  </div>
               </div>

               <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-start">
                    <BarChart3 className="w-6 h-6 text-luxury-gold" />
                    <span className="text-[10px] font-black text-luxury-gold uppercase tracking-widest">Premium Tier</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white/90">Market Sentiment</h4>
                    <p className="text-xs text-white/40 mt-1">Social velocity analysis indicates positive brand lift in Sabyasachi segment.</p>
                  </div>
               </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-white/50 italic leading-relaxed border-l-2 border-luxury-gold/30 pl-6">
                "System intelligence is currently optimized for margin expansion. The AI Pulse remains active with 0.4ms latency between signal detection and recommendation synthesis. Priority focus: New Delhi Bridal Market."
              </p>
            </div>
          </div>
        </div>

        {/* ── System Status (AI Pulse) ─────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="glass rounded-[40px] border border-luxury-slate p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium tracking-tight">System Status</h3>
              <div className={cn(
                "w-3 h-3 rounded-full animate-ping",
                isSimulating ? "bg-green-500" : "bg-red-500"
              )} />
            </div>

            <div className="space-y-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-luxury-gold/20 transition-colors">
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{stat.label}</p>
                      <p className="text-sm font-bold text-white/80">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5">
              <button className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3">
                <LogOut className="w-4 h-4" />
                <span>Terminate Session</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
