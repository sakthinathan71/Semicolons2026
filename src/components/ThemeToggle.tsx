"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "fixed top-6 right-6 z-[100] flex items-center space-x-2 px-3 py-2 rounded-full border transition-all duration-500",
        "shadow-lg backdrop-blur-xl",
        theme === "dark" 
          ? "bg-luxury-gold/10 border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold/20" 
          : "bg-white/80 border-slate-200 text-slate-900 hover:bg-white shadow-xl shadow-slate-200/50"
      )}
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <Sun className={cn(
          "w-5 h-5 absolute transition-all duration-700",
          theme === "dark" ? "top-[120%] opacity-0 rotate-90" : "top-0 opacity-100 rotate-0"
        )} />
        <Moon className={cn(
          "w-5 h-5 absolute transition-all duration-700",
          theme === "dark" ? "top-0 opacity-100 rotate-0" : "top-[-120%] opacity-0 -rotate-90"
        )} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">
        {theme === "dark" ? "Midnight Mode" : "Pristine Mode"}
      </span>
    </button>
  );
}
