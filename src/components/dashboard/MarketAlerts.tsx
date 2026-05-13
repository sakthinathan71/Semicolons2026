import React from "react";
import { ShieldAlert, Bell, Mail, MessageSquare, Smartphone, LucideIcon } from "lucide-react";
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
                  <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-red-500/[0.02] border border-red-500/10 rounded-3xl group hover:bg-red-500/[0.05] transition-all gap-4">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold border border-red-500/20 text-red-400 shrink-0">
                        !
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h4 className="font-bold text-lg text-white">{s.brand} Incident</h4>
                          <span className="bg-red-500/20 text-red-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-red-500/30 tracking-widest shrink-0">Urgent Response</span>
                        </div>
                        <p className="text-sm text-white/40 mt-1">{s.event} detected in {s.category}. AI predicts immediate inventory shift.</p>
                      </div>
                    </div>
                    <div className="text-right w-full md:w-auto shrink-0">
                       <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mb-2">{s.time}</p>
                       <button className="text-[10px] font-black uppercase tracking-widest text-red-400 underline decoration-red-500/30 underline-offset-4">Mitigate Threat</button>
                    </div>
                  </div>
                ))
              )}
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
