import React, { useState, useMemo } from "react";
import { ArrowLeft, Search, Plus, Database, Check, ChevronDown, Package, Zap, Tv, Headphones, Laptop, WashingMachine, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/cityUtils";
import {
  searchMasterProducts,
  CATEGORY_SPEC_FIELDS,
  getEmptySpecs,
  getMasterProducts,
  saveMasterProducts,
  type MasterProduct,
} from "@/data/masterProductsData";
import { scanProductForBannedContent, logBlockedListing } from "@/data/bannedProductsData";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Mobiles: Zap,
  TVs: Tv,
  Laptops: Laptop,
  Audio: Headphones,
  Appliances: WashingMachine,
};

const CATEGORIES = ["Mobiles", "TVs", "Laptops", "Audio", "Appliances"];

interface Props {
  onClose: () => void;
  onProductAdded: (product: {
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    delivery: string;
    image: string;
    amazonPrice: number;
    isManual: boolean;
  }) => void;
}

const AddProductGrid: React.FC<Props> = ({ onClose, onProductAdded }) => {
  const [step, setStep] = useState<"category" | "browse" | "details" | "review">("category");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaster, setSelectedMaster] = useState<MasterProduct | null>(null);
  const [isManual, setIsManual] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<null | {
    title: string;
    description: string;
    tamil_description: string;
    keywords_en: string[];
    keywords_ta: string[];
    suggested_price: number;
    price_range_low: number;
    price_range_high: number;
    reason: string;
  }>(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: 0,
    stock: 0,
    condition: "New" as "New" | "Open Box" | "Refurbished",
    delivery: "Same Day",
    specs: {} as Record<string, string | number | boolean>,
  });

  const runAiAutofill = async () => {
    if (!form.name.trim()) {
      toast.error("Enter a product name first");
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-seller-assistant", {
        body: { product_name: form.name, category },
      });
      if (error) throw error;
      if ((data as any)?.error) {
        toast.error((data as any).error);
        return;
      }
      const r = data as any;
      setAiResult({
        title: r.title,
        description: r.description,
        tamil_description: r.tamil_description,
        keywords_en: r.keywords_en || [],
        keywords_ta: r.keywords_ta || [],
        suggested_price: r.suggested_price,
        price_range_low: r.price_range_low,
        price_range_high: r.price_range_high,
        reason: r.reason,
      });
      setForm((p) => ({
        ...p,
        name: r.title || p.name,
        brand: r.brand || p.brand,
        price: p.price || r.suggested_price || 0,
        condition: (r.condition as any) || p.condition,
      }));
      toast.success("✨ AI auto-filled! Review and adjust as needed.");
    } catch (e: any) {
      toast.error(e?.message || "AI is taking a quick break — try again");
    } finally {
      setAiLoading(false);
    }
  };

  // Get products for selected category
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    const all = getMasterProducts().filter(
      (p) => p.category === category && p.status !== "discontinued"
    );
    if (!searchQuery || searchQuery.length < 2) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(
      (p) =>
        p.model_name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        `${p.brand} ${p.model_name}`.toLowerCase().includes(q)
    );
  }, [category, searchQuery]);

  const selectCategory = (cat: string) => {
    setCategory(cat);
    setSearchQuery("");
    setStep("browse");
  };

  const selectProduct = (mp: MasterProduct) => {
    setSelectedMaster(mp);
    setIsManual(false);
    setForm((prev) => ({
      ...prev,
      name: `${mp.brand} ${mp.model_name}`,
      brand: mp.brand,
      specs: { ...(mp.specs as Record<string, string | number | boolean>) },
    }));
    setStep("details");
  };

  const startManual = () => {
    setSelectedMaster(null);
    setIsManual(true);
    setForm((prev) => ({
      ...prev,
      name: searchQuery,
      brand: "",
      specs: getEmptySpecs(category),
    }));
    setStep("details");
  };

  const submit = () => {
    const specText = Object.values(form.specs).join(" ");
    const scanResult = scanProductForBannedContent(form.name, specText, category);
    if (scanResult.blocked) {
      logBlockedListing("S001", "My Shop", form.name, specText, scanResult.matchedKeywords);
      alert(`Product blocked: ${scanResult.matchedKeywords.join(", ")}`);
      return;
    }

    if (isManual && form.name.trim()) {
      const masterProducts = getMasterProducts();
      masterProducts.push({
        id: Date.now() + 1000,
        brand: form.brand,
        model_name: form.name.replace(form.brand, "").trim() || form.name,
        category: category as any,
        subcategory: "",
        specs: form.specs,
        mrp: form.price,
        image_url: "",
        status: "pending_verification",
        addedAt: new Date().toISOString().split("T")[0],
        addedBy: "Seller Submission",
      });
      saveMasterProducts(masterProducts);
    }

    onProductAdded({
      name: form.name,
      brand: form.brand || "Unknown",
      category,
      price: form.price,
      stock: form.stock,
      delivery: form.delivery,
      image: selectedMaster?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
      amazonPrice: selectedMaster?.mrp || 0,
      isManual,
    });
  };

  const specFields = CATEGORY_SPEC_FIELDS[category] || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (step === "category") onClose();
            else if (step === "browse") setStep("category");
            else if (step === "details") setStep("browse");
            else if (step === "review") setStep("details");
          }}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Add Product
            {category && <span className="text-sm font-normal text-muted-foreground">— {category}</span>}
          </h2>
        </div>
        {/* Step indicator */}
        <div className="hidden sm:flex items-center gap-1.5">
          {["Category", "Browse", "Details", "Review"].map((s, i) => {
            const steps = ["category", "browse", "details", "review"];
            const current = steps.indexOf(step);
            return (
              <div key={s} className="flex items-center gap-1.5">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    i <= current
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-xs ${i <= current ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s}
                </span>
                {i < 3 && <span className="text-muted-foreground mx-1">›</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Category Grid */}
      {step === "category" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Package;
            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className="group flex flex-col items-center gap-3 rounded-card border border-border bg-card p-6 shadow-card transition-all duration-200 hover:border-primary hover:shadow-hover hover:scale-[1.02]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold text-foreground">{cat}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Browse Products Grid */}
      {step === "browse" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${category} by brand or model...`}
              autoFocus
              className="w-full rounded-input border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categoryProducts.map((mp) => (
              <button
                key={mp.id}
                onClick={() => selectProduct(mp)}
                className="group text-left rounded-card border border-border bg-card shadow-card overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-hover hover:scale-[1.02]"
              >
                <div className="relative bg-muted/30 p-3 flex items-center justify-center h-32">
                  {mp.image_url ? (
                    <img
                      src={mp.image_url}
                      alt={mp.model_name}
                      className="h-full max-h-24 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Package className="h-10 w-10 text-muted-foreground" />
                  )}
                  {mp.status === "active" && (
                    <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-success">
                      <Database className="h-3 w-3 text-success-foreground" />
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
                    {mp.brand} {mp.model_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{mp.subcategory}</p>
                  <p className="text-sm font-bold text-foreground">{formatPrice(mp.mrp)}</p>
                  <p className="text-[10px] text-success font-medium">✅ Specs verified</p>
                </div>
              </button>
            ))}

            {/* Add Manually Card */}
            <button
              onClick={startManual}
              className="flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-primary hover:border-primary hover:bg-primary/10 transition-all duration-200 min-h-[200px]"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-semibold text-center">Product Not Listed?<br />Add Manually</span>
              <span className="text-[10px] text-muted-foreground text-center">Will be pending verification</span>
            </button>
          </div>

          {categoryProducts.length === 0 && searchQuery.length >= 2 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No products found for "{searchQuery}"</p>
              <Button size="sm" variant="outline" onClick={startManual} className="mt-3 gap-1">
                <Plus className="h-3.5 w-3.5" /> Add Manually
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Fill Details */}
      {step === "details" && (
        <div className="max-w-xl space-y-4">
          {selectedMaster && (
            <div className="rounded-card bg-success/5 border border-success/20 p-4 flex items-center gap-4">
              {selectedMaster.image_url && (
                <img src={selectedMaster.image_url} alt="" className="h-16 w-16 rounded-input object-contain bg-background shrink-0" />
              )}
              <div>
                <p className="text-xs font-semibold text-success flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" /> Specs auto-filled from Master DB
                </p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {selectedMaster.brand} {selectedMaster.model_name}
                </p>
                <p className="text-xs text-muted-foreground">MRP: {formatPrice(selectedMaster.mrp)}</p>
              </div>
            </div>
          )}
          {isManual && (
            <div className="rounded-card bg-warning/5 border border-warning/20 p-3">
              <p className="text-xs font-semibold text-warning">⚠️ Manual entry — will be pending spec verification</p>
            </div>
          )}

          {/* AI Auto-fill banner */}
          <div className="rounded-card border border-primary/30 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold text-foreground">AI Auto-fill — title, description, price & keywords</p>
              </div>
              <Button size="sm" onClick={runAiAutofill} disabled={aiLoading || !form.name.trim()} className="gap-1 h-8">
                {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {aiLoading ? "Generating..." : "Auto-fill with AI"}
              </Button>
            </div>
            {aiResult && (
              <div className="space-y-2 pt-2 border-t border-primary/20 text-xs">
                <p className="text-foreground"><span className="font-semibold">English:</span> {aiResult.description}</p>
                <p className="text-foreground"><span className="font-semibold">தமிழ்:</span> {aiResult.tamil_description}</p>
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">Price range:</span>{" "}
                  <span className="notranslate">{formatPrice(aiResult.price_range_low)} – {formatPrice(aiResult.price_range_high)}</span>
                  {" · "}{aiResult.reason}
                </p>
                <div className="flex flex-wrap gap-1">
                  {aiResult.keywords_en.map((k) => (
                    <span key={`en-${k}`} className="rounded-pill bg-background border border-border px-2 py-0.5 text-[10px]">{k}</span>
                  ))}
                  {aiResult.keywords_ta.map((k) => (
                    <span key={`ta-${k}`} className="rounded-pill bg-background border border-border px-2 py-0.5 text-[10px] notranslate">{k}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {isManual && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Product Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand *</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                    className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Selling Price (₹) *</label>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Stock Quantity *</label>
              <input
                type="number"
                value={form.stock || ""}
                onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Condition</label>
              <select
                value={form.condition}
                onChange={(e) => setForm((p) => ({ ...p, condition: e.target.value as any }))}
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
              >
                <option>New</option>
                <option>Open Box</option>
                <option>Refurbished</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Delivery</label>
              <select
                value={form.delivery}
                onChange={(e) => setForm((p) => ({ ...p, delivery: e.target.value }))}
                className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm"
              >
                <option>2 Hours</option>
                <option>Same Day</option>
                <option>Next Day</option>
                <option>Self Pickup</option>
              </select>
            </div>
          </div>

          {/* Manual spec fields */}
          {isManual && specFields.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">{category} Specifications</p>
              <div className="grid grid-cols-2 gap-2">
                {specFields.map((sf) => (
                  <div key={sf.key}>
                    <label className="text-[10px] font-medium text-muted-foreground mb-0.5 block">{sf.label}</label>
                    {sf.type === "boolean" ? (
                      <select
                        value={form.specs[sf.key] ? "true" : "false"}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, specs: { ...p.specs, [sf.key]: e.target.value === "true" } }))
                        }
                        className="w-full rounded-input border border-border bg-background px-2 py-1.5 text-xs"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    ) : (
                      <input
                        value={String(form.specs[sf.key] || "")}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            specs: { ...p.specs, [sf.key]: sf.type === "number" ? Number(e.target.value) : e.target.value },
                          }))
                        }
                        className="w-full rounded-input border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-filled specs (read-only) */}
          {selectedMaster && (
            <div>
              <button
                onClick={() => setExpandedSpecs(!expandedSpecs)}
                className="text-xs font-semibold text-primary flex items-center gap-1"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${expandedSpecs ? "rotate-180" : ""}`} />
                {expandedSpecs ? "Hide" : "View"} auto-filled specs
              </button>
              {expandedSpecs && (
                <div className="grid grid-cols-2 gap-1.5 mt-2 bg-muted/30 rounded-input p-3">
                  {specFields.map((sf) => {
                    const val = form.specs[sf.key];
                    return (
                      <p key={sf.key} className="text-xs">
                        <span className="text-muted-foreground">{sf.label}:</span>{" "}
                        <span className="font-medium text-foreground">
                          {sf.type === "boolean" ? (val ? "Yes" : "No") : String(val || "—")}
                        </span>
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={() => setStep("review")} disabled={!form.price || !form.stock} className="gap-1">
              Review & Submit →
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === "review" && (
        <div className="max-w-md space-y-4">
          <div className="rounded-card bg-muted/30 border border-border p-5 space-y-2.5">
            <p className="text-sm font-bold text-foreground">Review Your Listing</p>
            <div className="space-y-1.5">
              <p className="text-sm"><span className="text-muted-foreground">Product:</span> <span className="font-semibold text-foreground">{form.name}</span></p>
              <p className="text-sm"><span className="text-muted-foreground">Category:</span> {category}</p>
              <p className="text-sm"><span className="text-muted-foreground">Brand:</span> {form.brand}</p>
              <p className="text-sm"><span className="text-muted-foreground">Your Price:</span> <span className="font-bold text-success">{formatPrice(form.price)}</span></p>
              {selectedMaster && (
                <p className="text-sm"><span className="text-muted-foreground">MRP:</span> {formatPrice(selectedMaster.mrp)}</p>
              )}
              <p className="text-sm"><span className="text-muted-foreground">Stock:</span> {form.stock} units</p>
              <p className="text-sm"><span className="text-muted-foreground">Condition:</span> {form.condition}</p>
              <p className="text-sm"><span className="text-muted-foreground">Delivery:</span> {form.delivery}</p>
            </div>
            {isManual && <p className="text-xs text-warning font-semibold">⚠️ Pending spec verification by admin</p>}
            {selectedMaster && <p className="text-xs text-success font-semibold">✅ Specs verified from Master DB</p>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setStep("details")}>← Edit</Button>
            <Button size="sm" onClick={submit} className="gap-1">
              <Check className="h-3.5 w-3.5" /> Submit Listing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductGrid;
