import React, { memo } from "react";
import { LucideIcon, ArrowUpRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type TrendDirection = "up" | "down" | "stable";

interface StatCardProps {
  label: string;
  value: string | number;
  trend: TrendDirection;
  sub: string;
  icon: LucideIcon;
}

// ─── Trend Config ─────────────────────────────────────────────────────────────

const TREND_CONFIG: Record<TrendDirection, { Icon: LucideIcon; color: string; ariaLabel: string }> = {
  up:     { Icon: TrendingUp,   color: "text-green-400",  ariaLabel: "Trending up" },
  down:   { Icon: TrendingDown, color: "text-red-400",    ariaLabel: "Trending down" },
  stable: { Icon: Minus,        color: "text-white/30",   ariaLabel: "Stable" },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Displays a single KPI metric card.
 * Memoised — only re-renders when its own props change.
 */
export const StatCard = memo(function StatCard({ label, value, trend, sub, icon: Icon }: StatCardProps) {
  const trendConfig = TREND_CONFIG[trend];

  return (
    <article
      className="glass p-8 rounded-[40px] border border-white/5 hover:border-luxury-gold/20 transition-all duration-500 group relative overflow-hidden"
      aria-label={`${label}: ${value}`}
    >
      {/* Decorative background icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
        <Icon className="w-20 h-20" />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 bg-luxury-gold/5 rounded-[20px] border border-luxury-gold/10 group-hover:bg-luxury-gold/15 transition-colors shadow-inner">
          <Icon className="w-6 h-6 text-luxury-gold" aria-hidden="true" />
        </div>

        {/* Trend indicator */}
        <div
          className={cn("flex items-center space-x-1", trendConfig.color)}
          aria-label={trendConfig.ariaLabel}
        >
          <trendConfig.Icon className="w-4 h-4" aria-hidden="true" />
          <span className="text-[10px] font-black uppercase tracking-tighter">{trend}</span>
        </div>
      </div>

      <p className="text-3xl font-bold mb-1 tracking-tighter tabular-nums">{value}</p>
      <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-black">{label}</p>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black italic">{sub}</p>
        <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-luxury-gold transition-colors" aria-hidden="true" />
      </div>
    </article>
  );
});
