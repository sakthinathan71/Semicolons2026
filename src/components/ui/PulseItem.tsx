import React, { memo } from "react";
import { Brain } from "lucide-react";
import { MarketSignal, SignalImpact } from "@/lib/intelligence";
import { cn } from "@/lib/utils";

// ─── Impact Badge Config ──────────────────────────────────────────────────────

const IMPACT_STYLES: Record<SignalImpact, { bg: string; text: string; border: string; label: string }> = {
  High:     { bg: "bg-red-500/10",    text: "text-red-400",   border: "border-red-500/30",   label: "High Impact" },
  Medium:   { bg: "bg-orange-500/10", text: "text-orange-400",border: "border-orange-500/30",label: "Medium Impact" },
  Low:      { bg: "bg-blue-500/10",   text: "text-blue-400",  border: "border-blue-500/30",  label: "Low Impact" },
  Positive: { bg: "bg-green-500/10",  text: "text-green-400", border: "border-green-500/30", label: "Positive Impact" },
  Neutral:  { bg: "bg-white/5",       text: "text-white/40",  border: "border-white/20",     label: "Neutral" },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PulseItemProps extends MarketSignal {}

/**
 * Displays a single live market signal event in the intelligence feed.
 * Memoised to avoid unnecessary re-renders when sibling signals update.
 */
export const PulseItem = memo(function PulseItem({
  time,
  brand,
  event,
  category,
  impact,
  visualSimilarity,
  prediction,
  socialMetrics,
}: PulseItemProps) {
  const impactStyle = IMPACT_STYLES[impact] ?? IMPACT_STYLES.Neutral;
  const similarity = visualSimilarity != null ? Math.floor(visualSimilarity * 100) : null;

  return (
    <article
      className="flex items-center justify-between border border-white/5 bg-white/[0.01] p-8 rounded-[32px] transition-all duration-700 animate-in fade-in slide-in-from-right-8 group hover:bg-white/[0.03] hover:border-white/20 shadow-xl"
      aria-label={`${brand}: ${event}`}
    >
      <div className="flex items-center space-x-8 min-w-0">
        {/* Brand Avatar */}
        <div
          className="w-16 h-16 bg-luxury-charcoal rounded-[24px] flex items-center justify-center font-bold text-2xl border border-white/10 shadow-2xl text-luxury-gold group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shrink-0"
          aria-hidden="true"
        >
          {brand.charAt(0).toUpperCase()}
        </div>

        {/* Signal Details */}
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h3 className="text-xl font-bold group-hover:text-luxury-gold transition-colors tracking-tight">
              {brand}
            </h3>

            {/* Visual Similarity Badge — includes text for colorblind accessibility */}
            {similarity != null && (
              <span
                className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded font-black border border-red-500/20"
                aria-label={`${similarity}% aesthetic match detected`}
              >
                {similarity}% Aesthetic Match
              </span>
            )}

            {/* Social Velocity Badge */}
            {socialMetrics != null && (
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded font-black border",
                  socialMetrics.sentiment === "Positive"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : socialMetrics.sentiment === "Negative"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                )}
                aria-label={`${socialMetrics.velocity}% engagement velocity, ${socialMetrics.sentiment} sentiment`}
              >
                {socialMetrics.velocity}% Buzz · {socialMetrics.sentiment}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/30">
            <span className="font-bold uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
              {category}
            </span>
            <span className="font-medium italic">"{event}"</span>
            {prediction != null && (
              <span className="flex items-center space-x-1.5 text-luxury-gold/60 font-bold uppercase tracking-tighter">
                <Brain className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Predicting move in {prediction.timeframe}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Impact Badge + Time */}
      <div className="text-right shrink-0 ml-4">
        <time
          className="text-[10px] text-white/20 block mb-4 font-mono font-bold tracking-widest uppercase"
          dateTime={time}
        >
          {time}
        </time>
        <span
          className={cn(
            "text-[10px] font-black uppercase px-6 py-2 rounded-full border shadow-2xl transition-all",
            impactStyle.bg,
            impactStyle.text,
            impactStyle.border
          )}
          aria-label={impactStyle.label}
        >
          {impact} Impact
        </span>
      </div>
    </article>
  );
});
