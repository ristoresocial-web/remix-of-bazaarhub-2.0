import React, { useState, useCallback, useRef } from "react";
import { Search, Undo2, Redo2, Plus, Download, RefreshCw, Trash2, Eye, CheckCircle, X, ShieldAlert, Upload, MessageSquare, Database, ChevronDown, Check, LayoutGrid, List, Package, Edit } from "lucide-react";
import { formatPrice } from "@/lib/cityUtils";
import { Button } from "@/components/ui/button";
import { scanProductForBannedContent, logBlockedListing, getBlockedListings, saveBlockedListings } from "@/data/bannedProductsData";
import { searchMasterProducts, CATEGORY_SPEC_FIELDS, getEmptySpecs, getMasterProducts, saveMasterProducts, type MasterProduct } from "@/data/masterProductsData";
import AddProductGrid from "./AddProductGrid";

interface SellerProduct {
  id: number;
  image: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  amazonPrice: number;
  status: "Live" | "Draft" | "Pending";
  delivery: string;
  saved: boolean;
  editing: boolean;
}

const initialProducts: SellerProduct[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop", name: "Samsung Galaxy S24 Ultra", category: "Mobiles", brand: "Samsung", price: 129990, stock: 5, amazonPrice: 131999, status: "Live", delivery: "Same Day", saved: true, editing: false },
  { id: 2, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop", name: "iPhone 15 Pro Max", category: "Mobiles", brand: "Apple", price: 159900, stock: 3, amazonPrice: 156900, status: "Live", delivery: "Same Day", saved: true, editing: false },
  { id: 3, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop", name: "Sony WH-1000XM5", category: "Audio", brand: "Sony", price: 28990, stock: 0, amazonPrice: 26990, status: "Draft", delivery: "Next Day", saved: true, editing: false },
  { id: 4, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop", name: "LG OLED C3 55\" TV", category: "TVs", brand: "LG", price: 119990, stock: 2, amazonPrice: 116990, status: "Pending", delivery: "2 Hours", saved: true, editing: false },
  { id: 5, image: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=80&h=80&fit=crop", name: "Samsung 43\" Crystal 4K TV", category: "TVs", brand: "Samsung", price: 29990, stock: 8, amazonPrice: 29999, status: "Live", delivery: "Same Day", saved: true, editing: false },
  { id: 6, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&h=80&fit=crop", name: "HP Pavilion Laptop 15", category: "Laptops", brand: "HP", price: 65990, stock: 4, amazonPrice: 67999, status: "Live", delivery: "Next Day", saved: true, editing: false },
];

const categories = ["All", "Mobiles", "TVs", "Laptops", "Audio", "Appliances"];
const statuses = ["All", "Live", "Draft", "Pending"];

const ProductsTab: React.FC<{ isApproved: boolean }> = ({ isApproved }) => {
  const [products, setProducts] = useState<SellerProduct[]>(initialProducts);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [history, setHistory] = useState<SellerProduct[][]>([initialProducts]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Banned product states
  const [blockAlert, setBlockAlert] = useState<{ productName: string; keywords: string[] } | null>(null);
  const [showAppeal, setShowAppeal] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");
  const [appealFile, setAppealFile] = useState("");
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  // Add Product Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1); // 1=category, 2=search, 3=fill, 4=confirm
  const [addCategory, setAddCategory] = useState("Mobiles");
  const [addSearch, setAddSearch] = useState("");
  const [addSuggestions, setAddSuggestions] = useState<MasterProduct[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<MasterProduct | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "", brand: "", price: 0, stock: 0,
    condition: "New" as "New" | "Open Box" | "Refurbished",
    delivery: "Same Day",
    specs: {} as Record<string, string | number | boolean>,
  });

  // Search master DB on typing
  const handleAddSearch = (q: string) => {
    setAddSearch(q);
    if (q.length >= 2) {
      setAddSuggestions(searchMasterProducts(q, addCategory));
    } else {
      setAddSuggestions([]);
    }
  };

  // Select a master product -> auto-fill
  const selectMasterProduct = (mp: MasterProduct) => {
    setSelectedMaster(mp);
    setAddForm(prev => ({
      ...prev,
      name: `${mp.brand} ${mp.model_name}`,
      brand: mp.brand,
      specs: { ...(mp.specs as Record<string, string | number | boolean>) },
    }));
    setAddSearch(`${mp.brand} ${mp.model_name}`);
    setAddSuggestions([]);
    setIsManualEntry(false);
    setAddStep(3);
  };

  // Manual entry
  const startManualEntry = () => {
    setSelectedMaster(null);
    setIsManualEntry(true);
    setAddForm(prev => ({
      ...prev,
      name: addSearch,
      brand: "",
      specs: getEmptySpecs(addCategory),
    }));
    setAddStep(3);
  };

  // Submit new listing
  const submitNewListing = () => {
    // Auto-block scan
    const specText = Object.values(addForm.specs).join(" ");
    const scanResult = scanProductForBannedContent(addForm.name, specText, addCategory);
    if (scanResult.blocked) {
      logBlockedListing("S001", "My Shop", addForm.name, specText, scanResult.matchedKeywords);
      setBlockAlert({ productName: addForm.name, keywords: scanResult.matchedKeywords });
      setShowAddModal(false);
      resetAddModal();
      return;
    }

    // If manual entry, save to master DB as pending
    if (isManualEntry && addForm.name.trim()) {
      const masterProducts = getMasterProducts();
      masterProducts.push({
        id: Date.now() + 1000,
        brand: addForm.brand,
        model_name: addForm.name.replace(addForm.brand, "").trim() || addForm.name,
        category: addCategory as any,
        subcategory: "",
        specs: addForm.specs,
        mrp: addForm.price,
        image_url: "",
        status: "pending_verification",
        addedAt: new Date().toISOString().split("T")[0],
        addedBy: "Seller Submission",
      });
      saveMasterProducts(masterProducts);
    }

    const newProduct: SellerProduct = {
      id: Date.now(),
      image: selectedMaster?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
      name: addForm.name,
      category: addCategory,
      brand: addForm.brand || "Unknown",
      price: addForm.price,
      stock: addForm.stock,
      amazonPrice: selectedMaster?.mrp || 0,
      status: isManualEntry ? "Pending" : "Pending",
      delivery: addForm.delivery,
      saved: true,
      editing: false,
    };
    const next = [newProduct, ...products];
    setProducts(next);
    pushHistory(next);
    setShowAddModal(false);
    resetAddModal();
  };

  const resetAddModal = () => {
    setAddStep(1);
    setAddCategory("Mobiles");
    setAddSearch("");
    setAddSuggestions([]);
    setSelectedMaster(null);
    setIsManualEntry(false);
    setAddForm({ name: "", brand: "", price: 0, stock: 0, condition: "New", delivery: "Same Day", specs: {} });
  };

  // Appeal submission
  const submitAppeal = () => {
    if (!appealMessage.trim() || !blockAlert) return;
    const listings = getBlockedListings();
    const updated = listings.map(l =>
      l.productName === blockAlert.productName && l.status === "blocked"
        ? { ...l, status: "appealed" as const, appealMessage, appealProof: appealFile || undefined, appealedAt: new Date().toISOString() }
        : l
    );
    saveBlockedListings(updated);
    setAppealSubmitted(true);
    setTimeout(() => {
      setBlockAlert(null);
      setShowAppeal(false);
      setAppealMessage("");
      setAppealFile("");
      setAppealSubmitted(false);
    }, 2000);
  };

  const pushHistory = useCallback((next: SellerProduct[]) => {
    setHistory((h) => [...h.slice(0, historyIdx + 1), next]);
    setHistoryIdx((i) => i + 1);
  }, [historyIdx]);

  const undo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setProducts(history[historyIdx - 1]);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setProducts(history[historyIdx + 1]);
    }
  };

  const updateProduct = (id: number, field: keyof SellerProduct, value: string | number) => {
    const next = products.map((p) =>
      p.id === id ? { ...p, [field]: value, saved: false } : p
    );
    setProducts(next);

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: true } : p)));
      pushHistory(next.map((p) => ({ ...p, saved: true })));
    }, 500);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  const bulkSetStatus = (status: "Live" | "Draft") => {
    const next = products.map((p) => (selected.has(p.id) ? { ...p, status, saved: false } : p));
    setProducts(next);
    pushHistory(next);
    setSelected(new Set());
  };
  const bulkDelete = () => {
    const next = products.filter((p) => !selected.has(p.id));
    setProducts(next);
    pushHistory(next);
    setSelected(new Set());
  };

  const filtered = products.filter((p) => {
    if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    return true;
  });

  const getValidationTooltip = (p: SellerProduct) => {
    if (p.price === 0) return "Almost there! Please enter a price";
    if (p.name.length < 3) return "Almost there! Add a few more characters";
    return null;
  };

  const statusDot = (status: string) => {
    if (status === "Live") return "bg-success";
    if (status === "Pending") return "bg-warning";
    return "bg-muted-foreground";
  };

  // If showAddModal, render the full grid flow instead
  if (showAddModal) {
    return (
      <AddProductGrid
        onClose={() => { setShowAddModal(false); resetAddModal(); }}
        onProductAdded={(p) => {
          const newProduct: SellerProduct = {
            id: Date.now(),
            image: p.image,
            name: p.name,
            category: p.category,
            brand: p.brand,
            price: p.price,
            stock: p.stock,
            amazonPrice: p.amazonPrice,
            status: p.isManual ? "Pending" : "Pending",
            delivery: p.delivery,
            saved: true,
            editing: false,
          };
          const next = [newProduct, ...products];
          setProducts(next);
          pushHistory(next);
          setShowAddModal(false);
          resetAddModal();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Block Alert Modal */}
      {blockAlert && (
        <div className="rounded-card border-2 border-destructive bg-destructive/5 p-5 shadow-card space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-destructive">This product cannot be listed</p>
              <p className="text-sm text-foreground mt-1">
                "<span className="font-semibold">{blockAlert.productName}</span>" may be restricted under Indian law.
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {blockAlert.keywords.map(kw => (
                  <span key={kw} className="rounded-pill bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">🚫 {kw}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Contact support if this is an error, or appeal below.</p>

              {!showAppeal && !appealSubmitted && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => setShowAppeal(true)} className="text-xs gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> Appeal This Decision
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setBlockAlert(null)} className="text-xs">Dismiss</Button>
                </div>
              )}

              {showAppeal && !appealSubmitted && (
                <div className="mt-3 space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-semibold text-foreground">Submit Appeal</p>
                  <textarea
                    value={appealMessage}
                    onChange={e => setAppealMessage(e.target.value)}
                    placeholder="Explain why this product should be allowed (e.g., you have a valid license)..."
                    className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      value={appealFile}
                      onChange={e => setAppealFile(e.target.value)}
                      placeholder="Proof filename (e.g., license.pdf)"
                      className="flex-1 rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={submitAppeal} disabled={!appealMessage.trim()} className="text-xs gap-1">Submit Appeal</Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAppeal(false)} className="text-xs">Cancel</Button>
                  </div>
                </div>
              )}

              {appealSubmitted && (
                <div className="mt-3 rounded-input bg-success/10 border border-success/20 p-3">
                  <p className="text-sm font-semibold text-success">✅ Appeal submitted! Admin will review shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-input border border-border bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-input border border-border bg-background px-3 py-2 text-sm"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-input border border-border bg-background px-3 py-2 text-sm"
        >
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
        {(searchText || categoryFilter !== "All" || statusFilter !== "All") && (
          <Button variant="ghost" size="sm" onClick={() => { setSearchText(""); setCategoryFilter("All"); setStatusFilter("All"); }}>
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={undo} disabled={historyIdx === 0}>
          <Undo2 className="h-3.5 w-3.5 mr-1" /> Undo
        </Button>
        <Button variant="outline" size="sm" onClick={redo} disabled={historyIdx >= history.length - 1}>
          <Redo2 className="h-3.5 w-3.5 mr-1" /> Redo
        </Button>
        <Button size="sm" disabled={!isApproved} title={!isApproved ? "Pending approval" : ""} className={!isApproved ? "opacity-50 cursor-not-allowed" : ""} onClick={() => isApproved && setShowAddModal(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Product
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5 mr-1" /> CSV
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
        <div className="ml-auto hidden md:flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md p-1.5 transition-all duration-200 ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-md p-1.5 transition-all duration-200 ${viewMode === "table" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            title="Table view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-card bg-secondary p-3 text-sm text-secondary-foreground">
          <span className="font-medium">{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={() => bulkSetStatus("Live")} className="text-success border-success bg-transparent hover:bg-success/10">Set Live</Button>
          <Button size="sm" variant="outline" onClick={() => bulkSetStatus("Draft")} className="border-warning text-warning bg-transparent hover:bg-warning/10">Set Draft</Button>
          <Button size="sm" variant="outline" onClick={bulkDelete} className="text-destructive border-destructive bg-transparent hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      )}

      {/* Desktop Grid View */}
      {viewMode === "grid" && (
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const cheaper = p.price < p.amazonPrice;
            return (
              <div
                key={p.id}
                className={`group relative rounded-card border bg-card shadow-card overflow-hidden transition-all duration-200 hover:shadow-hover hover:border-primary/30 ${
                  selected.has(p.id) ? "border-primary ring-2 ring-primary/20" : "border-border"
                } ${!p.saved ? "ring-2 ring-warning/30" : ""}`}
              >
                {/* Selection checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                </div>

                {/* Status badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    p.status === "Live" ? "bg-success/10 text-success border border-success/20" :
                    p.status === "Pending" ? "bg-warning/10 text-warning border border-warning/20" :
                    "bg-muted text-muted-foreground border border-border"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot(p.status)}`} />
                    {p.status}
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative bg-muted/30 p-4 flex items-center justify-center h-40">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full max-h-32 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  {!p.saved && (
                    <span className="absolute bottom-2 right-2 rounded-pill bg-warning/90 px-2 py-0.5 text-[10px] font-bold text-white">Saving...</span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">{p.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-pill bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{p.category}</span>
                    <span className="text-[10px] text-muted-foreground">{p.brand}</span>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-foreground">{formatPrice(p.price)}</span>
                    {cheaper && (
                      <span className="text-[10px] font-semibold text-success">
                        ↓ {formatPrice(p.amazonPrice)} Amazon
                      </span>
                    )}
                    {!cheaper && p.amazonPrice > 0 && (
                      <span className="text-[10px] text-muted-foreground">
                        Amazon: {formatPrice(p.amazonPrice)}
                      </span>
                    )}
                  </div>

                  {/* Stock & Delivery */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {p.stock > 0 ? `${p.stock} in stock` : <span className="text-destructive font-semibold">Out of stock</span>}
                    </span>
                    <span>{p.delivery}</span>
                  </div>

                  {cheaper && (
                    <div className="rounded-input bg-success/5 border border-success/20 px-2 py-1">
                      <p className="text-[10px] font-semibold text-success text-center">✨ You're cheaper than Amazon!</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center border-t border-border divide-x divide-border">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                    title="View"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200"
                    title="Edit"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { const next = products.filter(x => x.id !== p.id); setProducts(next); pushHistory(next); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Product Card */}
          {isApproved && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-primary hover:border-primary hover:bg-primary/10 transition-all duration-200 min-h-[300px]"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-semibold">Add New Product</span>
            </button>
          )}
        </div>
      )}

      {/* Desktop Table View */}
      {viewMode === "table" && (
      <div className="hidden md:block overflow-x-auto rounded-card border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Brand</th>
              <th className="p-3 text-right">Price (₹)</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-right">Amazon</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-left">Delivery</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => {
              const tooltip = getValidationTooltip(p);
              const cheaper = p.price < p.amazonPrice;
              return (
                <tr key={p.id} className={`transition-all duration-200 ${!p.saved ? "bg-warning/10" : ""}`}>
                  <td className="p-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                  <td className="p-3">
                    <img src={p.image} alt={p.name} className="h-12 w-12 rounded-input object-contain bg-background" loading="lazy" />
                  </td>
                  <td className="p-3">
                    <div className="relative">
                      <input
                        value={p.name}
                        onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                        className="w-full bg-transparent font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1"
                      />
                      {tooltip && <span className="text-[10px] text-primary">{tooltip}</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <select value={p.category} onChange={(e) => updateProduct(p.id, "category", e.target.value)} className="bg-transparent text-sm">
                      {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-foreground">{p.brand}</td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) => updateProduct(p.id, "price", Number(e.target.value))}
                      className="w-24 bg-transparent text-right font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1"
                    />
                    {!p.saved && <span className="block text-[10px] text-warning">saving...</span>}
                    {p.saved && p.price > 0 && <CheckCircle className="inline h-3 w-3 text-success ml-1" />}
                  </td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => updateProduct(p.id, "stock", Number(e.target.value))}
                      className="w-16 bg-transparent text-right text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1"
                    />
                  </td>
                  <td className={`p-3 text-right text-sm ${cheaper ? "text-success font-semibold" : "text-foreground"}`}>
                    {formatPrice(p.amazonPrice)}
                    {cheaper && <span className="block text-[10px] text-success">You're cheaper!</span>}
                  </td>
                  <td className="p-3 text-center">
                    <span className="relative inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${statusDot(p.status)}`} />
                      <select
                        value={p.status}
                        onChange={(e) => updateProduct(p.id, "status", e.target.value)}
                        className="bg-transparent text-sm"
                        disabled={!isApproved && p.status === "Pending"}
                      >
                        <option>Live</option>
                        <option>Draft</option>
                        <option>Pending</option>
                      </select>
                    </span>
                  </td>
                  <td className="p-3">
                    <select value={p.delivery} onChange={(e) => updateProduct(p.id, "delivery", e.target.value)} className="bg-transparent text-sm">
                      <option>2 Hours</option>
                      <option>Same Day</option>
                      <option>Next Day</option>
                      <option>Self Pickup</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-full p-1.5 text-destructive/60 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => { const next = products.filter(x => x.id !== p.id); setProducts(next); pushHistory(next); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-card border border-border bg-card p-4 shadow-card">
            <div className="flex gap-3">
              <img src={p.image} alt={p.name} className="h-16 w-16 rounded-input object-contain bg-background" loading="lazy" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-base font-bold text-foreground">{formatPrice(p.price)}</span>
                  <span className={`h-2 w-2 rounded-full ${statusDot(p.status)}`} />
                  <span className="text-xs text-muted-foreground">{p.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">Stock: {p.stock} · {p.delivery}</p>
                {p.price < p.amazonPrice && (
                  <span className="text-[10px] font-semibold text-success">You're cheaper than Amazon!</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductsTab;
