"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Factory, Truck, Store, DollarSign, Calculator, FileWarning, ArrowRight } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";

export default function ExecuteOrderPage({ params }: { params: { id: string } }) {
  const { recommendations } = useIntelligence();
  const recId = parseInt(params.id, 10);
  const strategy = recommendations.find(r => r.id === recId);

  // Approval Workflow State
  const [approvals, setApprovals] = useState({
    finance: false,
    supplyChain: false,
    retail: false,
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Mock Financials
  const financials = {
    manufacturingCost: 245.00,
    transportCost: 32.50,
    marketingCost: 45.00,
    retailPrice: 950.00,
  };

  const totalCost = financials.manufacturingCost + financials.transportCost + financials.marketingCost;
  const netMargin = financials.retailPrice - totalCost;
  const marginPercentage = ((netMargin / financials.retailPrice) * 100).toFixed(1);

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

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-white overflow-hidden p-6 lg:p-10">
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
                Order ID: {params.id}
              </p>
            </div>
          </div>
        </header>

        {strategy && (
          <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-6 rounded-2xl flex justify-between items-center">
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
          
          {/* Financial Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-[32px] border border-white/5 p-8 shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Calculator className="w-48 h-48 text-luxury-gold" />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div>
                  <h3 className="text-xl font-medium tracking-tight mb-6">Unit Economics & Margin</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <Factory className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/70">Manufacturing Cost</span>
                      </div>
                      <span className="font-mono text-white/80">${financials.manufacturingCost.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <Truck className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/70">Transport & Logistics</span>
                      </div>
                      <span className="font-mono text-white/80">${financials.transportCost.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <Store className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/70">Store & Marketing Allocation</span>
                      </div>
                      <span className="font-mono text-white/80">${financials.marketingCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total Cost</span>
                    <span className="font-mono text-white/60">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Target Retail Price</span>
                    <span className="font-mono text-white">${financials.retailPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-luxury-gold/20 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Net Unit Margin</span>
                      </span>
                      <p className="text-3xl font-black tracking-tighter text-luxury-gold mt-1">${netMargin.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-mono text-green-400">{marginPercentage}%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Multi-Level Approval Workflow */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-[32px] border border-white/5 p-8 shadow-2xl h-full flex flex-col">
              <h3 className="text-xl font-medium tracking-tight mb-8">Execution Authorization</h3>

              <div className="space-y-4 flex-1">
                {/* Finance Approval */}
                <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  approvals.finance ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${approvals.finance ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                      {approvals.finance ? <CheckCircle2 className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold">VP Finance</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Margin requirement met</p>
                    </div>
                  </div>
                  {!approvals.finance ? (
                    <button onClick={() => handleApprove("finance")} className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-bold uppercase tracking-widest transition-colors">
                      Sign Off
                    </button>
                  ) : <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Authorized</span>}
                </div>

                {/* Supply Chain Approval */}
                <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  approvals.supplyChain ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${approvals.supplyChain ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                      {approvals.supplyChain ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold">Head of Supply Chain</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Inventory available globally</p>
                    </div>
                  </div>
                  {!approvals.supplyChain ? (
                    <button onClick={() => handleApprove("supplyChain")} className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-bold uppercase tracking-widest transition-colors">
                      Sign Off
                    </button>
                  ) : <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Authorized</span>}
                </div>

                {/* Retail Approval */}
                <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${
                  approvals.retail ? 'bg-green-500/10 border-green-500/30' : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${approvals.retail ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'}`}>
                      {approvals.retail ? <CheckCircle2 className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold">VP Retail Operations</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Store capacity confirmed</p>
                    </div>
                  </div>
                  {!approvals.retail ? (
                    <button onClick={() => handleApprove("retail")} className="text-xs px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-bold uppercase tracking-widest transition-colors">
                      Sign Off
                    </button>
                  ) : <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Authorized</span>}
                </div>

              </div>

              {/* Final Execution */}
              <div className="pt-8 mt-4 border-t border-white/10">
                {isDone ? (
                  <div className="bg-green-500/20 border border-green-500/30 p-6 rounded-2xl flex items-center justify-center space-x-3 text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold tracking-widest uppercase">Campaign Deployed Successfully</span>
                  </div>
                ) : (
                  <button
                    disabled={!allApproved || isExecuting}
                    onClick={handleFinalExecute}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex justify-center items-center space-x-3 transition-all ${
                      allApproved 
                        ? 'bg-luxury-gold text-luxury-charcoal hover:scale-[1.01] shadow-[0_0_30px_rgba(200,160,89,0.3)]' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {isExecuting ? (
                      <span className="animate-pulse">Deploying to POS Systems...</span>
                    ) : (
                      <>
                        <span>Execute Final Market Strategy</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
                {!allApproved && !isDone && (
                  <p className="text-center text-[10px] text-white/40 uppercase tracking-widest mt-4 flex justify-center items-center space-x-1">
                    <FileWarning className="w-3 h-3" />
                    <span>Requires 3/3 Executive Sign-Offs</span>
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
