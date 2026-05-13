"use client";

import React, { useState } from "react";
import { BrainCircuit, ArrowUpRight, Loader2, CheckCircle2 } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";

export default function StrategyPanel() {
  const { recommendations } = useIntelligence();
  const [executingId, setExecutingId] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const handleExecute = (id: number) => {
    setExecutingId(id);
    // Simulate API call to execute strategy
    setTimeout(() => {
      setExecutingId(null);
      setCompletedIds(prev => [...prev, id]);
    }, 2000);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-5 h-5 text-luxury-gold" />
          <h2 className="text-lg font-semibold tracking-tight">AI Strategy Engine</h2>
        </div>
        <div className="flex items-center space-x-2">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-gold"></span>
           </span>
           <span className="text-[10px] text-luxury-gold uppercase tracking-widest font-bold">
             Synthesizing
           </span>
        </div>
      </div>

      <div className="grid gap-4">
        {recommendations.length === 0 ? (
          <div className="glass p-8 rounded-xl border border-white/5 text-center text-white/20 italic text-sm">
            Monitoring market for strategic shifts...
          </div>
        ) : (
          recommendations.map((rec) => {
            const isExecuting = executingId === rec.id;
            const isCompleted = completedIds.includes(rec.id);

            return (
              <div key={rec.id} className={`glass p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
                isCompleted ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-white/5 hover:border-luxury-gold/30'
              }`}>
                {isCompleted && (
                  <div className="absolute top-0 right-0 p-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`font-semibold transition-colors ${isCompleted ? 'text-green-400' : 'text-white group-hover:text-luxury-gold'}`}>
                      {rec.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5 uppercase tracking-wider">vs {rec.competitor}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border ${
                    rec.threat === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {rec.threat}
                  </span>
                </div>
                
                <div className="bg-white/[0.03] rounded-xl p-4 mb-5 border border-white/5">
                  <p className="text-xs text-white/70 leading-relaxed italic">
                    "{rec.logic}"
                  </p>
                </div>

                <button 
                  onClick={() => !isCompleted && handleExecute(rec.id)}
                  disabled={isExecuting || isCompleted}
                  className={`w-full font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 uppercase tracking-widest shadow-lg ${
                    isCompleted 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default' 
                      : isExecuting
                        ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 cursor-wait'
                        : 'bg-luxury-gold text-luxury-charcoal hover:bg-white hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting Orders...</span>
                    </>
                  ) : isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Strategy Implemented</span>
                    </>
                  ) : (
                    <>
                      <span>Execute {rec.action}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
