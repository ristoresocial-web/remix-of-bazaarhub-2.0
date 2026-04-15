import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, BarChart3, X } from "lucide-react";

interface PromoCode {
  code: string; discount: number; uses: number; limit: number; validFrom: string; validUntil: string; status: string;
  plans: string[]; dailyUses: number[];
}

const PLANS = ["Free", "Starter", "Growth", "Premium"];

const existingCodes: PromoCode[] = [
  { code: "LAUNCH25", discount: 25, uses: 142, limit: 500, validFrom: "2025-01-01", validUntil: "2025-03-31", status: "Active", plans: ["Starter", "Growth"], dailyUses: [12, 8, 15, 22, 18, 10, 14] },
  { code: "BAZAAR10", discount: 10, uses: 890, limit: 1000, validFrom: "2025-01-01", validUntil: "2025-06-30", status: "Active", plans: ["Free", "Starter", "Growth", "Premium"], dailyUses: [45, 38, 52, 41, 55, 48, 42] },
  { code: "GROWTH50", discount: 50, uses: 23, limit: 100, validFrom: "2025-02-01", validUntil: "2025-04-30", status: "Active", plans: ["Growth", "Premium"], dailyUses: [3, 5, 2, 4, 3, 6, 2] },
  { code: "DIWALI50", discount: 50, uses: 500, limit: 500, validFrom: "2024-10-15", validUntil: "2024-11-15", status: "Expired", plans: ["Starter"], dailyUses: [0, 0, 0, 0, 0, 0, 0] },
  { code: "PREMIUM20", discount: 20, uses: 67, limit: 200, validFrom: "2025-02-15", validUntil: "2025-05-31", status: "Active", plans: ["Premium"], dailyUses: [8, 12, 9, 11, 7, 10, 13] },
];

const PromoCodesTab: React.FC = () => {
  const [codes, setCodes] = useState(existingCodes);
  const [showCreate, setShowCreate] = useState(false);
  const [analyticsCode, setAnalyticsCode] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [limit, setLimit] = useState("");
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [error, setError] = useState("");

  const togglePlan = (plan: string) => {
    setSelectedPlans(prev => prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]);
    setError("");
  };

  const handleCreate = () => {
    if (!name || !discount || !to || !limit) { setError("All fields are required"); return; }
    if (selectedPlans.length === 0) { setError("Select at least one subscription plan"); return; }
    if (codes.some(c => c.code === name)) { setError("Code already exists"); return; }
    setCodes(prev => [...prev, { code: name, discount: Number(discount), uses: 0, limit: Number(limit), validFrom: from || new Date().toISOString().slice(0, 10), validUntil: to, status: "Active", plans: selectedPlans, dailyUses: [0, 0, 0, 0, 0, 0, 0] }]);
    setName(""); setDiscount(""); setFrom(""); setTo(""); setLimit(""); setSelectedPlans([]); setShowCreate(false);
  };

  const analyticsData = analyticsCode ? codes.find(c => c.code === analyticsCode) : null;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Promo Codes</h2>
        <Button onClick={() => setShowCreate(!showCreate)} className="gap-1 rounded-pill">
          <Plus className="h-4 w-4" /> New Code
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
          <h3 className="font-semibold text-foreground">Create New Code</h3>
          {error && (
            <div className="flex items-center gap-2 rounded-input bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input value={name} onChange={e => setName(e.target.value.toUpperCase())} placeholder="Code (e.g. LAUNCH25)" className="rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Discount %" type="number" className="rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <input value={from} onChange={e => setFrom(e.target.value)} type="date" className="rounded-input border border-border bg-background px-3 py-2 text-sm" />
            <input value={to} onChange={e => setTo(e.target.value)} type="date" className="rounded-input border border-border bg-background px-3 py-2 text-sm" />
            <input value={limit} onChange={e => setLimit(e.target.value)} placeholder="Usage limit" type="number" className="rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Link to Subscription Plans *</p>
            <div className="flex flex-wrap gap-2">
              {PLANS.map(plan => (
                <button key={plan} onClick={() => togglePlan(plan)} className={`rounded-pill px-3 py-1 text-xs font-semibold transition-all ${selectedPlans.includes(plan) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                  {plan}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}>Create Code</Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground">Code</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Discount</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Plans</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Usage</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Valid</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Status</th>
              <th className="p-3 text-center font-medium text-muted-foreground">Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {codes.map(c => (
              <tr key={c.code} className="hover:bg-accent/30 transition-all">
                <td className="p-3 font-mono font-semibold text-foreground">{c.code}</td>
                <td className="p-3 text-center text-foreground">{c.discount}%</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {c.plans.map(p => <span key={p} className="rounded-pill bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">{p}</span>)}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (c.uses / c.limit) * 100)}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{c.uses}/{c.limit}</span>
                  </div>
                </td>
                <td className="p-3 text-center text-xs text-muted-foreground">{c.validFrom} → {c.validUntil}</td>
                <td className="p-3 text-center"><span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${c.status === "Active" ? "bg-success-light text-success" : "bg-muted text-muted-foreground"}`}>{c.status}</span></td>
                <td className="p-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setAnalyticsCode(c.code)} className="h-7 w-7 p-0"><BarChart3 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics Modal */}
      {analyticsData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={() => setAnalyticsCode(null)}>
          <div className="mx-4 w-full max-w-md rounded-card border border-border bg-card p-6 shadow-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Analytics: {analyticsData.code}</h3>
              <button onClick={() => setAnalyticsCode(null)} className="rounded-full p-1 hover:bg-muted"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-muted/30 p-3 text-center"><p className="text-xs text-muted-foreground">Total Uses</p><p className="text-xl font-bold text-foreground">{analyticsData.uses}</p></div>
              <div className="rounded-lg bg-muted/30 p-3 text-center"><p className="text-xs text-muted-foreground">Remaining</p><p className="text-xl font-bold text-foreground">{analyticsData.limit - analyticsData.uses}</p></div>
              <div className="rounded-lg bg-muted/30 p-3 text-center"><p className="text-xs text-muted-foreground">Conversion</p><p className="text-xl font-bold text-primary">{((analyticsData.uses / analyticsData.limit) * 100).toFixed(0)}%</p></div>
            </div>
            <p className="mb-2 text-sm font-semibold text-foreground">Last 7 Days Usage</p>
            <div className="flex items-end gap-1 h-24">
              {analyticsData.dailyUses.map((u, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t bg-primary transition-all" style={{ height: `${Math.max(4, (u / Math.max(...analyticsData.dailyUses)) * 80)}px` }} />
                  <span className="text-[9px] text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Linked plans: {analyticsData.plans.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesTab;
