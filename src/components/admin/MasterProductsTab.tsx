import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Database, Plus, Search, Edit2, Trash2, X, Check, Upload, Download,
  AlertTriangle, Archive, GitMerge, Eye, ChevronDown, ChevronUp, Package,
} from "lucide-react";
import {
  getMasterProducts, saveMasterProducts, CATEGORY_SPEC_FIELDS, getEmptySpecs,
  type MasterProduct, type ProductCategory,
} from "@/data/masterProductsData";
import { formatPrice } from "@/lib/cityUtils";

const CATEGORIES: ProductCategory[] = ["Mobiles", "TVs", "Laptops", "Audio", "Appliances"];

const statusBadge = (s: MasterProduct["status"]) => {
  const cls = s === "active" ? "bg-success/10 text-success" : s === "discontinued" ? "bg-muted text-muted-foreground" : "bg-warning/10 text-warning";
  return <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>{s.replace("_", " ")}</span>;
};

const MasterProductsTab: React.FC = () => {
  const [products, setProducts] = useState<MasterProduct[]>(getMasterProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Add/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    brand: "", model_name: "", category: "Mobiles" as ProductCategory, subcategory: "", mrp: 0,
    image_url: "", specs: {} as Record<string, string | number | boolean>,
  });

  // Merge state
  const [mergeMode, setMergeMode] = useState(false);
  const [mergeSelected, setMergeSelected] = useState<number[]>([]);

  // CSV import
  const [showCsvImport, setShowCsvImport] = useState(false);
  const [csvText, setCsvText] = useState("");

  const save = (list: MasterProduct[]) => { setProducts(list); saveMasterProducts(list); };

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !`${p.brand} ${p.model_name}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "All" && p.category !== catFilter) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, search, catFilter, statusFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm({ brand: "", model_name: "", category: "Mobiles", subcategory: "", mrp: 0, image_url: "", specs: getEmptySpecs("Mobiles") });
    setShowForm(true);
  };

  const openEdit = (p: MasterProduct) => {
    setEditId(p.id);
    setForm({ brand: p.brand, model_name: p.model_name, category: p.category, subcategory: p.subcategory, mrp: p.mrp, image_url: p.image_url, specs: { ...p.specs } as Record<string, string | number | boolean> });
    setShowForm(true);
  };

  const handleCategoryChange = (cat: ProductCategory) => {
    setForm(prev => ({ ...prev, category: cat, specs: getEmptySpecs(cat) }));
  };

  const saveForm = () => {
    if (!form.brand.trim() || !form.model_name.trim()) return;
    let next: MasterProduct[];
    if (editId !== null) {
      next = products.map(p => p.id === editId ? { ...p, ...form, specs: form.specs } : p);
    } else {
      next = [...products, {
        id: Date.now(), ...form, specs: form.specs,
        status: "active" as const, addedAt: new Date().toISOString().split("T")[0], addedBy: "Admin",
      }];
    }
    save(next);
    setShowForm(false);
    setEditId(null);
  };

  const deleteProduct = (id: number) => save(products.filter(p => p.id !== id));

  const toggleDiscontinued = (id: number) => {
    save(products.map(p => p.id === id ? { ...p, status: p.status === "discontinued" ? "active" as const : "discontinued" as const } : p));
  };

  const approvePending = (id: number) => {
    save(products.map(p => p.id === id ? { ...p, status: "active" as const } : p));
  };

  // Merge: keep first selected, remove others
  const handleMerge = () => {
    if (mergeSelected.length < 2) return;
    const keepId = mergeSelected[0];
    const removeIds = mergeSelected.slice(1);
    save(products.filter(p => !removeIds.includes(p.id)));
    setMergeSelected([]);
    setMergeMode(false);
  };

  // CSV import
  const handleCsvImport = () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split("\n");
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const imported: MasterProduct[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      const brandIdx = header.indexOf("brand");
      const modelIdx = header.indexOf("model");
      const catIdx = header.indexOf("category");
      if (brandIdx < 0 || modelIdx < 0 || catIdx < 0) continue;
      const cat = cols[catIdx] as ProductCategory;
      const specs: Record<string, string | number | boolean> = {};
      const specFields = CATEGORY_SPEC_FIELDS[cat] || [];
      for (const sf of specFields) {
        const idx = header.indexOf(sf.key.toLowerCase());
        if (idx >= 0 && cols[idx]) {
          specs[sf.key] = sf.type === "boolean" ? cols[idx].toLowerCase() === "true" : sf.type === "number" ? Number(cols[idx]) : cols[idx];
        }
      }
      imported.push({
        id: Date.now() + i,
        brand: cols[brandIdx],
        model_name: cols[modelIdx],
        category: cat,
        subcategory: cols[header.indexOf("subcategory")] || "",
        mrp: Number(cols[header.indexOf("mrp")] || 0),
        image_url: "",
        specs,
        status: "active",
        addedAt: new Date().toISOString().split("T")[0],
        addedBy: "CSV Import",
      });
    }
    if (imported.length > 0) {
      save([...products, ...imported]);
      setCsvText("");
      setShowCsvImport(false);
    }
  };

  const specFields = CATEGORY_SPEC_FIELDS[form.category] || [];
  const pendingCount = products.filter(p => p.status === "pending_verification").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> Master Products</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowCsvImport(true)} className="gap-1 text-xs"><Upload className="h-3.5 w-3.5" /> CSV Import</Button>
          <Button size="sm" variant="outline" onClick={() => { setMergeMode(!mergeMode); setMergeSelected([]); }} className={`gap-1 text-xs ${mergeMode ? "border-primary text-primary" : ""}`}><GitMerge className="h-3.5 w-3.5" /> Merge</Button>
          <Button size="sm" onClick={openAdd} className="gap-1 text-xs"><Plus className="h-3.5 w-3.5" /> Add Product</Button>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-card bg-primary/5 border border-primary/20 p-4 flex items-start gap-3">
        <Package className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Master Specification Database — {products.length} products</p>
          <p className="text-xs text-muted-foreground">Sellers auto-fill product specs from this database. {pendingCount > 0 && <span className="text-warning font-semibold">{pendingCount} pending verification.</span>}</p>
        </div>
      </div>

      {/* CSV Import */}
      {showCsvImport && (
        <div className="rounded-card border border-border bg-card p-4 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Bulk CSV Import</h3>
            <button onClick={() => setShowCsvImport(false)} className="p-1 hover:bg-muted rounded-full"><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <p className="text-xs text-muted-foreground">CSV columns: brand, model, category, subcategory, mrp, then spec fields (ram, storage, processor, etc.)</p>
          <textarea value={csvText} onChange={e => setCsvText(e.target.value)} placeholder={`brand,model,category,subcategory,mrp,ram,storage,processor\nSamsung,Galaxy A55,Mobiles,Mid-Range,39999,8GB,128GB,Exynos 1480`} className="w-full rounded-input border border-border bg-background px-3 py-2 text-xs font-mono min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <Button size="sm" onClick={handleCsvImport} disabled={!csvText.trim()} className="gap-1 text-xs"><Upload className="h-3.5 w-3.5" /> Import</Button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{editId ? "Edit" : "Add"} Master Product</h3>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded-full"><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand *</label>
              <input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Model Name *</label>
              <input value={form.model_name} onChange={e => setForm(p => ({ ...p, model_name: e.target.value }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
              <select value={form.category} onChange={e => handleCategoryChange(e.target.value as ProductCategory)} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Subcategory</label>
              <input value={form.subcategory} onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">MRP (₹)</label>
              <input type="number" value={form.mrp} onChange={e => setForm(p => ({ ...p, mrp: Number(e.target.value) }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Image URL</label>
              <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          {/* Spec fields */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">{form.category} Specifications</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {specFields.map(sf => (
                <div key={sf.key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">{sf.label}</label>
                  {sf.type === "boolean" ? (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!form.specs[sf.key]}
                        onCheckedChange={v => setForm(p => ({ ...p, specs: { ...p.specs, [sf.key]: v } }))}
                      />
                      <span className="text-xs text-muted-foreground">{form.specs[sf.key] ? "Yes" : "No"}</span>
                    </div>
                  ) : sf.type === "number" ? (
                    <input type="number" value={String(form.specs[sf.key] || 0)} onChange={e => setForm(p => ({ ...p, specs: { ...p.specs, [sf.key]: Number(e.target.value) } }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  ) : (
                    <input value={String(form.specs[sf.key] || "")} onChange={e => setForm(p => ({ ...p, specs: { ...p.specs, [sf.key]: e.target.value } }))} className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button size="sm" onClick={saveForm} disabled={!form.brand.trim() || !form.model_name.trim()} className="gap-1"><Check className="h-4 w-4" /> {editId ? "Update" : "Add"} Product</Button>
        </div>
      )}

      {/* Merge bar */}
      {mergeMode && (
        <div className="rounded-card bg-warning/10 border border-warning/20 p-3 flex items-center justify-between">
          <p className="text-sm text-foreground"><span className="font-semibold">Merge Mode:</span> Select 2+ products to merge. First selected is kept.</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleMerge} disabled={mergeSelected.length < 2} className="gap-1 text-xs"><GitMerge className="h-3.5 w-3.5" /> Merge ({mergeSelected.length})</Button>
            <Button size="sm" variant="ghost" onClick={() => { setMergeMode(false); setMergeSelected([]); }} className="text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand or model..." className="w-full rounded-input border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-input border border-border bg-background px-3 py-2 text-sm">
          <option>All</option>
          <option>active</option>
          <option>discontinued</option>
          <option>pending_verification</option>
        </select>
      </div>

      {/* Product List */}
      <div className="space-y-2">
        {filtered.map(p => {
          const isExpanded = expandedId === p.id;
          const catSpecs = CATEGORY_SPEC_FIELDS[p.category] || [];
          return (
            <div key={p.id} className={`rounded-card border bg-card shadow-card transition-all ${mergeMode && mergeSelected.includes(p.id) ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                {mergeMode && (
                  <input type="checkbox" checked={mergeSelected.includes(p.id)} onChange={() => setMergeSelected(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} className="shrink-0" />
                )}
                {p.image_url && <img src={p.image_url} alt={p.model_name} className="h-10 w-10 rounded-input object-contain bg-background shrink-0" loading="lazy" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{p.brand} {p.model_name}</p>
                    {statusBadge(p.status)}
                    {p.status === "discontinued" && <span className="text-[10px] text-muted-foreground italic">Discontinued</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.category} · {p.subcategory} · MRP: {formatPrice(p.mrp)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {p.status === "pending_verification" && (
                    <Button size="sm" variant="outline" onClick={() => approvePending(p.id)} className="text-xs text-success border-success/30 hover:bg-success/10 gap-1"><Check className="h-3 w-3" /> Approve</Button>
                  )}
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => toggleDiscontinued(p.id)} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={p.status === "discontinued" ? "Reactivate" : "Discontinue"}><Archive className="h-3.5 w-3.5" /></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-full hover:bg-destructive/10 text-destructive/60 hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setExpandedId(isExpanded ? null : p.id)} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground">
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="border-t border-border px-4 py-3 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">{p.category} Specifications</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {catSpecs.map(sf => {
                      const val = (p.specs as Record<string, unknown>)[sf.key];
                      return (
                        <div key={sf.key} className="text-xs">
                          <span className="text-muted-foreground">{sf.label}:</span>{" "}
                          <span className="font-medium text-foreground">{sf.type === "boolean" ? (val ? "Yes" : "No") : String(val || "—")}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Added: {p.addedAt} by {p.addedBy}</p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No products found</p>}
      </div>
    </div>
  );
};

export default MasterProductsTab;
