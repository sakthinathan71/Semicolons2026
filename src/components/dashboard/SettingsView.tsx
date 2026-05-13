"use client";

import React, { useState } from "react";
import { Users, Globe, Camera, Trash2, Plus } from "lucide-react";
import { useIntelligence, BrandConfig } from "@/lib/IntelligenceContext";

// ─── Validation ───────────────────────────────────────────────────────────────

const URL_PATTERN = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

function sanitizeName(value: string): string {
  return value.trim().replace(/[<>"']/g, "");
}

function validateAndSanitizeUrl(value: string): { url: string; isValid: boolean } {
  const url = value.trim().toLowerCase();
  return { url, isValid: URL_PATTERN.test(url) };
}

function formatInstagram(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BrandCard({ brand, onRemove }: { brand: BrandConfig; onRemove: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-luxury-gold/20 transition-all duration-300">
      <div className="flex items-center space-x-6">
        <div
          className="w-12 h-12 bg-luxury-charcoal rounded-xl flex items-center justify-center font-bold text-xl border border-white/10 text-luxury-gold shrink-0"
          aria-hidden="true"
        >
          {brand.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <h4 className="font-bold text-lg">{brand.name}</h4>
            {!brand.isCompetitor && (
              <span className="bg-luxury-gold/20 text-luxury-gold text-[8px] font-black uppercase px-2 py-0.5 rounded border border-luxury-gold/30 shrink-0">
                Primary Brand
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <span className="flex items-center space-x-1.5 text-xs text-white/30">
              <Globe className="w-3 h-3 shrink-0" />
              <span>{brand.website}</span>
            </span>
            <span className="flex items-center space-x-1.5 text-xs text-white/30">
              <Camera className="w-3 h-3 shrink-0" />
              <span>{brand.instagram}</span>
            </span>
          </div>
        </div>
      </div>
      {brand.isCompetitor && (
        <button
          onClick={() => onRemove(brand.id)}
          className="p-2 text-white/10 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 shrink-0"
          aria-label={`Remove ${brand.name} from monitoring`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// ─── Add Competitor Form ──────────────────────────────────────────────────────

interface FormState {
  name: string;
  website: string;
  instagram: string;
}

interface FormErrors {
  name?: string;
  website?: string;
}

function AddCompetitorForm({ onAdd }: { onAdd: (brand: Omit<BrandConfig, "id">) => void }) {
  const [form, setForm] = useState<FormState>({ name: "", website: "", instagram: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const sanitizedName = sanitizeName(form.name);
    if (!sanitizedName || sanitizedName.length < 2) {
      newErrors.name = "Brand name must be at least 2 characters.";
    }
    const { isValid } = validateAndSanitizeUrl(form.website);
    if (form.website && !isValid) {
      newErrors.website = "Please enter a valid URL (e.g. gucci.com).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const { url } = validateAndSanitizeUrl(form.website);
    onAdd({
      name: sanitizeName(form.name),
      website: url || "pending-setup.com",
      instagram: form.instagram ? formatInstagram(form.instagram) : "@pending",
      isCompetitor: true,
    });
    setForm({ name: "", website: "", instagram: "" });
    setErrors({});
  };

  const inputClass =
    "w-full bg-white/5 border rounded-2xl px-5 py-3 text-sm outline-none transition-all placeholder-white/20";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="brand-name" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block">
            Brand Name *
          </label>
          <input
            id="brand-name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Gucci"
            className={`${inputClass} ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-luxury-gold/50"}`}
            maxLength={60}
          />
          {errors.name && <p className="text-red-400 text-[10px] ml-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="brand-website" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block">
            Storefront URL
          </label>
          <input
            id="brand-website"
            value={form.website}
            onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
            placeholder="gucci.com"
            className={`${inputClass} ${errors.website ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-luxury-gold/50"}`}
            maxLength={200}
          />
          {errors.website && <p className="text-red-400 text-[10px] ml-1">{errors.website}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="brand-instagram" className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 block">
            Instagram Handle
          </label>
          <input
            id="brand-instagram"
            value={form.instagram}
            onChange={(e) => setForm((prev) => ({ ...prev, instagram: e.target.value }))}
            placeholder="@gucci"
            className={`${inputClass} border-white/10 focus:border-luxury-gold/50`}
            maxLength={40}
          />
        </div>

        <button
          type="submit"
          disabled={!form.name.trim()}
          className="w-full bg-luxury-gold text-luxury-charcoal font-bold py-4 rounded-2xl mt-4 hover:scale-[1.02] transition-all active:scale-95 shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Register Brand Scrapers
        </button>
      </div>
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsView() {
  const { brands, setBrands } = useIntelligence();

  const handleAddBrand = (newBrandData: Omit<BrandConfig, "id">) => {
    const id = `brand-${Date.now()}`;
    setBrands((prev) => [...prev, { id, ...newBrandData }]);
  };

  const handleRemoveBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  const competitorCount = brands.filter((b) => b.isCompetitor).length;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Brand List */}
        <div className="xl:col-span-8 space-y-8">
          <section className="glass p-10 rounded-[40px] border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-medium flex items-center space-x-3">
                <Users className="w-6 h-6 text-luxury-gold" />
                <span>Brand Configuration Portfolio</span>
              </h3>
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                {competitorCount} competitor{competitorCount !== 1 ? "s" : ""} monitored
              </span>
            </div>

            {brands.length === 0 ? (
              <div className="py-20 text-center text-white/20 italic border border-dashed border-white/10 rounded-3xl">
                No brands configured. Add a competitor to begin monitoring.
              </div>
            ) : (
              <div className="space-y-4">
                {brands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} onRemove={handleRemoveBrand} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Add Competitor + Status */}
        <div className="xl:col-span-4 space-y-8">
          <section className="glass p-8 rounded-[40px] border border-luxury-gold/20 bg-luxury-gold/[0.02]">
            <h4 className="text-lg font-medium mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-luxury-gold" />
              <span>Add Competitor</span>
            </h4>
            <AddCompetitorForm onAdd={handleAddBrand} />
          </section>

          <div className="glass p-8 rounded-[40px] border border-white/5 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse block" />
            </div>
            <p className="text-sm font-semibold text-white/60">
              Scrapers in Queue:{" "}
              <span className="text-luxury-gold">{competitorCount}</span>
            </p>
            <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">
              Status: Ready to Crawl
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
