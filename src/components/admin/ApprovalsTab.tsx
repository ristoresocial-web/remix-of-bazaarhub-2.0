import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, AlertCircle } from "lucide-react";

const categories = ["Electronics", "Mobiles", "Appliances", "Fashion", "Beauty", "Furniture"];

const ApprovalsTab: React.FC = () => {
  const [sellerAuto, setSellerAuto] = useState(true);
  const [productMaster, setProductMaster] = useState(true);
  const [productToggles, setProductToggles] = useState<Record<string, boolean>>(Object.fromEntries(categories.map((c) => [c, true])));
  const [cityOffers, setCityOffers] = useState(true);
  const [buyerReviews, setBuyerReviews] = useState(true);

  const toggleCat = (cat: string) => setProductToggles((p) => ({ ...p, [cat]: !p[cat] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Approval Settings</h2>
        <p className="text-sm text-muted-foreground">அனுமதி அமைப்புகள்</p>
      </div>

      {/* Seller Registration */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Seller Registration</h3>
            <p className="text-sm text-muted-foreground">{sellerAuto ? "Sellers join instantly! (Phase 2 auto-approval active)" : "Personal welcome review"}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-pill bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary">7 pending</span>
            <Switch checked={sellerAuto} onCheckedChange={setSellerAuto} />
          </div>
        </div>
      </div>

      {/* Product Listings */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Product Listings</h3>
            <p className="text-xs text-muted-foreground">New sellers (0-30 days): manual · Established (31-90): auto</p>
          </div>
          <Switch checked={productMaster} onCheckedChange={(v) => { setProductMaster(v); if (!v) setProductToggles(Object.fromEntries(categories.map((c) => [c, false]))); else setProductToggles(Object.fromEntries(categories.map((c) => [c, true]))); }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
              <span className="text-sm text-foreground">{cat}</span>
              <Switch checked={productToggles[cat]} onCheckedChange={() => toggleCat(cat)} />
            </div>
          ))}
        </div>
      </div>

      {/* City Offers */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">City Offers</h3>
            <p className="text-xs text-muted-foreground">System auto-validates price {"<"} listed price</p>
          </div>
          <Switch checked={cityOffers} onCheckedChange={setCityOffers} />
        </div>
      </div>

      {/* Buyer Reviews */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Buyer Reviews</h3>
            <p className="text-xs text-muted-foreground">{buyerReviews ? "ON with AI filter" : "Manual review"}</p>
          </div>
          <Switch checked={buyerReviews} onCheckedChange={setBuyerReviews} />
        </div>
      </div>

      {/* Trust Tiers */}
      <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Seller Trust Tiers</h3>
        <div className="space-y-2">
          {[
            { label: "New (0-30 days)", color: "bg-primary-light text-primary", desc: "Manual approval" },
            { label: "Established (31-90 days)", color: "bg-blue-100 text-blue-700", desc: "Auto-approve products" },
            { label: "Trusted (90+ days, 4+ stars)", color: "bg-success-light text-success", desc: "Everything auto" },
            { label: "Under Review", color: "bg-primary-light text-primary", desc: "Reverts to manual" },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
              <span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${t.color}`}>{t.label}</span>
              <span className="text-xs text-muted-foreground">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Recommendation */}
      <div className="rounded-card bg-primary-light border border-primary/30 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Phase 2 Active: Auto-approval enabled for established sellers (31-90 days)</p>
          <p className="text-xs text-muted-foreground mt-1">New sellers (0-30 days) still require manual review · Admin can override anytime</p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalsTab;
