"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import IntelligenceHub from "@/components/dashboard/IntelligenceHub";
import StrategyAI from "@/components/dashboard/StrategyAI";
import PriceWatch from "@/components/dashboard/PriceWatch";
import SocialVelocity from "@/components/dashboard/SocialVelocity";
import SettingsView from "@/components/dashboard/SettingsView";
import MarketAlerts from "@/components/dashboard/MarketAlerts";
import ComingSoon from "@/components/dashboard/ComingSoon";
import { Activity, Play, Square, Loader2 } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";

export default function Dashboard() {
  const { signals, startSimulation, stopSimulation, isSimulating } = useIntelligence();
  const [activeTab, setActiveTab] = useState("Intelligence Hub");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "Intelligence Hub":
        return <IntelligenceHub signals={signals} isSimulating={isSimulating} />;
      case "Strategy AI":
        return <StrategyAI signals={signals} />;
      case "Price Watch":
        return <PriceWatch signals={signals} />;
      case "Social Velocity":
        return <SocialVelocity signals={signals} />;
      case "Settings":
        return <SettingsView />;
      case "Market Alerts":
        return <MarketAlerts signals={signals} />;
      default:
        return <ComingSoon activeTab={activeTab} />;
    }
  };

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 ml-0 lg:ml-64 p-6 lg:p-10 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10"
            >
              <Activity className="w-5 h-5 text-luxury-gold" />
            </button>
            <div>
              <h2 className="text-3xl font-light tracking-tight">{activeTab}</h2>
              <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">Strategic Market Intelligence Suite</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {activeTab !== "Settings" && activeTab !== "Market Alerts" && (
              <div className="flex items-center">
                {!isSimulating ? (
                  <button 
                    onClick={startSimulation} 
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all group shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-green-400 group-hover:scale-110 transition-transform" />
                    <span>Start Simulation</span>
                  </button>
                ) : (
                  <button 
                    onClick={stopSimulation} 
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center space-x-2 transition-all group shadow-lg"
                  >
                    <Square className="w-3.5 h-3.5 fill-red-400 group-hover:scale-110 transition-transform" />
                    <span>End Simulation</span>
                  </button>
                )}
                <div className="h-10 w-[1px] bg-white/10 mx-4 hidden sm:block"></div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center space-x-3 backdrop-blur-md">
              {isSimulating ? <Loader2 className="w-4 h-4 text-luxury-gold animate-spin" /> : <Activity className="w-4 h-4 text-white/20" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {isSimulating ? "AI Pulse Active" : "Feed Paused"}
              </span>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
