import React from "react";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend: "up" | "down" | "stable";
  sub: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, trend, sub, icon: Icon }: StatCardProps) {
  return (
    <div className="glass p-8 rounded-[40px] border border-white/5 hover:border-luxury-gold/20 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-20 h-20" />
      </div>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 bg-luxury-gold/5 rounded-[20px] border border-luxury-gold/10 group-hover:bg-luxury-gold/15 transition-colors shadow-inner">
          <Icon className="w-6 h-6 text-luxury-gold" />
        </div>
        <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-black text-white/40 uppercase tracking-tighter">
          {trend}
        </span>
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
