import React from "react";
import { Brain } from "lucide-react";
import { MarketSignal } from "@/lib/intelligence";

export function PulseItem({ time, brand, event, category, impact, visualSimilarity, prediction, socialMetrics }: MarketSignal) {
  return (
    <div className="flex items-center justify-between border border-white/5 bg-white/[0.01] p-8 rounded-[32px] transition-all duration-1000 animate-in fade-in slide-in-from-right-16 group hover:bg-white/[0.03] hover:border-white/20 shadow-xl">
      <div className="flex items-center space-x-8">
        <div className="w-16 h-16 bg-luxury-charcoal rounded-[24px] flex items-center justify-center font-bold text-2xl border border-white/10 shadow-2xl text-luxury-gold group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
          {brand.charAt(0)}
        </div>
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h4 className="text-xl font-bold group-hover:text-luxury-gold transition-colors tracking-tight">{brand}</h4>
            {visualSimilarity && (
               <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded font-black border border-red-500/20">
                 {Math.floor(visualSimilarity * 100)}% Aesthetic Match
               </span>
            )}
            {socialMetrics && (
               <span className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                 socialMetrics.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
               }`}>
                 {socialMetrics.velocity}% Buzz Velocity
               </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-xs text-white/30">
            <span className="font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">{category}</span>
            <span className="font-medium italic">"{event}"</span>
            {prediction && (
               <span className="flex items-center space-x-1.5 text-luxury-gold/60 font-bold uppercase tracking-tighter">
                 <Brain className="w-3.5 h-3.5" />
                 <span>Predicting move in {prediction.timeframe}</span>
               </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[10px] text-white/20 block mb-4 font-mono font-bold tracking-widest uppercase">{time}</span>
        <span className={`text-[10px] font-black uppercase px-6 py-2 rounded-full border shadow-2xl transition-all ${
          impact === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
          impact === 'Positive' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 
          'bg-white/5 text-white/40 border-white/20'
        }`}>
          {impact} Impact
        </span>
      </div>
    </div>
  );
}
