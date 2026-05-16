import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Brain, Activity, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";

const METRIC_DETAILS: Record<string, any> = {
  "visual-similarity": {
    title: "Visual Similarity",
    value: "89.2%",
    trend: "up",
    sub: "Overlap detected",
    icon: Sparkles,
    description: "AI-driven image analysis comparing competitor catalog imagery to internal SKUs. A high percentage indicates strong design alignment or direct knock-offs."
  },
  "predictive-confidence": {
    title: "Predictive Confidence",
    value: "94%",
    trend: "up",
    sub: "ML Model v2.4",
    icon: Brain,
    description: "Accuracy probability of the intelligence engine's forecasted market moves, based on historical backtesting against luxury e-commerce data."
  },
  "market-velocity": {
    title: "Market Velocity",
    value: "High",
    trend: "up",
    sub: "Live Engagement",
    icon: Activity,
    description: "Real-time measure of social media engagement, search volume spikes, and competitor catalog churn."
  },
  "active-alerts": {
    title: "Active Alerts",
    value: "System Normal",
    trend: "stable",
    sub: "Monitoring...",
    icon: BarChart3,
    description: "A summary of high-priority strategic threats currently requiring executive review or automated counter-measures."
  }
};

export default async function MetricDetailPage({ params }: { params: Promise<{ "metric-id": string }> }) {
  const resolvedParams = await params;
  const metricId = resolvedParams["metric-id"];
  const details = METRIC_DETAILS[metricId] || METRIC_DETAILS["visual-similarity"];
  const Icon = details.icon;

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden p-6 lg:p-10">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight">Metric Detail View</h1>
            <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">
              Deep Dive Analysis
            </p>
          </div>
        </header>

        {/* Detail Panel */}
        <div className="glass rounded-[40px] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <Icon className="w-64 h-64 text-luxury-gold" />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex items-center space-x-6">
              <div className="p-6 bg-luxury-gold/10 border border-luxury-gold/20 rounded-3xl">
                <Icon className="w-12 h-12 text-luxury-gold" />
              </div>
              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-2">{details.title}</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-white/80">{details.value}</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs uppercase tracking-widest font-bold flex items-center space-x-1">
                    {details.trend === "up" && <TrendingUp className="w-3 h-3 text-green-400" />}
                    {details.trend === "down" && <TrendingDown className="w-3 h-3 text-red-400" />}
                    {details.trend === "stable" && <Minus className="w-3 h-3 text-white/40" />}
                    <span className={details.trend === 'up' ? 'text-green-400' : details.trend === 'down' ? 'text-red-400' : 'text-white/40'}>
                      {details.trend}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold">Metric Definition</h3>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                {details.description}
              </p>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-end">
              <Link 
                href="/"
                className="px-8 py-3 bg-white text-luxury-charcoal rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
