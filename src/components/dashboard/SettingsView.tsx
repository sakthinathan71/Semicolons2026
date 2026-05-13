import React, { useState } from "react";
import { Users, Globe, Camera, Trash2, Plus, Loader2 } from "lucide-react";
import { useIntelligence } from "@/lib/IntelligenceContext";

export default function SettingsView() {
  const { brands, setBrands } = useIntelligence();
  const [newName, setNewName] = useState("");
  const [newWeb, setNewWeb] = useState("");
  const [newInsta, setNewInsta] = useState("");

  const addBrand = () => {
    if (!newName) return;
    const newBrand = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      website: newWeb || "tbd.com",
      instagram: newInsta || "@tbd",
      isCompetitor: true
    };
    setBrands([...brands, newBrand]);
    setNewName("");
    setNewWeb("");
    setNewInsta("");
  };

  const removeBrand = (id: string) => {
    setBrands(brands.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8 space-y-8">
          <section className="glass p-10 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-medium mb-8 flex items-center space-x-3">
              <Users className="w-6 h-6 text-luxury-gold" />
              <span>Brand Configuration Portfolio</span>
            </h3>
            
            <div className="space-y-4">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-luxury-gold/20 transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold border border-white/10 text-luxury-gold">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="font-bold text-lg">{brand.name}</h4>
                        {!brand.isCompetitor && <span className="bg-luxury-gold/20 text-luxury-gold text-[8px] font-black uppercase px-2 py-0.5 rounded border border-luxury-gold/30">Primary Brand</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-1">
                        <span className="flex items-center space-x-1.5 text-xs text-white/20">
                          <Globe className="w-3 h-3" />
                          <span>{brand.website}</span>
                        </span>
                        <span className="flex items-center space-x-1.5 text-xs text-white/20">
                          <Camera className="w-3 h-3" />
                          <span>{brand.instagram}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {brand.isCompetitor && (
                    <button onClick={() => removeBrand(brand.id)} className="p-2 text-white/10 hover:text-red-400 transition-colors" aria-label={`Remove ${brand.name}`}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <section className="glass p-8 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02]">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-luxury-gold" />
              <span>Add Competitor</span>
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Brand Name</label>
                <input 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Gucci" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Storefront URL</label>
                <input 
                  value={newWeb} 
                  onChange={(e) => setNewWeb(e.target.value)}
                  placeholder="gucci.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Instagram Handle</label>
                <input 
                  value={newInsta} 
                  onChange={(e) => setNewInsta(e.target.value)}
                  placeholder="@gucci" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-luxury-gold/50 outline-none transition-all"
                />
              </div>
              <button 
                onClick={addBrand}
                className="w-full bg-luxury-gold text-luxury-charcoal font-bold py-4 rounded-2xl mt-4 hover:scale-[1.02] transition-all active:scale-95 shadow-2xl disabled:opacity-50"
                disabled={!newName}
              >
                Register Brand Scrapers
              </button>
            </div>
          </section>

          <div className="glass p-8 rounded-[40px] border border-white/5 text-center">
             <div className="p-3 bg-white/5 rounded-full w-fit mx-auto mb-4 border border-white/10">
                <Loader2 className="w-6 h-6 text-luxury-gold animate-spin" />
             </div>
             <p className="text-xs text-white/60 font-medium">Scrapers in Queue: 0</p>
             <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Status: Ready to Crawl</p>
          </div>
        </div>
      </div>
    </div>
  );
}
