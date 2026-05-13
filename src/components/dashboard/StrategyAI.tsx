import React, { useState } from "react";
import { Sparkles, Loader2, FileText, Gauge, Brain } from "lucide-react";
import { jsPDF } from "jspdf";
import { MarketSignal } from "@/lib/intelligence";

interface StrategyAIProps {
  signals: MarketSignal[];
}

export default function StrategyAI({ signals }: StrategyAIProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefReady, setBriefReady] = useState(false);
  const [briefData, setBriefData] = useState<any>(null);

  const generateBrief = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signals: signals.slice(0, 10) }) // Send recent signals
      });
      
      if (!res.ok) throw new Error("Failed to generate brief");
      
      const data = await res.json();
      setBriefData(data);
      setBriefReady(true);
    } catch (err) {
      console.error(err);
      // Fallback in case of error
      setBriefData({
        summary: "Error generating brief. Using static fallback.",
        threat_level: "High",
        strategic_recommendation: {
          action: "Review System Connection",
          details: "API connection failed.",
          rationale: "Network error or API limit reached."
        },
        kpi_impact: "Unknown"
      });
      setBriefReady(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("LuxeLens AI: Executive Strategy Brief", 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
      doc.text("--------------------------------------------------", 20, 35);
      
      doc.setFontSize(16);
      doc.text("Market Intelligence Summary", 20, 50);
      doc.setFontSize(12);
      
      // Dynamic summary from AI
      const splitSummary = doc.splitTextToSize(briefData?.summary || "No summary available.", 170);
      doc.text(splitSummary, 20, 60);
      
      let y = 60 + (splitSummary.length * 7);
      
      doc.setFontSize(14);
      doc.text(`Threat Level: ${briefData?.threat_level || 'Unknown'}`, 20, y);
      y += 10;

      doc.setFontSize(16);
      doc.text("Strategic Recommendations", 20, y + 10);
      y += 20;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Action: ${briefData?.strategic_recommendation?.action || 'N/A'}`, 20, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      const splitDetails = doc.splitTextToSize(briefData?.strategic_recommendation?.details || "No details.", 170);
      doc.text(splitDetails, 20, y);
      y += (splitDetails.length * 7);
      
      const splitRationale = doc.splitTextToSize(`Rationale: ${briefData?.strategic_recommendation?.rationale || "N/A"}`, 170);
      doc.text(splitRationale, 20, y);
      y += (splitRationale.length * 7);
      
      doc.text(`KPI Impact: ${briefData?.kpi_impact || 'N/A'}`, 20, y + 5);

      doc.save("LuxeLens_Strategy_Brief.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="glass p-10 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
             <Sparkles className="w-5 h-5 text-luxury-gold" />
             <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold">Level 2 AI Integration</span>
          </div>
          <h3 className="text-3xl font-light mb-4">Automated Executive Strategy Brief</h3>
          <p className="text-white/40 leading-relaxed">
            Synthesize all market signals, price movements, and visual trends from the last 7 days into a 
            high-level strategic report with Gemini 1.5 Pro.
          </p>
        </div>
        <button 
          onClick={briefReady ? downloadReport : generateBrief}
          disabled={isGenerating}
          className={`px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center space-x-3 shadow-2xl ${
            briefReady ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:scale-105 active:scale-95' : 'bg-luxury-gold text-luxury-charcoal hover:scale-105 active:scale-95'
          }`}
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /><span>Synthesizing...</span></>
          ) : briefReady ? (
            <><FileText className="w-4 h-4" /><span>Download Report (PDF)</span></>
          ) : (
            <><FileText className="w-4 h-4" /><span>Generate Weekly Brief</span></>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass p-10 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-3">
              <Gauge className="w-5 h-5 text-luxury-gold" />
              <span>Predictive Pricing Forecast</span>
            </h4>
            <div className="space-y-6">
               {signals.filter(s => s.prediction).length > 0 ? (
                 signals.filter(s => s.prediction).map((s, i) => (
                   <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-luxury-gold/30 transition-all">
                      <div className="flex justify-between items-start mb-3">
                         <span className="font-bold text-sm">{s.brand} Forecasting</span>
                         <span className="text-luxury-gold text-xs font-bold font-mono">{s.prediction?.probability}% Confidence</span>
                      </div>
                      <p className="text-xs text-white/40 mb-4">{s.prediction?.event} within {s.prediction?.timeframe}</p>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-luxury-gold h-full transition-all duration-1000" style={{ width: `${s.prediction?.probability}%` }}></div>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-10 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                   No price predictions available.
                 </div>
               )}
            </div>
         </div>

         <div className="glass p-10 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span>Visual Similarity Benchmarking</span>
            </h4>
            <div className="space-y-6">
               {signals.filter(s => s.visualSimilarity).length > 0 ? (
                 signals.filter(s => s.visualSimilarity).map((s, i) => (
                   <div key={i} className="flex items-center space-x-6 p-4 border border-dashed border-white/10 rounded-3xl">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                         <FileText className="w-6 h-6 text-white/20" />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold">{s.brand} {s.category}</span>
                            <span className="text-red-400 text-xs font-bold">{((s.visualSimilarity || 0) * 100).toFixed(1)}% Match</span>
                         </div>
                         <p className="text-[10px] text-white/20 uppercase tracking-widest">Aesthetic Conflict Detected</p>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-10 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                   No visual similarities detected.
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
