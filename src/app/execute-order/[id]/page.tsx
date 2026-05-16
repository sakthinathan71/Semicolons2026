"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Factory, Truck, Store, IndianRupee, Calculator, FileWarning, ArrowRight, Save, Send } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";

export default function ExecuteOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { recommendations } = useIntelligence();
  const recId = parseInt(resolvedParams.id, 10);
  const strategy = recommendations.find(r => r.id === recId);

  // Approval Workflow State
  const [approvals, setApprovals] = useState({
    finance: false,
    supplyChain: false,
    retail: false,
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isSentForApproval, setIsSentForApproval] = useState(false);

  // Stateful Financials for Editing
  const [financials, setFinancials] = useState({
    manufacturingCost: 0,
    transportCost: 0,
    marketingCost: 0,
    retailPrice: 0,
  });

  // Randomize initial financials on mount
  useEffect(() => {
    setFinancials({
      manufacturingCost: Math.floor(Math.random() * 5000) + 2000,
      transportCost: Math.floor(Math.random() * 1000) + 500,
      marketingCost: Math.floor(Math.random() * 2000) + 1000,
      retailPrice: Math.floor(Math.random() * 15000) + 10000,
    });
  }, []);

  const totalCost = financials.manufacturingCost + financials.transportCost + financials.marketingCost;
  const netMargin = financials.retailPrice - totalCost;
  const marginPercentage = financials.retailPrice > 0 ? ((netMargin / financials.retailPrice) * 100).toFixed(1) : "0.0";

  const handleApprove = (level: keyof typeof approvals) => {
    setApprovals(prev => ({ ...prev, [level]: true }));
  };

  const allApproved = approvals.finance && approvals.supplyChain && approvals.retail;

  const handleFinalExecute = () => {
    if (!allApproved) return;
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsDone(true);
    }, 2500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof financials) => {
    const val = parseFloat(e.target.value) || 0;
    setFinancials(prev => ({ ...prev, [field]: val }));
    // Reset approvals if financials change
    setApprovals({ finance: false, supplyChain: false, retail: false });
    setIsSentForApproval(false);
  };

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden p-6 lg:p-10 font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-light tracking-tight">Market Execution Protocol</h1>
              <p className="text-white/40 mt-1 uppercase text-[10px] tracking-widest font-bold">
                Order ID: {resolvedParams.id} • Region: India
              </p>
            </div>
          </div>
          {isSentForApproval && !allApproved && (
            <div className="flex items-center space-x-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              <Send className="w-3 h-3" />
              <span>Sent for Multi-Level Review</span>
            </div>
          )}
        </header>

        {strategy && (
          <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-6 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div>
              <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-black mb-1">Target Strategy</p>
              <h2 className="text-xl font-bold">{strategy.title}</h2>
              <p className="text-sm text-white/60 mt-1">{strategy.logic}</p>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border ${
                strategy.threat === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>
                {strategy.threat} Threat
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Financial Breakdown (Editable) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-[32px] border border-white/5 p-8 shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calculator className="w-48 h-48 text-luxury-gold" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-xl font-medium tracking-tight mb-6 flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-luxury-gold" />
                    <span>Unit Economics Editor</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center space-x-2">
                          <Factory className="w-3 h-3" />
                          <span>Manufacturing Cost (₹)</span>
                        </label>
                      </div>
                      <input 
                        type="number"
                        value={financials.manufacturingCost}
                        onChange={(e) => handleInputChange(e, "manufacturingCost")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-luxury-gold/50 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center space-x-2">
                        <Truck className="w-3 h-3" />
                        <span>Transport & Logistics (₹)</span>
                      </label>
                      <input 
                        type="number"
                        value={financials.transportCost}
                        onChange={(e) => handleInputChange(e, "transportCost")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-luxury-gold/50 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center space-x-2">
                        <Store className="w-3 h-3" />
                        <span>Retail & Marketing (₹)</span>
                      </label>
                      <input 
                        type="number"
                        value={financials.marketingCost}
                        onChange={(e) => handleInputChange(e, "marketingCost")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-luxury-gold/50 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-black flex items-center space-x-2">
                        <ArrowRight className="w-3 h-3" />
                        <span>Proposed AI Pricing (₹)</span>
                      </label>
                      <input 
                        type="number"
                        value={financials.retailPrice}
                        onChange={(e) => handleInputChange(e, "retailPrice")}
                        className="w-full bg-luxury-gold/10 border border-luxury-gold/30 rounded-xl px-4 py-3 text-lg font-mono font-bold text-luxury-gold focus:border-luxury-gold outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total Operational Cost</span>
                    <span className="font-mono text-white/60">₹{totalCost.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center space-x-1">
                        <IndianRupee className="w-3 h-3" />
                        <span>Net Profit / Unit</span>
                      </span>
                      <p className={`text-3xl font-black tracking-tighter mt-1 ${netMargin < 0 ? 'text-red-400' : 'text-luxury-gold'}`}>
                        ₹{netMargin.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-1">Net Margin</p>
                      <span className={`text-2xl font-mono font-bold ${parseFloat(marginPercentage) < 20 ? 'text-orange-400' : 'text-green-400'}`}>
                        {marginPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {!isSentForApproval && (
                  <button 
                    onClick={() => setIsSentForApproval(true)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Adjusted Rates for Approval</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Multi-Level Approval Workflow */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-[32px] border border-white/5 p-8 shadow-2xl h-full flex flex-col">
              <h3 className="text-xl font-medium tracking-tight mb-8">Executive Authorization</h3>

              <div className="space-y-4 flex-1">
                {/* Finance Approval */}
                <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${
                  approvals.finance ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${approvals.finance ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                      {approvals.finance ? <CheckCircle2 className="w-6 h-6" /> : <IndianRupee className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Finance Sign-Off</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                        {parseFloat(marginPercentage) < 15 ? 'Margin too low for authorization' : 'Margin requirement met'}
                      </p>
                    </div>
                  </div>
                  {!approvals.finance ? (
                    <button 
                      disabled={!isSentForApproval || parseFloat(marginPercentage) < 15}
                      onClick={() => handleApprove("finance")} 
                      className="text-[10px] px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-black uppercase tracking-widest transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      Authorize
                    </button>
                  ) : <span className="text-[10px] font-black text-green-400 uppercase tracking-widest border border-green-500/30 px-4 py-2 rounded-lg bg-green-500/10">Signed Off</span>}
                </div>

                {/* Supply Chain Approval */}
                <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${
                  approvals.supplyChain ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${approvals.supplyChain ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                      {approvals.supplyChain ? <CheckCircle2 className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Logistics Sign-Off</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Route & Capacity Confirmation</p>
                    </div>
                  </div>
                  {!approvals.supplyChain ? (
                    <button 
                      disabled={!isSentForApproval}
                      onClick={() => handleApprove("supplyChain")} 
                      className="text-[10px] px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-black uppercase tracking-widest transition-colors disabled:opacity-20"
                    >
                      Authorize
                    </button>
                  ) : <span className="text-[10px] font-black text-green-400 uppercase tracking-widest border border-green-500/30 px-4 py-2 rounded-lg bg-green-500/10">Signed Off</span>}
                </div>

                {/* Retail Approval */}
                <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${
                  approvals.retail ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${approvals.retail ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                      {approvals.retail ? <CheckCircle2 className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Retail Sign-Off</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">In-store placement ready</p>
                    </div>
                  </div>
                  {!approvals.retail ? (
                    <button 
                      disabled={!isSentForApproval}
                      onClick={() => handleApprove("retail")} 
                      className="text-[10px] px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-black uppercase tracking-widest transition-colors disabled:opacity-20"
                    >
                      Authorize
                    </button>
                  ) : <span className="text-[10px] font-black text-green-400 uppercase tracking-widest border border-green-500/30 px-4 py-2 rounded-lg bg-green-500/10">Signed Off</span>}
                </div>

              </div>

              {/* Final Execution */}
              <div className="pt-8 mt-4 border-t border-white/10">
                {isDone ? (
                  <div className="bg-green-500/20 border border-green-500/30 p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 text-green-400 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-12 h-12" />
                    <div className="text-center">
                      <p className="font-black tracking-[0.2em] uppercase text-lg">Strategy Executed</p>
                      <p className="text-[10px] uppercase mt-1 opacity-60">Price & Inventory updated in POS</p>
                    </div>
                    <Link href="/" className="mt-4 px-8 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                      Return to Command Center
                    </Link>
                  </div>
                ) : (
                  <button
                    disabled={!allApproved || isExecuting}
                    onClick={handleFinalExecute}
                    className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-sm flex justify-center items-center space-x-4 transition-all ${
                      allApproved 
                        ? 'bg-luxury-gold text-luxury-charcoal hover:scale-[1.02] shadow-[0_20px_50px_rgba(200,160,89,0.3)] active:scale-95' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {isExecuting ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 border-2 border-luxury-charcoal/30 border-t-luxury-charcoal animate-spin rounded-full"></div>
                        <span className="animate-pulse">Broadcasting to Retail Nodes...</span>
                      </div>
                    ) : (
                      <>
                        <span>Commit Strategy to Market</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
                {!allApproved && !isDone && (
                  <p className="text-center text-[10px] text-white/40 uppercase tracking-widest mt-6 flex justify-center items-center space-x-2">
                    <FileWarning className="w-4 h-4 text-orange-400/60" />
                    <span>Awaiting {Object.values(approvals).filter(a => !a).length} Corporate Sign-offs</span>
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
