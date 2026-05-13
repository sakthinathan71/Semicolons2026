"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import StrategyPanel from "@/components/dashboard/StrategyPanel";
import { TrendingDown, TrendingUp, BarChart3, Activity, Play, Square, Loader2, FileText, Sparkles, Brain, ArrowUpRight, Gauge, Users, Share2, Heart, MessageCircle, Settings as SettingsIcon, Plus, Globe, Camera, Trash2, Bell, ShieldAlert, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";
import { jsPDF } from "jspdf";

export default function Dashboard() {
  const { signals, startSimulation, stopSimulation, isSimulating } = useIntelligence();
  const [activeTab, setActiveTab] = useState("Intelligence Hub");

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-light tracking-tight">{activeTab}</h2>
            <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">Strategic Market Intelligence Suite</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {activeTab !== "Settings" && activeTab !== "Market Alerts" && (
              <>
                {!isSimulating ? (
                  <button onClick={startSimulation} className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all group">
                    <Play className="w-3.5 h-3.5 fill-green-400 group-hover:scale-110 transition-transform" />
                    <span>Start Simulation</span>
                  </button>
                ) : (
                  <button onClick={stopSimulation} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all group">
                    <Square className="w-3.5 h-3.5 fill-red-400 group-hover:scale-110 transition-transform" />
                    <span>End Simulation</span>
                  </button>
                )}
                <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
              </>
            )}

            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center space-x-3">
              {isSimulating ? <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" /> : <Activity className="w-4 h-4 text-white/20" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {isSimulating ? "AI Pulse Active" : "Feed Paused"}
              </span>
            </div>
          </div>
        </header>

        {activeTab === "Intelligence Hub" ? (
          <IntelligenceHub signals={signals} isSimulating={isSimulating} />
        ) : activeTab === "Strategy AI" ? (
          <StrategyAI signals={signals} />
        ) : activeTab === "Price Watch" ? (
          <PriceWatch signals={signals} />
        ) : activeTab === "Social Velocity" ? (
          <SocialVelocity signals={signals} />
        ) : activeTab === "Settings" ? (
          <SettingsView />
        ) : activeTab === "Market Alerts" ? (
          <MarketAlerts signals={signals} />
        ) : (
          <ComingSoon activeTab={activeTab} />
        )}
      </main>
    </div>
  );
}

function MarketAlerts({ signals }: any) {
  const criticalAlerts = signals.filter((s: any) => s.impact === "High");

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-8">
          <section className="glass p-10 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-medium mb-8 flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              <span>Critical Security & Pricing Alerts</span>
            </h3>

            <div className="space-y-4">
              {criticalAlerts.length === 0 ? (
                <div className="py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                   No critical threats detected. Monitoring 8 luxury storefronts...
                </div>
              ) : (
                criticalAlerts.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-red-500/[0.02] border border-red-500/10 rounded-3xl group hover:bg-red-500/[0.05] transition-all">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold border border-red-500/20 text-red-400">
                        !
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="font-bold text-lg text-white">{s.brand} Incident</h4>
                          <span className="bg-red-500/20 text-red-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30 tracking-widest">Urgent Response</span>
                        </div>
                        <p className="text-sm text-white/40 mt-1">{s.event} detected in {s.category}. AI predicts immediate inventory shift.</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-2">{s.time}</p>
                       <button className="text-[10px] font-black uppercase tracking-widest text-red-400 underline decoration-red-500/30 underline-offset-4">Mitigate Threat</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-8">
          <section className="glass p-8 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-luxury-gold" />
              <span>Notification Nodes</span>
            </h4>
            <div className="space-y-4">
               <NotificationChannel icon={Mail} label="Executive Email Brief" status="Active" />
               <NotificationChannel icon={MessageSquare} label="Slack Intelligence" status="Active" />
               <NotificationChannel icon={Smartphone} label="SMS High-Impact Alerts" status="Standby" />
            </div>
          </section>

          <section className="glass p-8 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02]">
            <h4 className="text-lg font-medium mb-4">Alert Thresholds</h4>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Define the sensitivity of our neural monitoring agents. Currently tuned for "High Precision."
            </p>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Pricing Floor Breach</span>
                  <span className="text-luxury-gold font-bold">5.0%</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-luxury-gold h-full w-[40%]"></div>
               </div>
               <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-white/60">Social Velocity Spike</span>
                  <span className="text-luxury-gold font-bold">80%</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-luxury-gold h-full w-[80%]"></div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function NotificationChannel({ icon: Icon, label, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
       <div className="flex items-center space-x-3">
          <Icon className="w-4 h-4 text-white/20" />
          <span className="text-xs font-medium text-white/60">{label}</span>
       </div>
       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}>
         {status}
       </span>
    </div>
  );
}

