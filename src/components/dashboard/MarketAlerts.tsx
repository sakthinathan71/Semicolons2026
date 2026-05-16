import React from "react";
import { ShieldAlert, Bell, Mail, MessageSquare, Smartphone, LucideIcon, MapPin, CheckCircle2, Cpu, Globe2 } from "lucide-react";
import Link from "next/link";
import { MarketSignal } from "@/lib/intelligence";

interface MarketAlertsProps {
  signals: MarketSignal[];
}

export default function MarketAlerts({ signals }: MarketAlertsProps) {
  const criticalAlerts = signals.filter((s) => s.impact === "High");

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-8">
          <section className="glass p-10 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-medium mb-8 flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              <span>Critical Security & Pricing Alerts</span>
            </h3>

            <div className="space-y-4">
              {criticalAlerts.length === 0 ? (
                <div className="py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                   No critical threats detected. Monitoring 8 luxury storefronts...
                </div>
              ) : (
                criticalAlerts.map((s, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-red-500/[0.02] border border-red-500/10 rounded-3xl group hover:bg-red-500/[0.05] transition-all gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                       <Globe2 className="w-16 h-16 text-red-400" />
                    </div>
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold border border-red-500/20 text-red-400 shrink-0">
                        !
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="font-bold text-lg text-white">{s.brand} Incident</h4>
                          <span className="bg-red-500/20 text-red-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30 tracking-widest shrink-0">Urgent Response</span>
                          <div className="flex items-center space-x-1 text-[10px] text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase tracking-widest">
                             <MapPin className="w-3 h-3 text-white/20" />
                             <span>Global Distribution</span>
                          </div>
                        </div>
                        <p className="text-sm text-white/40 mt-1">{s.event} detected in {s.category}. AI predicts immediate inventory shift.</p>
                      </div>
                    </div>
                    <div className="text-right w-full md:w-auto shrink-0 relative z-10 flex flex-row md:flex-col justify-between items-end">
                       <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-2">{s.time}</p>
                       <Link 
                          href={`/metrics/active-alerts`} 
                          className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors"
                       >
                          Mitigate Threat
                       </Link>
                    </div>
                  </div>
                ))
              )}
              </div>
              
              {/* Recently Resolved Alerts Log */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center space-x-2">
                   <CheckCircle2 className="w-4 h-4 text-green-400" />
                   <span>Recently Resolved Alerts</span>
                </h4>
                <div className="space-y-3 opacity-60">
                   <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center space-x-4">
                         <span className="text-[10px] font-mono text-white/40">12:44 PM</span>
                         <span className="text-xs font-bold">Prada Price Drop Mitigated</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Automated Promo Engaged</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                      <div className="flex items-center space-x-4">
                         <span className="text-[10px] font-mono text-white/40">09:15 AM</span>
                         <span className="text-xs font-bold">Chanel Inventory Sync Issue</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Supply Chain Re-Routed</span>
                   </div>
                </div>
              </div>

          </section>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <section className="glass p-8 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-luxury-gold" />
              <span>Notification Nodes</span>
            </h4>
            <div className="space-y-4">
               <NotificationChannel icon={Mail} label="Executive Email Brief" status="Active" />
               <NotificationChannel icon={MessageSquare} label="Slack Intelligence" status="Active" />
               <NotificationChannel icon={Smartphone} label="SMS High-Impact Alerts" status="Standby" />
            </div>
          </section>

          <section className="glass p-8 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02]">
            <h4 className="text-lg font-medium mb-4">Alert Thresholds</h4>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Define the sensitivity of our neural monitoring agents. Currently tuned for "High Precision."
            </p>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60">Pricing Floor Breach</span>
                  <span className="text-luxury-gold font-bold">5.0%</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-luxury-gold h-full w-[40%]"></div>
               </div>
               <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-white/60">Social Velocity Spike</span>
                  <span className="text-luxury-gold font-bold">80%</span>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-luxury-gold h-full w-[80%]"></div>
               </div>
            </div>
          </section>
          <section className="glass p-8 rounded-[40px] border border-white/5">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-luxury-gold" />
              <span>Automated Mitigation Rules</span>
            </h4>
            <div className="space-y-4">
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold">Out of Stock Match</span>
                     <span className="text-[8px] bg-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded font-black uppercase">Active</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">If competitor stockout &gt; 24h, automatically deploy &quot;Similar Visual Match&quot; campaign to highly-engaged segment.</p>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 rounded-2xl opacity-50">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold">Dynamic Price Parity</span>
                     <span className="text-[8px] bg-white/10 text-white/40 px-2 py-0.5 rounded font-black uppercase">Disabled</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">Automatically lower price up to 5% to match primary competitor flash sales.</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function NotificationChannel({ icon: Icon, label, status }: { icon: LucideIcon, label: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
       <div className="flex items-center space-x-3">
          <Icon className="w-4 h-4 text-white/20" />
          <span className="text-xs font-medium text-white/60">{label}</span>
       </div>
       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}>
         {status}
       </span>
    </div>
  );
}
