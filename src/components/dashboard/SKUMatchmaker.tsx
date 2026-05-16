"use client";

import React, { useMemo } from "react";
import { Sparkles, ArrowRight, ShoppingBag, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";
import { findSKUMatches } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

export default function SKUMatchmaker() {
  const { brands } = useIntelligence();
  
  const matches = useMemo(() => findSKUMatches(brands), [brands]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light tracking-tight mb-2">SKU Matchmaker</h2>
          <p className="text-muted text-sm max-w-xl">
            Autonomous visual similarity engine matching competitor stockouts and price gaps with your active inventory.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-luxury-gold/10 px-4 py-2 rounded-full border border-luxury-gold/20">
          <Sparkles className="w-4 h-4 text-luxury-gold" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
            {matches.length} Arbitrage Opportunities
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {matches.map((match, idx) => (
          <div 
            key={`${match.competitorSku.id}-${match.ourSku.id}`}
            className="glass rounded-[32px] overflow-hidden group hover:border-luxury-gold/30 transition-all duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-11 items-center">
              
              {/* Competitor Product */}
              <div className="lg:col-span-4 p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500/80">Competitor</span>
                  <span className="text-[10px] font-mono text-muted">{match.competitorSku.sku}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{match.competitorSku.name}</h3>
                  <p className="text-xs text-muted font-bold uppercase tracking-tighter mt-0.5">{match.competitorSku.brand}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted uppercase font-bold">Price</p>
                    <p className="font-mono text-sm">₹{match.competitorSku.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-muted uppercase font-bold">Inventory</p>
                    <p className={cn(
                      "text-sm font-bold",
                      match.competitorSku.stock === 0 ? "text-red-500" : "text-amber-500"
                    )}>
                      {match.competitorSku.stock === 0 ? "OUT OF STOCK" : `${match.competitorSku.stock} units`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match Indicator */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 bg-luxury-gold/5 relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <TrendingUp className="w-24 h-24 text-luxury-gold" />
                </div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center border border-luxury-gold/30 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">Match Confidence</p>
                    <p className="text-xl font-bold">{(match.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    match.arbitrageType === "Stockout" 
                      ? "bg-red-500/10 border-red-500/20 text-red-500" 
                      : "bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold"
                  )}>
                    {match.arbitrageType} Opportunity
                  </div>
                </div>
              </div>

              {/* Our Product */}
              <div className="lg:col-span-4 p-8 space-y-4 bg-luxury-gold/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Internal Inventory</span>
                  <span className="text-[10px] font-mono text-muted">{match.ourSku.sku}</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{match.ourSku.name}</h3>
                  <p className="text-xs text-luxury-gold font-bold uppercase tracking-tighter mt-0.5">Your Collection</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted uppercase font-bold">Price</p>
                    <p className="font-mono text-sm">₹{match.ourSku.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-muted uppercase font-bold">Inventory</p>
                    <p className="text-sm font-bold text-green-500">
                      {match.ourSku.stock} units (High)
                    </p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Quick Actions Footer */}
            <div className="border-t border-card-border p-4 bg-black/10 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-muted uppercase">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>Competitor loss is your gain. Deploy targeting now.</span>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/10 transition-all">
                  Analyze Visibility
                </button>
                <button className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest bg-luxury-gold text-luxury-charcoal hover:bg-white transition-all flex items-center space-x-2">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Launch Campaign</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
