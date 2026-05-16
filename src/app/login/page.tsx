"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, ArrowRight, Loader2, Globe } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay and set cookie
    setTimeout(() => {
      // Set a dummy cookie for the middleware check
      document.cookie = "auth_session=true; path=/; max-age=86400"; // 24h
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-luxury-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-luxury-gold/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle, #C8A059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-luxury-gold/10 rounded-[24px] border border-luxury-gold/20 mb-6 shadow-[0_0_40px_rgba(200,160,89,0.1)]">
            <Shield className="w-10 h-10 text-luxury-gold" />
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2">LuxeLens</h1>
          <p className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-black">Enterprise Intelligence Command</p>
        </div>

        <div className="glass rounded-[40px] border border-white/5 p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
          {/* Subtle scanning light effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold/20 to-transparent -translate-y-full group-hover:translate-y-[400px] transition-transform duration-[3s] ease-linear" />

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest ml-1">Terminal ID / Email</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-luxury-gold transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@luxelens.ai"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-luxury-gold/30 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest ml-1">Access Protocol / Password</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-luxury-gold transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-luxury-gold/30 focus:bg-white/[0.05] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center transition-colors group-hover:border-luxury-gold/40">
                  <div className="w-2 h-2 bg-luxury-gold rounded-sm opacity-0 group-hover:opacity-20" />
                </div>
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Remember Terminal</span>
              </label>
              <Link href="#" className="text-[10px] text-luxury-gold/60 hover:text-luxury-gold uppercase font-bold tracking-tighter transition-colors">
                Lost Access?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-luxury-gold hover:bg-white text-luxury-charcoal font-black uppercase tracking-[0.2em] text-xs py-5 rounded-2xl transition-all duration-500 shadow-[0_10px_30px_rgba(200,160,89,0.2)] flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Initialize Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <Globe className="w-3 h-3 text-white/20" />
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Global Encrypted</span>
          </div>
          <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
          <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Version 4.2.0-PRO</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation: fade-in 0.8s ease-out forwards; }
        .zoom-in { animation: zoom-in 0.8s ease-out forwards; }
      `}} />
    </div>
  );
}
