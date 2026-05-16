import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarketSignal } from "@/lib/intelligence";

interface PriceWatchProps {
  signals: MarketSignal[];
}

export default function PriceWatch({ signals }: PriceWatchProps) {
  const priceSignals = signals.filter((s) => s.event.toLowerCase().includes("price") || s.event.toLowerCase().includes("stock"));

  return (
    <div className="space-y-6">
      <div className="glass rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-white/40">
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Brand</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Product Item / Model</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Event Type</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Prediction</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {priceSignals.length > 0 ? (
                priceSignals.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-10 py-6 font-bold group-hover:text-luxury-gold transition-colors">{s.brand}</td>
                    <td className="px-10 py-6">
                      <Link 
                        href={`/product/${s.id}`}
                        className="group/link flex flex-col items-start"
                      >
                        <span className="text-sm font-black text-white flex items-center space-x-2 group-hover/link:text-luxury-gold transition-colors">
                          <span>{s.category}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[10px] text-white/40 mt-1 line-clamp-1 group-hover/link:text-white/60">
                          {s.details}
                        </span>
                      </Link>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-semibold">{s.event}</span>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-white/20 italic">
                    No pricing signals detected in the current stream.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
