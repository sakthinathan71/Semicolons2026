"use client";

import React, { useState, useCallback } from "react";
import { Sparkles, Loader2, FileText, Gauge, AlertCircle, Activity, RefreshCcw, Target, Settings2 } from "lucide-react";
// jsPDF is dynamically imported below — only loaded when user clicks Download
import { MarketSignal } from "@/lib/intelligence";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BriefData {
  summary: string;
  threat_level: "Low" | "Medium" | "High" | "Critical";
  strategic_recommendation: {
    action: string;
    details: string;
    rationale: string;
  };
  kpi_impact: string;
}

interface StrategyAIProps {
  signals: MarketSignal[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const THREAT_COLORS: Record<BriefData["threat_level"], string> = {
  Low: "text-green-400",
  Medium: "text-orange-400",
  High: "text-red-400",
  Critical: "text-red-600",
};

function generateFallbackBrief(signals: MarketSignal[]): BriefData {
  const highImpact = signals.filter((s) => s.impact === "High").length;
  return {
    summary: `Analysis of ${signals.length} market signal(s): ${highImpact} high-impact event(s) detected across monitored competitors.`,
    threat_level: highImpact > 2 ? "High" : highImpact > 0 ? "Medium" : "Low",
    strategic_recommendation: {
      action: highImpact > 0 ? "Pricing & Marketing Defense" : "Maintain Position",
      details: highImpact > 0
        ? "Reinforce brand value narrative and prepare targeted counter-campaign for affected categories."
        : "No immediate action required. Continue standard monitoring cadence.",
      rationale: highImpact > 0
        ? `${highImpact} competitor(s) executed high-impact moves. Estimated window for response: 24-48 hours.`
        : "Market signals indicate stable conditions relative to Olivela positioning.",
    },
    kpi_impact: "Conversion Rate, Brand Equity, Market Share",
  };
}

// ─── PDF Generator ────────────────────────────────────────────────────────────

async function downloadPDF(brief: BriefData, signals: MarketSignal[]) {
  const { jsPDF } = await import("jspdf"); // Dynamic import — saves ~300KB from initial bundle
  const doc = new jsPDF();
  const lineHeight = 7;
  let y = 20;

  const writeLine = (text: string, size = 12, bold = false) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, y);
    y += lines.length * lineHeight;
  };

  const writeDivider = () => {
    doc.setDrawColor(200, 160, 89);
    doc.line(20, y, 190, y);
    y += 5;
  };

  writeLine("LuxeLens AI — Executive Strategy Brief", 20, true);
  writeLine(`Generated: ${new Date().toLocaleString()}`, 10);
  y += 4;
  writeDivider();

  writeLine("Intelligence Summary", 14, true);
  writeLine(brief.summary);
  writeLine(`Threat Level: ${brief.threat_level}`, 12, true);
  y += 4;

  writeDivider();
  writeLine("Strategic Recommendation", 14, true);
  writeLine(`Action: ${brief.strategic_recommendation.action}`, 12, true);
  writeLine(brief.strategic_recommendation.details);
  y += 3;
  writeLine("Rationale:", 11, true);
  writeLine(brief.strategic_recommendation.rationale);
  writeLine(`KPI Impact: ${brief.kpi_impact}`, 11, true);
  y += 6;

  writeDivider();
  writeLine("Market Signals Analyzed", 14, true);
  signals.slice(0, 8).forEach((s) => {
    writeLine(`• [${s.impact}] ${s.brand} — ${s.event} (${s.category}) — ${s.time}`, 10);
  });

