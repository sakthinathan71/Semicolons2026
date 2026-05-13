"use client";

import { IntelligenceProvider } from "@/lib/IntelligenceContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IntelligenceProvider>
      {children}
    </IntelligenceProvider>
  );
}
