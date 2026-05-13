"use client";

import { LayoutDashboard, TrendingUp, Users, Settings, Bell, Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: "Intelligence Hub" },
  { icon: TrendingUp, label: "Price Watch" },
  { icon: Users, label: "Social Velocity" },
  { icon: Zap, label: "Strategy AI" },
  { icon: Bell, label: "Market Alerts" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-white/5 bg-luxury-charcoal flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <h1 className="text-xl font-bold tracking-widest text-luxury-gold uppercase">
          LuxeLens AI
        </h1>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse"></div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Enterprise Intel
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 shadow-lg shadow-luxury-gold/5" 
                  : "text-white/40 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-gold rounded-r-full" />
              )}
              <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-luxury-gold" : "text-white/20 group-hover:text-white")} />
              <span className="text-sm font-medium tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <button 
          onClick={() => setActiveTab("Settings")}
          className={cn(
            "w-full flex items-center space-x-3 transition-all group px-4 py-3 rounded-xl",
            activeTab === "Settings" 
              ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20" 
              : "text-white/30 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className={cn("w-5 h-5 group-hover:rotate-45 transition-transform duration-500", activeTab === "Settings" ? "text-luxury-gold" : "text-white/20")} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