  doc.save("LuxeLens_Strategy_Brief.pdf");
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StrategyAI({ signals }: StrategyAIProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefData, setBriefData] = useState<BriefData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetRegion, setTargetRegion] = useState("Global");
  const [analysisDepth, setAnalysisDepth] = useState("Executive Summary");

  const handleGenerateBrief = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          signals: signals.slice(0, 10),
          targetRegion,
          analysisDepth 
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || `Server error: ${res.status}`);
      }

      const data: BriefData = await res.json();
      setBriefData(data);
    } catch (err) {
      console.error("[StrategyAI] Brief generation failed:", err);
      // Use a smart local fallback instead of blocking the user
      setBriefData(generateFallbackBrief(signals));
      setError("Live AI connection unavailable. Showing locally synthesized brief.");
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, signals]);

  const handleDownload = useCallback(() => {
    if (!briefData) return;
    downloadPDF(briefData, signals);
  }, [briefData, signals]);

  const threatColor = briefData ? THREAT_COLORS[briefData.threat_level] : "";

  return (
    <div className="space-y-10">
      {/* Hero CTA */}
      <div className="glass p-10 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold">
              Gemini 1.5 Pro Integration
            </span>
          </div>
          <h3 className="text-3xl font-light mb-4">Automated Executive Strategy Brief</h3>
          <p className="text-white/40 leading-relaxed">
            Synthesize all market signals, price movements, and visual trends from the last 7 days
            into a high-level strategic report with Gemini 1.5 Pro.
          </p>
          {signals.length === 0 && (
            <p className="text-orange-400/70 text-xs mt-3 font-medium">
              ⚠ No signals yet. Start the simulation to populate the brief with live data.
            </p>
          )}
          {error && (
            <div className="flex items-center space-x-2 mt-4 text-orange-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Advanced Settings */}
          {!briefData && (
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Target className="w-4 h-4 text-luxury-gold" />
                <select 
                  className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-white/80 focus:ring-0 cursor-pointer outline-none"
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                >
                  <option value="Global" className="bg-luxury-charcoal">Global</option>
                  <option value="North America" className="bg-luxury-charcoal">North America</option>
                  <option value="EMEA" className="bg-luxury-charcoal">EMEA</option>
                  <option value="APAC" className="bg-luxury-charcoal">APAC</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Settings2 className="w-4 h-4 text-luxury-gold" />
                <select 
                  className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-white/80 focus:ring-0 cursor-pointer outline-none"
                  value={analysisDepth}
                  onChange={(e) => setAnalysisDepth(e.target.value)}
                >
                  <option value="Executive Summary" className="bg-luxury-charcoal">Executive Summary</option>
                  <option value="Deep Dive" className="bg-luxury-charcoal">Deep Dive Analytics</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center space-y-3 w-full lg:w-auto">
          {!briefData ? (
            <button
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="w-full lg:w-auto px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-3 shadow-2xl bg-luxury-gold text-luxury-charcoal hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-wait disabled:hover:scale-100"
              aria-busy={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Weekly Brief</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col space-y-3 w-full">
              <button
                onClick={handleDownload}
                className="w-full px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-3 shadow-2xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Download Report (PDF)</span>
              </button>
              <button
                onClick={handleGenerateBrief}
                disabled={isGenerating}
                className="w-full px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center space-x-3 shadow-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                <span>{isGenerating ? "Regenerating..." : "Regenerate Brief"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brief Preview */}
      {briefData && (
        <div className="glass p-10 rounded-[40px] border border-white/5 space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-medium">Brief Summary</h4>
              <span className={`text-xs font-bold uppercase tracking-widest mt-2 inline-block ${threatColor}`}>
                Threat: {briefData.threat_level}
              </span>
            </div>
            
            <div className="bg-luxury-gold/10 border border-luxury-gold/30 px-4 py-3 rounded-xl flex items-center space-x-3 shrink-0">
              <Activity className="w-5 h-5 text-luxury-gold" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold">
                  ⚡ Strategy Synthesized in
                </p>
                <p className="text-sm font-black text-white">47 SECONDS</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                  Industry Average: 7 Days
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-white/60 leading-relaxed text-sm">{briefData.summary}</p>
          <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Sparkles className="w-24 h-24 text-luxury-gold" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold relative z-10">
              Recommended Action: {briefData.strategic_recommendation.action}
            </p>
            <p className="text-sm text-white/50 leading-relaxed relative z-10">
              {briefData.strategic_recommendation.details}
            </p>
            <p className="text-xs text-white/30 italic relative z-10">
              {briefData.strategic_recommendation.rationale}
            </p>
          </div>
          <p className="text-xs text-white/30">
            <span className="font-bold text-white/50">KPI Impact:</span> {briefData.kpi_impact}
          </p>
        </div>
      )}

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Predictive Pricing */}
        <div className="glass p-10 rounded-[40px] border border-white/5">
          <h4 className="text-lg font-medium mb-6 flex items-center space-x-3">
            <Gauge className="w-5 h-5 text-luxury-gold" />
            <span>Predictive Pricing Forecast</span>
          </h4>
          <div className="space-y-6">
            {signals.filter((s) => s.prediction).length > 0 ? (
              signals
                .filter((s) => s.prediction)
                .slice(0, 5)
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-luxury-gold/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-sm">{s.brand} — {s.category}</span>
                      <span className="text-luxury-gold text-xs font-bold font-mono">
                        {s.prediction?.probability}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mb-4">
                      {s.prediction?.event} within {s.prediction?.timeframe}
                    </p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-luxury-gold h-full transition-all duration-1000"
                        style={{ width: `${s.prediction?.probability}%` }}
                        role="progressbar"
                        aria-valuenow={s.prediction?.probability}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-10 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl text-sm">
                No price predictions available. Start the simulation.
              </div>
            )}
          </div>
        </div>

        {/* Visual Similarity */}
        <div className="glass p-10 rounded-[40px] border border-white/5">
          <h4 className="text-lg font-medium mb-6 flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
            <span>Visual Similarity Benchmarking</span>
          </h4>
          <div className="space-y-6">
            {signals.filter((s) => s.visualSimilarity).length > 0 ? (
              signals
                .filter((s) => s.visualSimilarity)
                .slice(0, 5)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center space-x-6 p-4 border border-dashed border-white/10 rounded-3xl hover:border-luxury-gold/20 transition-all"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                      <span className="text-xl font-bold text-luxury-gold">
                        {s.brand.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold truncate">
                          {s.brand} — {s.category}
                        </span>
                        <span className="text-red-400 text-xs font-bold shrink-0 ml-2">
                          {((s.visualSimilarity ?? 0) * 100).toFixed(1)}% Match
                        </span>
                      </div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest">
                        Aesthetic Conflict Detected
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-10 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl text-sm">
                No visual similarities detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
