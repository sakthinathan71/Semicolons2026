"use client";

import React, { useState } from "react";
import { Zap, ShieldCheck, Settings2, Power, AlertTriangle, ArrowRight, PlayCircle } from "lucide-react";

interface Policy {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  intensity: number; // 1-3
}

const INITIAL_POLICIES: Policy[] = [
  { id: "p1", name: "Stockout Intercept", trigger: "Competitor OOS > 4h", action: "Boost Similar SKU Bids +25%", enabled: true, intensity: 2 },
  { id: "p2", name: "Dynamic Parity Guard", trigger: "Price Drop > 10%", action: "Match Margin Floor (Min 18%)", enabled: true, intensity: 3 },
  { id: "p3", name: "Viral Velocity Counter", trigger: "Social Velocity > 90%", action: "Deploy Influencer Response", enabled: false, intensity: 1 },
];

export default function AutopilotPolicyEngine() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [isAutopilotOn, setIsAutopilotOn] = useState(true);

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <div className="glass rounded-[40px] border border-white/5 p-8 shadow-2xl relative overflow-hidden h-full">
      {/* Background Pulse */}
      {isAutopilotOn && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 blur-3xl animate-pulse rounded-full -mr-16 -mt-16" />
      )}

      <div className="relative z-10 space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-luxury-gold" />
              <h2 className="text-xl font-medium tracking-tight">Autopilot Policy Engine</h2>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Autonomous Decisioning Core</p>
          </div>
          <button 
            onClick={() => setIsAutopilotOn(!isAutopilotOn)}
            className={`flex items-center space-x-3 px-4 py-2 rounded-full border transition-all duration-500 ${
              isAutopilotOn 
                ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold shadow-[0_0_20px_rgba(200,160,89,0.2)]' 
                : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            <Power className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {isAutopilotOn ? "Systems Live" : "Offline"}
            </span>
          </button>
        </header>

        <div className="space-y-4">
          {policies.map((policy) => (
            <div 
              key={policy.id}
              className={`p-5 rounded-3xl border transition-all duration-500 ${
                policy.enabled && isAutopilotOn
                  ? 'bg-white/[0.04] border-luxury-gold/30 shadow-lg' 
                  : 'bg-white/[0.02] border-white/5 grayscale opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${policy.enabled && isAutopilotOn ? 'bg-luxury-gold text-luxury-charcoal' : 'bg-white/5 text-white/40'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{policy.name}</h4>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5">{policy.trigger}</p>
                  </div>
                </div>
                <button 
                  onClick={() => togglePolicy(policy.id)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                    policy.enabled ? 'bg-luxury-gold' : 'bg-white/10'
                  }`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                    policy.enabled ? 'left-6' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/60 bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="flex items-center space-x-2">
                   <PlayCircle className="w-3 h-3 text-luxury-gold" />
                   <span>Action: {policy.action}</span>
                </div>
                <ArrowRight className="w-3 h-3 opacity-20" />
              </div>

              {/* Intensity Bar */}
              <div className="mt-4 flex items-center space-x-2">
                <p className="text-[8px] text-white/20 uppercase font-black">AI Intensity</p>
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden flex space-x-0.5">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`flex-1 h-full rounded-full transition-all duration-1000 ${
                        i <= policy.intensity 
                          ? (policy.enabled && isAutopilotOn ? 'bg-luxury-gold' : 'bg-white/10') 
                          : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center space-x-2 group transition-all">
          <Settings2 className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white">
            Author New Policy
          </span>
        </button>

        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <p className="text-[9px] text-orange-400/80 leading-relaxed italic">
            <strong>Safety Warning:</strong> Autopilot actions are bound by current "Margin Floor" settings. System will escalate to manual review if proposed ROI is below 12%.
          </p>
        </div>
      </div>
    </div>
  );
}
