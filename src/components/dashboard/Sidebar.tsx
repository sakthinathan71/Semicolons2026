"use client";

import React, { useRef, useCallback } from "react";
import { LayoutDashboard, TrendingUp, Users, Settings, Bell, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Intelligence Hub" },
  { icon: TrendingUp,      label: "Price Watch" },
  { icon: Users,           label: "Social Velocity" },
  { icon: Zap,             label: "Strategy AI" },
  { icon: Bell,            label: "Market Alerts" },
] as const;

type NavLabel = (typeof NAV_ITEMS)[number]["label"] | "Settings";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  // Refs array for keyboard navigation focus management
  const navButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keyboard handler — Arrow keys navigate between nav items, Escape closes mobile sidebar
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const total = NAV_ITEMS.length + 1; // +1 for Settings

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % total;
        navButtonRefs.current[nextIndex]?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + total) % total;
        navButtonRefs.current[prevIndex]?.focus();
      } else if (e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  const navigate = useCallback(
    (tab: NavLabel) => {
      setActiveTab(tab);
      onClose?.();
    },
    [setActiveTab, onClose]
  );

  return (
    <>
      {/* Mobile overlay — click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar-nav"
        className={cn(
          "w-64 border-r border-white/5 bg-luxury-charcoal flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main navigation"
        // Trap focus inside sidebar when open on mobile
        aria-hidden={!isOpen && typeof window !== "undefined" && window.innerWidth < 1024}
      >
        {/* Logo */}
        <div className="p-8 flex justify-between items-center">
          <div>
            <span className="text-xl font-bold tracking-widest text-luxury-gold uppercase block">
              LuxeLens AI
            </span>
            <div className="flex items-center space-x-2 mt-1" aria-hidden="true">
              <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Enterprise Intel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-white/40 hover:text-white rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Primary navigation */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4" aria-label="Dashboard sections" role="navigation">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                ref={(el) => { navButtonRefs.current[index] = el; }}
                onClick={() => navigate(item.label)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-1 focus-visible:ring-offset-luxury-charcoal",
                  isActive
                    ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 shadow-lg shadow-luxury-gold/5"
                    : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-gold rounded-r-full" aria-hidden="true" />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0",
                    isActive ? "text-luxury-gold" : "text-white/20 group-hover:text-white"
                  )}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium tracking-tight whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Settings (bottom) */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
          <button
            ref={(el) => { navButtonRefs.current[NAV_ITEMS.length] = el; }}
            onClick={() => navigate("Settings")}
            onKeyDown={(e) => handleKeyDown(e, NAV_ITEMS.length)}
            aria-current={activeTab === "Settings" ? "page" : undefined}
            className={cn(
              "w-full flex items-center space-x-3 transition-all group px-4 py-3 rounded-xl text-left",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-1 focus-visible:ring-offset-luxury-charcoal",
              activeTab === "Settings"
                ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20"
                : "text-white/30 hover:text-white hover:bg-white/5"
            )}
          >
            <Settings
              className={cn(
                "w-5 h-5 group-hover:rotate-45 transition-transform duration-500 shrink-0",
                activeTab === "Settings" ? "text-luxury-gold" : "text-white/20"
              )}
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
