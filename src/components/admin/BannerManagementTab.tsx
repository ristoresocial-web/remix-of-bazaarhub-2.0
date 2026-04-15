import React, { useState } from "react";
import {
  MapPin, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Tag,
  TrendingUp, DollarSign, Eye, Calendar, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getBannerBookings, saveBannerBookings, getBannerPromos, saveBannerPromos,
  getCityBannerAvailability, BANNER_SLOT_CONFIGS, ALL_BANNER_CITIES,
  type BannerBooking, type BannerSlotType, type BannerPromoCode,
} from "@/data/bannerSlotsData";
import { formatPrice } from "@/lib/cityUtils";

type SubTab = "slots" | "promos" | "revenue";

const BannerManagementTab: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTab>("slots");
  const [bookings, setBookings] = useState<BannerBooking[]>(() => getBannerBookings());
  const [promos, setPromos] = useState<BannerPromoCode[]>(() => getBannerPromos());
  const [filterCity, setFilterCity] = useState("Madurai");
  const [editingPromo, setEditingPromo] = useState<string | null>(null);
  const [promoForm, setPromoForm] = useState({
    code: "", city: "all", slotType: "all" as BannerSlotType | "all",
    discountPercent: 50, maxUses: 10, description: "",
  });

  const persistBookings = (b: BannerBooking[]) => { setBookings(b); saveBannerBookings(b); };
  const persistPromos = (p: BannerPromoCode[]) => { setPromos(p); saveBannerPromos(p); };

  const cityBookings = bookings.filter(b => b.city === filterCity);
  const availability = getCityBannerAvailability(filterCity);

  const toggleBooking = (id: string) => {
    persistBookings(bookings.map(b => b.id === id ? { ...b, active: !b.active, status: b.active ? "cancelled" as const : "active" as const } : b));
    toast.success("Booking updated.");
  };

  const deleteBooking = (id: string) => {
    persistBookings(bookings.filter(b => b.id !== id));
    toast.success("Booking deleted.");
  };

  const savePromo = () => {
    if (!promoForm.code || !promoForm.description) { toast.error("Code and description required."); return; }
    if (editingPromo === "new") {
      const newPromo: BannerPromoCode = {
        ...promoForm, id: `bp-${Date.now()}`,
        usedCount: 0, usedBySellers: [], active: true,
      };
      persistPromos([...promos, newPromo]);
      toast.success("Promo code created.");
    } else if (editingPromo) {
      persistPromos(promos.map(p => p.id === editingPromo ? { ...p, ...promoForm } : p));
      toast.success("Promo code updated.");
    }
    setEditingPromo(null);
  };

  // Revenue
  const totalRevenue = bookings.filter(b => b.status === "active").reduce((sum, b) => sum + b.amountPaid, 0);
  const revenueByCity = ALL_BANNER_CITIES.map(city => ({
    city,
    revenue: bookings.filter(b => b.city === city && b.status === "active").reduce((sum, b) => sum + b.amountPaid, 0),
    activeSlots: bookings.filter(b => b.city === city && b.status === "active").length,
  }));

  const subTabClass = (t: SubTab) =>
    `rounded-pill px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
      subTab === t ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"
    }`;

  const inputClass = "w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">City Banner Management</h2>
          <p className="text-xs text-muted-foreground">Manage banner slots, promos, and revenue per city</p>
        </div>
        <div className="flex gap-2">
          {(["slots", "promos", "revenue"] as SubTab[]).map(t => (
            <button key={t} onClick={() => setSubTab(t)} className={subTabClass(t)}>
              {t === "slots" ? "Slots" : t === "promos" ? "Promo Codes" : "Revenue"}
            </button>
          ))}
        </div>
      </div>

      {/* SLOTS TAB */}
      {subTab === "slots" && (
        <div className="space-y-4">
          {/* City filter */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className={inputClass + " !w-auto"}>
              {ALL_BANNER_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Availability overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(Object.entries(BANNER_SLOT_CONFIGS) as [BannerSlotType, typeof BANNER_SLOT_CONFIGS[BannerSlotType]][]).map(([type, cfg]) => {
              const a = availability[type];
              return (
                <div key={type} className={`rounded-card border ${cfg.borderColor} ${cfg.bgColor} p-3 text-center`}>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{cfg.badge} {cfg.label}</p>
                  <p className="text-lg font-bold text-foreground">{a.used}/{a.total}</p>
                  <p className="text-[10px] text-muted-foreground">{a.available} available</p>
                </div>
              );
            })}
          </div>

          {/* Booking list */}
          <div className="space-y-2">
            {cityBookings.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No banner bookings in {filterCity}.</p>
            )}
            {cityBookings.map(b => {
              const cfg = BANNER_SLOT_CONFIGS[b.slotType];
              return (
                <div key={b.id} className={`rounded-card border p-4 transition-all ${b.active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-70"}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {b.bannerImage && (
                        <div className="h-14 w-24 rounded-lg border border-border overflow-hidden shrink-0">
                          <img src={b.bannerImage} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-[10px] ${cfg.badgeColor}`}>{cfg.badge} {cfg.label}</Badge>
                          <Badge variant={b.status === "active" ? "default" : b.status === "pending" ? "secondary" : "destructive"} className="text-[10px]">
                            {b.status}
                          </Badge>
                          {b.autoRenew && <Badge variant="outline" className="text-[10px]">Auto-renew</Badge>}
                        </div>
                        <p className="text-sm font-semibold text-foreground">{b.shopName}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.category && `${b.category} · `}{b.startDate} → {b.endDate} · {formatPrice(b.amountPaid)}
                          {b.promoCode && ` · Code: ${b.promoCode}`}
                        </p>
                        {b.topProduct && <p className="text-xs text-muted-foreground mt-0.5">{b.topProduct} — {formatPrice(b.topProductPrice || 0)}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => toggleBooking(b.id)} title={b.active ? "Deactivate" : "Activate"}>
                        {b.active ? <ToggleRight className="h-5 w-5 text-[hsl(var(--success))]" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                      </button>
                      <button onClick={() => deleteBooking(b.id)} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROMOS TAB */}
      {subTab === "promos" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { setEditingPromo("new"); setPromoForm({ code: "", city: "all", slotType: "all", discountPercent: 50, maxUses: 10, description: "" }); }}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Promo Code
            </Button>
          </div>

          {editingPromo && (
            <div className="rounded-card border-2 border-primary bg-card p-4 shadow-card space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Code *</label>
                  <Input value={promoForm.code} onChange={e => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })} placeholder="MADURAI50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <select value={promoForm.city} onChange={e => setPromoForm({ ...promoForm, city: e.target.value })} className={inputClass}>
                    <option value="all">All Cities</option>
                    {ALL_BANNER_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Slot Type</label>
                  <select value={promoForm.slotType} onChange={e => setPromoForm({ ...promoForm, slotType: e.target.value as any })} className={inputClass}>
                    <option value="all">All Types</option>
                    {Object.entries(BANNER_SLOT_CONFIGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Discount %</label>
                  <Input type="number" value={promoForm.discountPercent} onChange={e => setPromoForm({ ...promoForm, discountPercent: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Max Uses</label>
                  <Input type="number" value={promoForm.maxUses} onChange={e => setPromoForm({ ...promoForm, maxUses: parseInt(e.target.value) || 1 })} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Description *</label>
                <Input value={promoForm.description} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} placeholder="50% off any slot in Madurai" />
              </div>
              <div className="flex gap-2">
                <Button onClick={savePromo}>Save</Button>
                <Button variant="outline" onClick={() => setEditingPromo(null)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {promos.map(p => (
              <div key={p.id} className={`rounded-card border p-3 flex items-center justify-between ${p.active ? "border-border bg-card" : "border-border/50 opacity-60"}`}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono font-bold text-foreground text-sm">{p.code}</span>
                    <Badge variant="outline" className="text-[10px]">{p.discountPercent}% off</Badge>
                    <Badge variant="secondary" className="text-[10px]">{p.city === "all" ? "All Cities" : p.city}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{p.slotType === "all" ? "All Slots" : BANNER_SLOT_CONFIGS[p.slotType as BannerSlotType]?.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.description} · {p.usedCount}/{p.maxUses} used</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => persistPromos(promos.map(x => x.id === p.id ? { ...x, active: !x.active } : x))}>
                    {p.active ? <ToggleRight className="h-5 w-5 text-[hsl(var(--success))]" /> : <ToggleLeft className="h-5 w-5 text-muted-foreground" />}
                  </button>
                  <button
                    onClick={() => { setEditingPromo(p.id); setPromoForm({ code: p.code, city: p.city, slotType: p.slotType, discountPercent: p.discountPercent, maxUses: p.maxUses, description: p.description }); }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-accent"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => { persistPromos(promos.filter(x => x.id !== p.id)); toast.success("Deleted."); }} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVENUE TAB */}
      {subTab === "revenue" && (
        <div className="space-y-4">
          <div className="rounded-card border border-primary bg-primary/5 p-5 flex items-center gap-4">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Total Banner Revenue</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">{bookings.filter(b => b.status === "active").length} active bookings across {ALL_BANNER_CITIES.length} cities</p>
            </div>
          </div>

          <div className="space-y-2">
            {revenueByCity.filter(r => r.revenue > 0 || r.activeSlots > 0).map(r => (
              <div key={r.city} className="rounded-card border border-border bg-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.city}</p>
                    <p className="text-xs text-muted-foreground">{r.activeSlots} active slots</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-success">{formatPrice(r.revenue)}<span className="text-xs font-normal text-muted-foreground">/month</span></p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagementTab;
