import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import { formatPrice } from "@/lib/cityUtils";

interface Plan {
  id: string; name: string; monthlyPrice: number; annualPrice: number; maxProducts: number; features: string[];
}

const initialPlans: Plan[] = [
  { id: "free", name: "Free", monthlyPrice: 0, annualPrice: 0, maxProducts: 5, features: ["Basic listing", "City visibility", "Email support"] },
  { id: "starter", name: "Starter", monthlyPrice: 499, annualPrice: 4990, maxProducts: 25, features: ["Priority listing", "WhatsApp button", "Price alerts", "Basic analytics", "Email + chat support"] },
  { id: "growth", name: "Growth", monthlyPrice: 1499, annualPrice: 14990, maxProducts: 100, features: ["Featured badge", "AI price intelligence", "Multi-city listing", "Advanced analytics", "Promo code access", "Priority support"] },
  { id: "premium", name: "Premium", monthlyPrice: 3999, annualPrice: 39990, maxProducts: -1, features: ["Unlimited products", "Top placement", "Custom storefront", "API access", "Dedicated account manager", "All Growth features", "White-label options"] },
];

const SubscriptionPlansTab: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [editing, setEditing] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<Omit<Plan, "id">>({ name: "", monthlyPrice: 0, annualPrice: 0, maxProducts: 10, features: [] });
  const [featureInput, setFeatureInput] = useState("");

  const startEdit = (plan: Plan) => {
    setEditing(plan.id);
    setForm({ name: plan.name, monthlyPrice: plan.monthlyPrice, annualPrice: plan.annualPrice, maxProducts: plan.maxProducts, features: [...plan.features] });
    setShowCreate(false);
  };

  const saveEdit = () => {
    if (!editing) return;
    setPlans(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p));
    setEditing(null);
  };

  const handleCreate = () => {
    const id = form.name.toLowerCase().replace(/\s+/g, "-");
    setPlans(prev => [...prev, { id, ...form }]);
    setForm({ name: "", monthlyPrice: 0, annualPrice: 0, maxProducts: 10, features: [] });
    setShowCreate(false);
  };

  const deletePlan = (id: string) => setPlans(prev => prev.filter(p => p.id !== id));

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));

  const renderForm = (onSave: () => void, onCancel: () => void) => (
    <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
      <h3 className="font-semibold text-foreground">{editing ? "Edit Plan" : "Create New Plan"}</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Plan Name</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Business" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Max Products (-1 = unlimited)</label>
          <input value={form.maxProducts} onChange={e => setForm(f => ({ ...f, maxProducts: Number(e.target.value) }))} type="number" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Monthly Price (₹)</label>
          <input value={form.monthlyPrice} onChange={e => setForm(f => ({ ...f, monthlyPrice: Number(e.target.value) }))} type="number" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Annual Price (₹)</label>
          <input value={form.annualPrice} onChange={e => setForm(f => ({ ...f, annualPrice: Number(e.target.value) }))} type="number" className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">Features</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.features.map((f, i) => (
            <span key={i} className="flex items-center gap-1 rounded-pill bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
              {f} <button onClick={() => removeFeature(i)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Add feature..." className="flex-1 rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <Button variant="outline" size="sm" onClick={addFeature}>Add</Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} className="gap-1"><Check className="h-4 w-4" /> Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Subscription Plans</h2>
        <Button onClick={() => { setShowCreate(true); setEditing(null); setForm({ name: "", monthlyPrice: 0, annualPrice: 0, maxProducts: 10, features: [] }); }} className="gap-1 rounded-pill">
          <Plus className="h-4 w-4" /> New Plan
        </Button>
      </div>

      {showCreate && renderForm(handleCreate, () => setShowCreate(false))}
      {editing && renderForm(saveEdit, () => setEditing(null))}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map(plan => (
          <div key={plan.id} className={`rounded-card border bg-card p-5 shadow-card transition-all hover:shadow-card-hover ${plan.id === "growth" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
            {plan.id === "growth" && <span className="mb-2 inline-block rounded-pill bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">POPULAR</span>}
            <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
            <div className="my-3">
              <span className="notranslate text-2xl font-bold text-foreground">{plan.monthlyPrice === 0 ? "Free" : formatPrice(plan.monthlyPrice)}</span>
              {plan.monthlyPrice > 0 && <span className="text-sm text-muted-foreground">/mo</span>}
            </div>
            {plan.annualPrice > 0 && <p className="mb-3 text-xs text-muted-foreground notranslate">{formatPrice(plan.annualPrice)}/year (save {Math.round((1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100)}%)</p>}
            <p className="mb-3 text-sm text-foreground">{plan.maxProducts === -1 ? "Unlimited" : plan.maxProducts} products</p>
            <ul className="mb-4 space-y-1.5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => startEdit(plan)} className="flex-1 gap-1 text-xs"><Edit2 className="h-3 w-3" /> Edit</Button>
              {plan.id !== "free" && <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)} className="text-destructive text-xs"><Trash2 className="h-3 w-3" /></Button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlansTab;
