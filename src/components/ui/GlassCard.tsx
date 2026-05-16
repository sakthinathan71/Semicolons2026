"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "red";
  animate?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = "default",
  animate = true 
}: GlassCardProps) {
  const variantStyles = {
    default: "border-white/10 bg-white/5",
    gold: "border-luxury-gold/30 bg-luxury-gold/5",
    red: "border-red-500/20 bg-red-500/5",
  };

  return (
    <div 
      className={cn(
        "glass rounded-[32px] overflow-hidden transition-all duration-500",
        variantStyles[variant],
        animate && "animate-in fade-in slide-in-from-bottom-4 duration-700",
        className
      )}
    >
      {children}
    </div>
  );
}
