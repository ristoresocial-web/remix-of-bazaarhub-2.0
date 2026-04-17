import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import AiDocVerifyDialog from "@/components/admin/AiDocVerifyDialog";

const categories = ["Electronics", "Mobiles", "Appliances", "Fashion", "Beauty", "Furniture"];

const pendingSellers = [
  { name: "Kumar Electronics", city: "Chennai", submitted: "2 days ago" },
  { name: "Anand Gadgets", city: "Madurai", submitted: "5 days ago" },
  { name: "Star Electronics", city: "Bangalore", submitted: "1 day ago" },
  { name: "Value Store", city: "Kochi", submitted: "3 days ago" },
  { name: "Mobile Hub", city: "Bhopal", submitted: "6 hours ago" },
  { name: "Pixel Store", city: "Mysuru", submitted: "4 days ago" },
  { name: "Click Shop", city: "Ranchi", submitted: "1 day ago" },
];

const pendingProducts = [
  { name: "OnePlus 12R", city: "Madurai", seller: "Anand Gadgets", submitted: "1 day ago" },
  { name: "Whirlpool 265L Refrigerator", city: "Bangalore", seller: "Star Electronics", submitted: "3 days ago" },
  { name: "Samsung Galaxy A55", city: "Kochi", seller: "Value Store", submitted: "2 days ago" },
];

const ApprovalsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<"sellers" | "products">("sellers");
  const [showSettings, setShowSettings] = useState(false);
  const [sellerAuto, setSellerAuto] = useState(true);
  const [productMaster, setProductMaster] = useState(true);
  const [productToggles, setProductToggles] = useState<Record<string, boolean>>(Object.fromEntries(categories.map((c) => [c, true])));
  const [cityOffers, setCityOffers] = useState(true);
  const [buyerReviews, setBuyerReviews] = useState(true);
  const [verifyTarget, setVerifyTarget] = useState<{ name: string } | null>(null);

  const toggleCat = (cat: string) => setProductToggles((p) => ({ ...p, [cat]: !p[cat] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Approvals</h2>
        <p className="text-sm text-muted-foreground">Review pending sellers and products</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSubTab("sellers")}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all duration-200 ${activeSubTab === "sellers" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Sellers ({pendingSellers.length})
        </button>
        <button
          onClick={() => setActiveSubTab("products")}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all duration-200 ${activeSubTab === "products" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          Products ({pendingProducts.length})
        </button>
      </div>

      {/* Approval Cards */}
      {activeSubTab === "sellers" && (
        <div className="space-y-3">
          {pendingSellers.map((s) => (
            <div key={s.name} className="rounded-card border border-border bg-card p-4 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">{s.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{s.city}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {s.submitted}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8 gap-1" onClick={() => setVerifyTarget({ name: s.name })}>
                  <ShieldCheck className="h-3.5 w-3.5" /> AI Verify
                </Button>
                <Button size="sm" className="text-xs h-8 gap-1" onClick={() => toast.success(`Welcome to BazaarHub, ${s.name}!`)}>
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="ghost" className="text-xs h-8 text-destructive gap-1" onClick={() => toast("Seller application declined")}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === "products" && (
        <div className="space-y-3">
          {pendingProducts.map((p) => (
            <div key={p.name} className="rounded-card border border-border bg-card p-4 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground notranslate">{p.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">by {p.seller}</span>
                  <span className="text-xs text-muted-foreground">{p.city}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {p.submitted}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs h-8">View Details</Button>
                <Button size="sm" className="text-xs h-8 gap-1" onClick={() => toast.success(`${p.name} approved!`)}>
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="ghost" className="text-xs h-8 text-destructive gap-1" onClick={() => toast("Product declined")}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collapsible Settings */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-all duration-200"
      >
        {showSettings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Approval Settings
      </button>

      {showSettings && (
        <div className="space-y-4">
          <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Seller Registration</h3>
                <p className="text-sm text-muted-foreground">{sellerAuto ? "Sellers join instantly! (Phase 2 auto-approval active)" : "Personal welcome review"}</p>
              </div>
              <Switch checked={sellerAuto} onCheckedChange={setSellerAuto} />
            </div>
          </div>

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

          <div className="rounded-card border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">City Offers</h3>
                <p className="text-xs text-muted-foreground">System auto-validates price {"<"} listed price</p>
              </div>
              <Switch checked={cityOffers} onCheckedChange={setCityOffers} />
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Buyer Reviews</h3>
                <p className="text-xs text-muted-foreground">{buyerReviews ? "ON with AI filter" : "Manual review"}</p>
              </div>
              <Switch checked={buyerReviews} onCheckedChange={setBuyerReviews} />
            </div>
          </div>

          <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Seller Trust Tiers</h3>
            <div className="space-y-2">
              {[
                { label: "New (0-30 days)", color: "border border-primary text-primary", desc: "Manual approval" },
                { label: "Established (31-90 days)", color: "bg-accent text-accent-foreground", desc: "Auto-approve products" },
                { label: "Trusted (90+ days, 4+ stars)", color: "bg-success-light text-success", desc: "Everything auto" },
                { label: "Under Review", color: "border border-warning text-warning", desc: "Reverts to manual" },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between rounded-input border border-border px-3 py-2">
                  <span className={`rounded-pill px-2 py-0.5 text-xs font-semibold ${t.color}`}>{t.label}</span>
                  <span className="text-xs text-muted-foreground">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card bg-primary-light border border-primary/30 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Phase 2 Active: Auto-approval enabled for established sellers (31-90 days)</p>
              <p className="text-xs text-muted-foreground mt-1">New sellers (0-30 days) still require manual review · Admin can override anytime</p>
            </div>
          </div>
        </div>
      )}

      {verifyTarget && (
        <AiDocVerifyDialog
          open={!!verifyTarget}
          onClose={() => setVerifyTarget(null)}
          expectedName={verifyTarget.name}
          defaultDocType="gst"
        />
      )}
    </div>
  );
};

export default ApprovalsTab;