function SettingsView() {
  const { brands, setBrands } = useIntelligence();
  const [newName, setNewName] = useState("");
  const [newWeb, setNewWeb] = useState("");
  const [newInsta, setNewInsta] = useState("");

  const addBrand = () => {
    if (!newName) return;
    const newBrand = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      website: newWeb,
      instagram: newInsta,
      isCompetitor: true
    };
    setBrands([...brands, newBrand]);
    setNewName("");
    setNewWeb("");
    setNewInsta("");
  };

  const removeBrand = (id: string) => {
    setBrands(brands.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8 space-y-8">
          <section className="glass p-10 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-medium mb-8 flex items-center space-x-3">
              <Users className="w-6 h-6 text-luxury-gold" />
              <span>Brand Configuration Portfolio</span>
            </h3>
            
            <div className="space-y-4">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-luxury-gold/20 transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold border border-white/10 text-luxury-gold">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-lg">{brand.name}</h4>
                        {!brand.isCompetitor && <span className="bg-luxury-gold/20 text-luxury-gold text-[8px] font-black uppercase px-2 py-0.5 rounded border border-luxury-gold/30">Primary Brand</span>}
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center space-x-1.5 text-xs text-white/20">
                          <Globe className="w-3 h-3" />
                          <span>{brand.website}</span>
                        </span>
                        <span className="flex items-center space-x-1.5 text-xs text-white/20">
                          <Camera className="w-3 h-3" />
                          <span>{brand.instagram}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {brand.isCompetitor && (
                    <button onClick={() => removeBrand(brand.id)} className="p-2 text-white/10 hover:text-red-400 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-8">
          <section className="glass p-8 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02]">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-luxury-gold" />
              <span>Add Competitor</span>
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Brand Name</label>
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Gucci" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Storefront URL</label>
                <input 
                  value={newWeb} 
                  onChange={(e) => setNewWeb(e.target.value)}
                  placeholder="gucci.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Instagram Handle</label>
                <input 
                  value={newInsta} 
                  onChange={(e) => setNewInsta(e.target.value)}
                  placeholder="@gucci" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all"
                />
              </div>
              <button 
                onClick={addBrand}
                className="w-full bg-luxury-gold text-luxury-charcoal font-bold py-4 rounded-2xl mt-4 hover:scale-[1.02] transition-all active:scale-95 shadow-2xl"
              >
                Register Brand Scrapers
              </button>
            </div>
          </section>

          <div className="glass p-8 rounded-[40px] border border-white/5 text-center">
             <div className="p-3 bg-white/5 rounded-full w-fit mx-auto mb-4 border border-white/10">
                <Loader2 className="w-6 h-6 text-luxury-gold animate-spin" />
             </div>
             <p className="text-xs text-white/60 font-medium">Scrapers in Queue: 0</p>
             <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Status: Ready to Crawl</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntelligenceHub({ signals, isSimulating }: any) {
  return (
    <>
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Visual Similarity" value="89.2%" trend="up" sub="Overlap detected" icon={Sparkles} />
        <StatCard label="Predictive Confidence" value="94%" trend="up" sub="ML Model v2.4" icon={Brain} />
        <StatCard label="Market Velocity" value={isSimulating ? "High" : "Stable"} trend="up" sub="Live Engagement" icon={Activity} />
        <StatCard label="Active Alerts" value={signals.length} trend="stable" sub="3 High Impact" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
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
              {signals.map((signal: any) => (
                <PulseItem key={signal.id} {...signal} />
              ))}
            </div>
          </section>
        </div>
        <div className="col-span-4">
          <StrategyPanel />
        </div>
      </div>
    </>
  );
}

function SocialVelocity({ signals }: any) {
  const socialSignals = signals.filter((s: any) => s.socialMetrics);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[40px] border border-white/5">
           <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-pink-500/10 rounded-lg"><Heart className="w-5 h-5 text-pink-400" /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Total Buzz Reach</span>
           </div>
           <p className="text-4xl font-bold tracking-tighter">12.4M</p>
           <p className="text-xs text-green-400 mt-2 font-bold uppercase tracking-widest">+18% Velocity</p>
        </div>
        <div className="glass p-8 rounded-[40px] border border-white/5">
           <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Share2 className="w-5 h-5 text-blue-400" /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Social Share of Voice</span>
           </div>
           <p className="text-4xl font-bold tracking-tighter">34.2%</p>
           <p className="text-xs text-white/20 mt-2 font-bold uppercase tracking-widest">Industry Leader: Chanel</p>
        </div>
        <div className="glass p-8 rounded-[40px] border border-white/5">
           <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-luxury-gold/10 rounded-lg"><MessageCircle className="w-5 h-5 text-luxury-gold" /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Sentiment Index</span>
           </div>
           <p className="text-4xl font-bold tracking-tighter">Positive</p>
           <p className="text-xs text-luxury-gold mt-2 font-bold uppercase tracking-widest">89/100 Index Score</p>
        </div>
      </div>

      <div className="glass p-10 rounded-[40px] border border-white/5">
        <h3 className="text-xl font-medium mb-10 flex items-center space-x-3">
           <Users className="w-6 h-6 text-luxury-gold" />
           <span>High-Velocity Viral Monitoring</span>
        </h3>

        <div className="grid grid-cols-2 gap-8">
          {socialSignals.length === 0 ? (
            <div className="col-span-2 py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
               No viral breakout content detected. Start simulation to track social velocity.
            </div>
          ) : (
            socialSignals.map((s: any, i: number) => (
              <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] group hover:bg-white/[0.05] transition-all duration-500">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold border border-white/10 text-luxury-gold">
                          {s.brand.charAt(0)}
                       </div>
                       <div>
                          <h4 className="font-bold text-lg">{s.brand}</h4>
                          <p className="text-xs text-white/40 uppercase tracking-widest">{s.category}</p>
                       </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                       s.socialMetrics.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                       s.socialMetrics.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                       'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                       {s.socialMetrics.sentiment} Sentiment
                    </span>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40 uppercase tracking-widest font-bold">Engagement Velocity</span>
                       <span className="text-luxury-gold font-mono font-bold">{s.socialMetrics.velocity}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-luxury-gold to-white h-full transition-all duration-1000" style={{ width: `${s.socialMetrics.velocity}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <div className="flex items-center space-x-2 text-[10px] text-white/60 font-bold uppercase tracking-widest">
                          <Users className="w-3 h-3" />
                          <span>{s.socialMetrics.views} Reach</span>
                       </div>
                       <button className="text-[10px] font-black uppercase tracking-widest text-luxury-gold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                          <span>View Campaign</span>
                          <ArrowUpRight className="w-3 h-3" />
                       </button>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StrategyAI({ signals }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefReady, setBriefReady] = useState(false);

  const generateBrief = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setBriefReady(true);
    }, 3000);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("LuxeLens AI: Executive Strategy Brief", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    doc.text("--------------------------------------------------", 20, 35);
    
    doc.setFontSize(16);
    doc.text("Market Intelligence Summary", 20, 50);
    doc.setFontSize(12);
    let y = 60;
    signals.slice(0, 5).forEach((s: any) => {
      doc.text(`- ${s.brand}: ${s.event} (${s.category})`, 20, y);
      y += 10;
    });

    doc.setFontSize(16);
    doc.text("Strategic Recommendations", 20, y + 10);
    doc.setFontSize(12);
    doc.text("1. Maintain premium pricing despite Gucci pressure.", 20, y + 20);
    doc.text("2. Accelerate 'Sustainable Leather' drop to counter Prada.", 20, y + 30);
    
    doc.save("LuxeLens_Strategy_Brief.pdf");
  };

  return (
    <div className="space-y-10">
      <div className="glass p-10 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02] flex items-center justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
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

      <div className="grid grid-cols-2 gap-8">
         <div className="glass p-10 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-3">
              <Gauge className="w-5 h-5 text-luxury-gold" />
              <span>Predictive Pricing Forecast</span>
            </h4>
            <div className="space-y-6">
               {signals.filter((s:any) => s.prediction).map((s:any, i:number) => (
                 <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-luxury-gold/30 transition-all">
                    <div className="flex justify-between items-start mb-3">
                       <span className="font-bold text-sm">{s.brand} Forecasting</span>
                       <span className="text-luxury-gold text-xs font-bold font-mono">{s.prediction.probability}% Confidence</span>
                    </div>
                    <p className="text-xs text-white/40 mb-4">{s.prediction.event} within {s.prediction.timeframe}</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-luxury-gold h-full transition-all duration-1000" style={{ width: `${s.prediction.probability}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="glass p-10 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span>Visual Similarity Benchmarking</span>
            </h4>
            <div className="space-y-6">
               {signals.filter((s:any) => s.visualSimilarity).map((s:any, i:number) => (
                 <div key={i} className="flex items-center space-x-6 p-4 border border-dashed border-white/10 rounded-3xl">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                       <FileText className="w-6 h-6 text-white/20" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold">{s.brand} {s.category}</span>
                          <span className="text-xs text-red-400 font-bold">{(s.visualSimilarity * 100).toFixed(1)}% Match</span>
                       </div>
                       <p className="text-[10px] text-white/20 uppercase tracking-widest">Aesthetic Conflict Detected</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function PriceWatch({ signals }: any) {
  const priceSignals = signals.filter((s: any) => s.event.toLowerCase().includes("price") || s.event.toLowerCase().includes("stock"));

  return (
    <div className="space-y-6">
      <div className="glass rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5 text-white/40">
              <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Brand</th>
              <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Signal Type</th>
              <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Prediction</th>
              <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Impact</th>
              <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {priceSignals.map((s: any) => (
              <tr key={s.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-10 py-6 font-bold group-hover:text-luxury-gold transition-colors">{s.brand}</td>
                <td className="px-10 py-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{s.event}</span>
                  </div>
                </td>
                <td className="px-10 py-6">
                  {s.prediction ? (
                    <span className="text-luxury-gold text-xs font-mono font-bold italic tracking-tighter">Probable move in {s.prediction.timeframe}</span>
                  ) : <span className="text-white/10">—</span>}
                </td>
                <td className="px-10 py-6">
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                    s.impact === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'
                  }`}>
                    {s.impact}
                  </span>
                </td>
                <td className="px-10 py-6 text-white/20 text-xs font-mono">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComingSoon({ activeTab }: any) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 border border-dashed border-white/10 rounded-[60px] bg-white/[0.01]">
       <Sparkles className="w-16 h-16 mb-6 opacity-10 animate-pulse text-luxury-gold" />
       <h3 className="text-2xl font-light italic text-luxury-gold">"{activeTab}" Synthesis</h3>
       <p className="max-w-md text-center mt-3 text-[10px] text-white/20 uppercase tracking-[0.2em] font-black leading-loose">
         Cross-brand neural metrics currently in development
       </p>
    </div>
  );
}

function StatCard({ label, value, trend, sub, icon: Icon }: any) {
  return (
    <div className="glass p-8 rounded-[40px] border border-white/5 hover:border-luxury-gold/20 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-20 h-20" />
      </div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 bg-luxury-gold/5 rounded-[20px] border border-luxury-gold/10 group-hover:bg-luxury-gold/15 transition-colors shadow-inner">
          <Icon className="w-6 h-6 text-luxury-gold" />
        </div>
        <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-black text-white/40 uppercase tracking-tighter">{trend}</span>
      </div>
      <h3 className="text-3xl font-bold mb-1 tracking-tighter tabular-nums">{value}</h3>
      <p className="text-[10px] text-white/40 uppercase tracking-[0.1em] font-black">{label}</p>
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black italic">{sub}</p>
        <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-luxury-gold transition-colors" />
      </div>
    </div>
  );
}

function PulseItem({ time, brand, event, category, impact, visualSimilarity, prediction, socialMetrics }: any) {
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
