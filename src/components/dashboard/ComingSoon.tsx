import React from "react";
import { Sparkles } from "lucide-react";

export default function ComingSoon({ activeTab }: { activeTab: string }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-white/40 border border-dashed border-white/10 rounded-[60px] bg-white/[0.01] p-10 text-center">
       <Sparkles className="w-16 h-16 mb-6 opacity-10 animate-pulse text-luxury-gold" />
       <h3 className="text-2xl font-light italic text-luxury-gold">"{activeTab}" Synthesis</h3>
       <p className="max-w-md mt-3 text-[10px] text-white/20 uppercase tracking-[0.2em] font-black leading-loose">
         Cross-brand neural metrics currently in development. Our AI agents are indexing competitor metadata.
       </p>
    </div>
  );
}
