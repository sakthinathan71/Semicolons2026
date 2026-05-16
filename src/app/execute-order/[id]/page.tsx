"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Factory, Truck, Store, IndianRupee, Calculator, FileWarning, ArrowRight, Save, Send, Sparkles } from "lucide-react";
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
    operationalCost: 0,
    competitorPrice: 0,
    retailPrice: 0,
  });

  // Randomize initial financials on mount
  useEffect(() => {
    const baseCost = Math.floor(Math.random() * 5000) + 5000;
    const compPrice = Math.floor(baseCost * 2.5);
    setFinancials({
      manufacturingCost: baseCost,
      transportCost: Math.floor(baseCost * 0.15),
      operationalCost: Math.floor(baseCost * 0.2),
      competitorPrice: compPrice,
      retailPrice: Math.floor(compPrice * 0.95), // Initial aggressive prediction
    });
  }, []);

  const totalCost = financials.manufacturingCost + financials.transportCost + financials.operationalCost;
  const netMargin = financials.retailPrice - totalCost;
  const marginPercentage = financials.retailPrice > 0 ? ((netMargin / financials.retailPrice) * 100).toFixed(1) : "0.0";
  
  // AI Prediction: Optimal price to maintain market lead + healthy margin
  const predictedOptimal = useMemo(() => {
    const targetMargin = 0.35; // 35% margin
    const costPlus = totalCost / (1 - targetMargin);
    // Never exceed competitor price unless value prop is higher
    return Math.min(costPlus, financials.competitorPrice * 0.98);
  }, [totalCost, financials.competitorPrice]);

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
    setApprovals({ finance: false, supplyChain: false, retail: false });
    setIsSentForApproval(false);
  };

  return (
    <div className="flex bg-luxury-charcoal min-h-screen text-primary overflow-hidden p-6 lg:p-10">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="p-2 bg-luxury-slate/10 hover:bg-luxury-slate/20 rounded-full transition-colors group border border-card-border"
            >
              <ArrowLeft className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </Link>
            <div>
              <h1 className="text-3xl font-light tracking-tight">Market Execution Protocol</h1>
              <p className="text-muted mt-1 uppercase text-[10px] tracking-widest font-bold">
                Protocol: EP-2026-IND • Regional Node: South Asia
              </p>
            </div>
          </div>
          {isSentForApproval && !allApproved && (
            <div className="flex items-center space-x-2 bg-blue-500/10 text-blue-400 px-5 py-2.5 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
              <Send className="w-3.5 h-3.5" />
              <span>Awaiting Stakeholder Authorization</span>
            </div>
          )}
        </header>

        {/* Intelligence Context Banner */}
        {strategy && (
          <div className="glass border-luxury-gold/30 bg-luxury-gold/5 p-6 rounded-[32px] flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center border border-luxury-gold/20">
                <Sparkles className="w-6 h-6 text-luxury-gold" />
              </div>
              <div>
                <p className="text-[10px] text-luxury-gold uppercase tracking-widest font-black mb-1">AI Strategic Trigger</p>
                <h2 className="text-xl font-bold tracking-tight">{strategy.title}</h2>
                <p className="text-sm text-secondary mt-1 max-w-2xl">{strategy.logic}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border mb-2",
                strategy.threat === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
              )}>
                {strategy.threat} Intensity Threat
              </span>
              <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">Competitor: {strategy.competitor}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Section 1: Benchmarking & Economics */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Price Benchmarking Card */}
            <div className="glass rounded-[40px] p-8 space-y-8 relative overflow-hidden">
               <div className="relative z-10 grid grid-cols-2 gap-8 border-b border-card-border pb-8">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted font-black">Competitor Price</p>
                    <p className="text-3xl font-mono font-bold text-red-400/80">₹{financials.competitorPrice.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-black">Predicted Operating</p>
                    <p className="text-3xl font-mono font-bold text-luxury-gold">₹{predictedOptimal.toLocaleString()}</p>
                  </div>
               </div>

               <div className="space-y-6 pt-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center space-x-2">
                    <Calculator className="w-4 h-4 text-luxury-gold" />
                    <span>Unit Economics Editor</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center justify-between">
                        <span>Manufacturing Base (₹)</span>
                        <Factory className="w-3 h-3" />
                      </label>
                      <input 
                        type="number"
                        value={financials.manufacturingCost}
                        onChange={(e) => handleInputChange(e, "manufacturingCost")}
                        className="w-full bg-luxury-slate/5 border border-card-border rounded-2xl px-5 py-3.5 text-sm font-mono focus:border-luxury-gold/50 outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center justify-between">
                          <span>Transit (₹)</span>
                          <Truck className="w-3 h-3" />
                        </label>
                        <input 
                          type="number"
                          value={financials.transportCost}
                          onChange={(e) => handleInputChange(e, "transportCost")}
                          className="w-full bg-luxury-slate/5 border border-card-border rounded-2xl px-5 py-3.5 text-sm font-mono outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-muted font-bold flex items-center justify-between">
                          <span>Ops & Tax (₹)</span>
                          <Store className="w-3 h-3" />
                        </label>
                        <input 
                          type="number"
                          value={financials.operationalCost}
                          onChange={(e) => handleInputChange(e, "operationalCost")}
                          className="w-full bg-luxury-slate/5 border border-card-border rounded-2xl px-5 py-3.5 text-sm font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-card-border">
                      <label className="text-[10px] uppercase tracking-widest text-luxury-gold font-black flex items-center justify-between mb-3">
                        <span>Final Execution Price (₹)</span>
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Rec: ₹{predictedOptimal.toLocaleString()}</span>
                        </div>
                      </label>
                      <input 
                        type="number"
                        value={financials.retailPrice}
                        onChange={(e) => handleInputChange(e, "retailPrice")}
                        className="w-full bg-luxury-gold/10 border border-luxury-gold/30 rounded-2xl px-5 py-4 text-2xl font-mono font-bold text-luxury-gold focus:border-luxury-gold outline-none transition-all shadow-[0_0_30px_rgba(184,134,11,0.05)]"
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-luxury-slate/5 p-6 rounded-3xl border border-card-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">Projected Net Margin</span>
                    <span className={cn(
                      "text-2xl font-mono font-bold",
                      parseFloat(marginPercentage) < 20 ? 'text-orange-400' : 'text-green-500'
                    )}>
                      {marginPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", parseFloat(marginPercentage) < 20 ? 'bg-orange-400' : 'bg-green-500')} 
                      style={{ width: `${Math.min(100, Math.max(0, parseFloat(marginPercentage) * 2))}%` }}
                    />
                  </div>
               </div>

               {!isSentForApproval && (
                  <button 
                    onClick={() => setIsSentForApproval(true)}
                    className="w-full py-4 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl"
                  >
                    Submit for Executive Sign-off
                  </button>
               )}
            </div>
          </div>

          {/* Section 2: Authorization Workflow */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass rounded-[40px] p-8 h-full flex flex-col">
              <header className="mb-8">
                <h3 className="text-xl font-medium tracking-tight">Protocol Authorization</h3>
                <p className="text-[10px] text-muted uppercase font-bold tracking-widest mt-1">Multi-Level Stakeholder Verification Required</p>
              </header>

              <div className="space-y-4 flex-1">
                {[
                  { key: 'finance', label: 'Finance Sign-Off', icon: IndianRupee, detail: 'Margin & Tax Compliance' },
                  { key: 'supplyChain', label: 'Logistics Sign-Off', icon: Truck, detail: 'Capacity & Route Allocation' },
                  { key: 'retail', label: 'Retail Sign-Off', icon: Store, detail: 'Node Distribution Ready' }
                ].map((step) => {
                  const isApproved = approvals[step.key as keyof typeof approvals];
                  return (
                    <div key={step.key} className={cn(
                      "p-6 rounded-3xl border transition-all duration-500 flex items-center justify-between",
                      isApproved ? 'bg-green-500/10 border-green-500/30' : 'bg-luxury-slate/5 border-card-border'
                    )}>
                      <div className="flex items-center space-x-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                          isApproved ? 'bg-green-500/20 text-green-500' : 'bg-card-border text-muted'
                        )}>
                          {isApproved ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold">{step.label}</h4>
                          <p className="text-[10px] text-muted uppercase tracking-widest mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                      {!isApproved ? (
                        <button 
                          disabled={!isSentForApproval}
                          onClick={() => handleApprove(step.key as keyof typeof approvals)} 
                          className="text-[9px] px-6 py-3 bg-card-border hover:bg-primary hover:text-background rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Authorize
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                           <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-8 mt-4 border-t border-card-border">
                {isDone ? (
                  <div className="bg-green-500/10 border border-green-500/20 p-10 rounded-[32px] flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-green-500">Execution Successful</h3>
                      <p className="text-muted text-xs mt-2 max-w-xs mx-auto">Market prices synchronized and supply chain nodes activated globally.</p>
                    </div>
                    <Link href="/" className="mt-6 px-10 py-4 bg-primary text-background rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105">
                      Return to Command
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button
                      disabled={!allApproved || isExecuting}
                      onClick={handleFinalExecute}
                      className={cn(
                        "w-full py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-xs flex justify-center items-center space-x-4 transition-all duration-500",
                        allApproved 
                          ? 'bg-luxury-gold text-luxury-charcoal hover:scale-[1.02] shadow-[0_20px_60px_rgba(184,134,11,0.2)] active:scale-95' 
                          : 'bg-card-border text-muted cursor-not-allowed opacity-50'
                      )}
                    >
                      {isExecuting ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-5 h-5 border-2 border-luxury-charcoal/30 border-t-luxury-charcoal animate-spin rounded-full" />
                          <span className="animate-pulse">Broadcasting to Retail Nodes...</span>
                        </div>
                      ) : (
                        <>
                          <span>Deploy Execution Protocol</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    {!allApproved && (
                      <p className="text-center text-[10px] text-muted uppercase tracking-widest flex justify-center items-center space-x-2">
                        <FileWarning className="w-4 h-4 text-orange-400" />
                        <span>Awaiting {Object.values(approvals).filter(a => !a).length} Executive Approvals</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
