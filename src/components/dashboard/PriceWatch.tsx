import React from "react";
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
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Signal Type</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Prediction</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Impact</th>
                <th className="px-10 py-6 text-[10px] uppercase tracking-widest font-black">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {priceSignals.length > 0 ? (
                priceSignals.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-10 py-6 font-bold group-hover:text-luxury-gold transition-colors">{s.brand}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{s.event}</span>
                      </div>
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
                    <td className="px-10 py-6 text-white/20 text-xs font-mono">{s.time}</td>
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
