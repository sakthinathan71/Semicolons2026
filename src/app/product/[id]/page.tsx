import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Activity, Box, Tag } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // Since we don't have a database backend right now, we use the ID from the URL parameter.
  // In a real application, you would fetch product details from a database using this ID.
  const productId = params.id;

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden p-6 lg:p-10">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight">Product Intelligence</h1>
            <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">
              ID: {productId}
            </p>
          </div>
        </header>

        {/* Mock Details Panel */}
        <div className="glass rounded-[40px] border border-white/5 p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <Box className="w-64 h-64 text-luxury-gold" />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-black text-luxury-gold bg-luxury-gold/10 border border-luxury-gold/30 px-3 py-1 rounded-full w-fit">
                Monitored SKU
              </span>
              <h2 className="text-4xl font-bold tracking-tighter">Detailed SKU Analysis</h2>
              <p className="text-white/60 text-lg max-w-2xl">
                This is a detailed analysis view for the selected competitor product model. In a live enterprise integration, this page connects directly to your PIM (Product Information Management) system and web scrapers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Tag className="w-5 h-5 text-white/40" />
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white/60">Pricing History</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-white/80">Current List Price</span>
                    <span className="text-sm font-mono font-bold">$1,250</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-white/80">30-Day Lowest</span>
                    <span className="text-sm font-mono font-bold text-red-400">$1,100</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-white/80">Variance</span>
                    <span className="text-sm font-mono font-bold text-luxury-gold">-12%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Box className="w-5 h-5 text-white/40" />
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white/60">Inventory Status</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-white/80">Global Stock</span>
                    <span className="text-sm font-mono font-bold text-red-400">Low (14 units)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-white/80">Restock Velocity</span>
                    <span className="text-sm font-mono font-bold">12 Days</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-sm text-white/80">Sell-through Rate</span>
                    <span className="text-sm font-mono font-bold text-luxury-gold">88%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Activity className="w-5 h-5 text-white/40" />
                  <h3 className="text-xs uppercase tracking-widest font-bold text-white/60">Actionable Actions</h3>
                </div>
                <div className="flex flex-col space-y-3 h-full justify-start mt-4">
                   <button className="bg-white text-luxury-charcoal w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                     View Original Listing
                   </button>
                   <button className="bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold/30 transition-colors">
                     Match to Own SKU
                   </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
