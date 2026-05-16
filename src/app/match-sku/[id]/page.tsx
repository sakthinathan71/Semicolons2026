import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, Sparkles, Layers, Box, Tag, Image as ImageIcon } from "lucide-react";

export default async function MatchSkuPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const competitorId = resolvedParams.id;
  const olivelaSku = "OLV-GUC-8842-H";

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden p-6 lg:p-10">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/product/${competitorId}`} 
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-light tracking-tight">SKU Matchmaker</h1>
              <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">
                Resolving Arbitrage Opportunity
              </p>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">
              98.4% Confidence Match
            </span>
          </div>
        </header>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Competitor Side */}
          <div className="glass rounded-[40px] border border-white/5 p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Box className="w-32 h-32 text-red-400" />
            </div>
            <div className="relative z-10 border-b border-white/10 pb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2 block">Competitor Listing</span>
              <h2 className="text-2xl font-bold tracking-tighter">Gucci Horsebit Loafer</h2>
              <p className="text-white/40 text-xs font-mono mt-1">ID: {competitorId}</p>
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex items-center justify-center h-48">
                <ImageIcon className="w-12 h-12 text-white/10" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Current Price</span>
                  <span className="font-mono font-bold text-red-400">₹72,000 (Marked Down)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Color</span>
                  <span className="font-bold">Black Leather</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">In Stock</span>
                  <span className="font-bold text-red-400">No (Stockout Event)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Olivela Side */}
          <div className="glass rounded-[40px] border border-luxury-gold/30 bg-luxury-gold/5 p-8 shadow-[0_0_50px_rgba(200,160,89,0.05)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Tag className="w-32 h-32 text-luxury-gold" />
            </div>
            <div className="relative z-10 border-b border-luxury-gold/20 pb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold mb-2 block">Internal Inventory (Olivela Private Label)</span>
              <h2 className="text-2xl font-bold tracking-tighter text-white">Olivela Signature Leather Loafer</h2>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-luxury-gold/60 text-xs font-mono">SKU: {olivelaSku}</p>
                <button className="text-luxury-gold hover:text-white transition-colors" aria-label="Copy SKU">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="bg-black/20 p-6 rounded-2xl border border-luxury-gold/10 flex items-center justify-center h-48">
                <ImageIcon className="w-12 h-12 text-luxury-gold/20" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Current Price</span>
                  <span className="font-mono font-bold text-white">₹54,000 (High Margin)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Color</span>
                  <span className="font-bold">Black Leather</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">In Stock</span>
                  <span className="font-bold text-green-400">Yes (34 Units)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Panel */}
        <div className="glass rounded-3xl border border-white/5 p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/5 rounded-full">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold">Match Verified Successfully</p>
              <p className="text-xs text-white/50">Arbitrage opportunity identified. You have inventory while the competitor is out of stock.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/"
              className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors border border-white/10 hover:bg-white/5"
            >
              Cancel
            </Link>
            <Link 
              href="/"
              className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors bg-luxury-gold text-luxury-charcoal hover:bg-white flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Deploy Campaign to Olivela SKU</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
