import React from "react";
import { Heart, Share2, MessageCircle, Users, ArrowUpRight } from "lucide-react";
import { MarketSignal } from "@/lib/intelligence";

interface SocialVelocityProps {
  signals: MarketSignal[];
}

export default function SocialVelocity({ signals }: SocialVelocityProps) {
  const socialSignals = signals.filter((s) => s.socialMetrics);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        <div className="glass p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <MessageCircle className="w-24 h-24 text-luxury-gold" />
           </div>
           <div className="relative z-10">
             <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-luxury-gold/10 rounded-lg"><MessageCircle className="w-5 h-5 text-luxury-gold" /></div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Sentiment Index</span>
             </div>
             <div className="flex items-end justify-between">
               <div>
                 <p className="text-4xl font-bold tracking-tighter">Positive</p>
                 <p className="text-xs text-luxury-gold mt-2 font-bold uppercase tracking-widest">89/100 Index Score</p>
               </div>
               <div className="text-right">
                 <span className="text-sm font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    +12% shift 1H
                 </span>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Platform Breakdown Heatmap */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "TikTok", share: "45%", color: "bg-pink-500", border: "border-pink-500/20", text: "text-pink-400" },
          { name: "Instagram", share: "32%", color: "bg-purple-500", border: "border-purple-500/20", text: "text-purple-400" },
          { name: "X / Twitter", share: "15%", color: "bg-blue-500", border: "border-blue-500/20", text: "text-blue-400" },
          { name: "Weibo", share: "8%", color: "bg-red-500", border: "border-red-500/20", text: "text-red-400" },
        ].map((platform, idx) => (
          <div key={idx} className={`glass p-4 rounded-3xl border ${platform.border} flex items-center justify-between`}>
             <span className="text-xs font-bold uppercase tracking-widest text-white/60">{platform.name}</span>
             <span className={`font-mono font-bold ${platform.text}`}>{platform.share}</span>
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-[40px] border border-white/5">
        <h3 className="text-xl font-medium mb-10 flex items-center space-x-3">
           <Users className="w-6 h-6 text-luxury-gold" />
           <span>High-Velocity Viral Monitoring</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {socialSignals.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
               No viral breakout content detected. Start simulation to track social velocity.
            </div>
          ) : (
            socialSignals.map((s, i) => (
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
                       s.socialMetrics?.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                       s.socialMetrics?.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                       'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                       {s.socialMetrics?.sentiment} Sentiment
                    </span>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40 uppercase tracking-widest font-bold">Engagement Velocity</span>
                       <span className="text-luxury-gold font-mono font-bold">{s.socialMetrics?.velocity}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-luxury-gold to-white h-full transition-all duration-1000" style={{ width: `${s.socialMetrics?.velocity}%` }}></div>
                    </div>
                    
                    {/* Influencer Catalyst */}
                    {s.socialMetrics?.influencer && (
                      <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                              <span className="text-luxury-gold font-bold text-xs">{s.socialMetrics.influencer.name.charAt(0)}</span>
                           </div>
                           <div>
                             <p className="text-xs font-bold">{s.socialMetrics.influencer.name}</p>
                             <p className="text-[10px] text-white/40 uppercase tracking-widest">Key Catalyst</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-mono font-bold">{s.socialMetrics.influencer.followers}</p>
                           <p className="text-[10px] text-white/40 uppercase tracking-widest">Reach</p>
                         </div>
                      </div>
                    )}

                    {/* Platform & Keywords */}
                    <div className="pt-3 flex flex-wrap gap-2 items-center justify-between">
                       <div className="flex gap-2">
                         <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-bold text-white/60">
                           {s.socialMetrics?.platform || "Cross-Platform"}
                         </span>
                         {s.socialMetrics?.keywords?.map((kw, idx) => (
                           <span key={idx} className="px-2 py-1 bg-luxury-gold/10 rounded border border-luxury-gold/20 text-[10px] font-bold text-luxury-gold">
                             {kw}
                           </span>
                         ))}
                       </div>
                       
                       <div className="flex items-center space-x-2 text-[10px] text-white/60 font-bold uppercase tracking-widest">
                          <Users className="w-3 h-3" />
                          <span>{s.socialMetrics?.views} Reach</span>
                       </div>
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
