import React, { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag, TrendingUp, DollarSign } from "lucide-react";
import { getAdSlots, saveAdSlots, getAdPromos, saveAdPromos, TIER_CONFIG, type AdSlot, type AdTier, type AdPromoCode } from "@/data/adSlotsData";
import { formatPrice } from "@/lib/cityUtils";

type SubTab = "slots" | "promos" | "revenue";

const CITIES = ["Madurai", "Chennai", "Coimbatore", "Trichy", "Bangalore", "Hyderabad", "Mumbai", "Delhi"];

const AdSlotsTab: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTab>("slots");
  const [slots, setSlots] = useState<AdSlot[]>(() => getAdSlots());
  const [promos, setPromos] = useState<AdPromoCode[]>(() => getAdPromos());
  const [filterCity, setFilterCity] = useState("Madurai");
  const [editingPromo, setEditingPromo] = useState<string | null>(null);
  const [promoForm, setPromoForm] = useState({ code: "", tier: "gold" as AdTier, discountPercent: 50, maxUses: 10 });

  const persistSlots = (s: AdSlot[]) => { setSlots(s); saveAdSlots(s); };
  const persistPromos = (p: AdPromoCode[]) => { setPromos(p); saveAdPromos(p); };

  const citySlots = slots.filter(s => s.city === filterCity);
  const tiers: AdTier[] = ["gold", "silver", "bronze"];

  // Revenue calc
  const totalRevenue = slots.filter(s => s.active).reduce((sum, s) => sum + s.amountPaid, 0);
  const revenueByCity = CITIES.map(city => ({
    city,
    revenue: slots.filter(s => s.city === city && s.active).reduce((sum, s) => sum + s.amountPaid, 0),
    activeSlots: slots.filter(s => s.city === city && s.active).length,
    expiredSlots: slots.filter(s => s.city === city && !s.active).length,
  })).filter(c => c.revenue > 0 || c.activeSlots > 0);

  const toggleSlot = (id: string) => { persistSlots(slots.map(s => s.id === id ? { ...s, active: !s.active } : s)); };
  const removeSlot = (id: string) => { persistSlots(slots.filter(s => s.id !== id)); };

  const savePromo = () => {
    if (!promoForm.code) return;
    if (editingPromo === "new") {
      persistPromos([...promos, { id: crypto.randomUUID(), ...promoForm, usedCount: 0, usedBySellers: [], active: true }]);
    } else {
      persistPromos(promos.map(p => p.id === editingPromo ? { ...p, ...promoForm } : p));
    }
    setEditingPromo(null);
  };

  const inputClass = "w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Ad Slots Management</h2>
        <div className="flex gap-2">
          {(["slots", "promos", "revenue"] as SubTab[]).map(st => (
            <button key={st} onClick={() => setSubTab(st)} className={`rounded-pill px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${subTab === st ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"}`}>
              {st === "slots" ? "Slots" : st === "promos" ? "Promo Codes" : "Revenue"}
            </button>
          ))}
        </div>
      </div>

      {/* Slots sub-tab */}
      {subTab === "slots" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className={`${inputClass} max-w-[200px]`}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Occupancy summary */}
          <div className="grid gap-3 grid-cols-3">
            {tiers.map(tier => {
              const cfg = TIER_CONFIG[tier];
              const used = citySlots.filter(s => s.tier === tier && s.active).length;
              return (
                <div key={tier} className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor} p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-pill px-2 py-0.5 text-[9px] font-bold ${cfg.badgeColor}`}>{cfg.badge} {tier.toUpperCase()}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{used}/{cfg.maxSlots}</p>
                  <p className="text-[10px] text-muted-foreground">{formatPrice(cfg.price)}/mo</p>
                </div>
              );
            })}
          </div>

          {/* Slot list */}
          <div className="space-y-2">
            {citySlots.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No ad slots in {filterCity}</p>}
            {citySlots.map(s => (
              <div key={s.id} className={`flex items-center gap-3 rounded-xl border p-3 ${s.active ? "border-border bg-card" : "border-border bg-muted/50 opacity-60"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-pill px-2 py-0.5 text-[8px] font-bold ${TIER_CONFIG[s.tier].badgeColor}`}>{TIER_CONFIG[s.tier].badge} {s.tier.toUpperCase()}</span>
                    <span className="text-sm font-semibold text-foreground truncate">{s.shopName}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{s.startDate} → {s.endDate} · {formatPrice(s.amountPaid)}</p>
                </div>
                <button onClick={() => toggleSlot(s.id)}>
                  {s.active ? <ToggleRight className="h-5 w-5 text-[hsl(var(--success))]" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                </button>
                <button onClick={() => removeSlot(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promos sub-tab */}
      {subTab === "promos" && (
        <div className="space-y-4">
          <button onClick={() => { setEditingPromo("new"); setPromoForm({ code: "", tier: "gold", discountPercent: 50, maxUses: 10 }); }} className="flex items-center gap-1.5 rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" /> New Promo Code
          </button>

          {editingPromo && (
            <div className="rounded-2xl border border-primary bg-card p-4 shadow-card space-y-3">
              <div className="grid gap-3 grid-cols-2">
                <input type="text" value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} placeholder="Code e.g. GOLD50" className={inputClass} />
                <select value={promoForm.tier} onChange={e => setPromoForm({ ...promoForm, tier: e.target.value as AdTier })} className={inputClass}>
                  <option value="gold">Gold tier only</option>
                  <option value="silver">Silver tier only</option>
                  <option value="bronze">Bronze tier only</option>
                </select>
                <input type="number" value={promoForm.discountPercent} onChange={e => setPromoForm({ ...promoForm, discountPercent: +e.target.value })} placeholder="Discount %" className={inputClass} />
                <input type="number" value={promoForm.maxUses} onChange={e => setPromoForm({ ...promoForm, maxUses: +e.target.value })} placeholder="Max uses" className={inputClass} />
              </div>
              <div className="flex gap-2">
                <button onClick={savePromo} className="rounded-pill bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">Save</button>
                <button onClick={() => setEditingPromo(null)} className="rounded-pill border border-border px-5 py-2 text-xs font-semibold text-foreground">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {promos.map(p => (
              <div key={p.id} className={`flex items-center gap-3 rounded-xl border p-3 ${p.active ? "border-border bg-card" : "border-border bg-muted/50 opacity-60"}`}>
                <Tag className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{p.code}</span>
                    <span className={`rounded-pill px-2 py-0.5 text-[8px] font-bold ${TIER_CONFIG[p.tier].badgeColor}`}>{p.tier.toUpperCase()}</span>
                    <span className="text-xs text-primary font-semibold">{p.discountPercent}% off</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Used: {p.usedCount}/{p.maxUses}</p>
                </div>
                <button onClick={() => persistPromos(promos.map(pr => pr.id === p.id ? { ...pr, active: !pr.active } : pr))}>
                  {p.active ? <ToggleRight className="h-5 w-5 text-[hsl(var(--success))]" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                </button>
                <button onClick={() => persistPromos(promos.filter(pr => pr.id !== p.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue sub-tab */}
      {subTab === "revenue" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Total Active Revenue</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">{slots.filter(s => s.active).length} active slots across all cities</p>
          </div>

          <div className="space-y-2">
            {revenueByCity.map(c => (
              <div key={c.city} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.city}</p>
                    <p className="text-[10px] text-muted-foreground">{c.activeSlots} active · {c.expiredSlots} expired</p>
                  </div>
                </div>
                <span className="text-base font-bold text-foreground">{formatPrice(c.revenue)}</span>
              </div>
            ))}
            {revenueByCity.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No revenue data yet</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdSlotsTab;
