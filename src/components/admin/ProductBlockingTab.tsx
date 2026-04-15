import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Ban, MapPin, Search, AlertTriangle, X } from "lucide-react";
import { mockProducts } from "@/data/mockData";
import { citiesByState } from "@/lib/cityUtils";

interface BlockedProduct {
  productId: number; name: string; reason: string; blockedStates: string[]; blockedCities: string[]; isGlobal: boolean;
}

const allStates = Object.keys(citiesByState).sort();

const ProductBlockingTab: React.FC = () => {
  const [blocked, setBlocked] = useState<BlockedProduct[]>([
    { productId: 3, name: "Sony WH-1000XM5", reason: "Counterfeit reports", blockedStates: [], blockedCities: [], isGlobal: true },
    { productId: 6, name: "Samsung Galaxy Buds2 Pro", reason: "Regional pricing issue", blockedStates: ["Kerala", "Karnataka"], blockedCities: ["Kochi", "Mangalore"], isGlobal: false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const filteredProducts = searchQuery.length >= 2
    ? mockProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !blocked.some(b => b.productId === p.id))
    : [];

  const availableCities = selectedStates.flatMap(s => citiesByState[s] || []);

  const handleBlock = () => {
    const product = mockProducts.find(p => p.id === selectedProduct);
    if (!product || !reason) return;
    setBlocked(prev => [...prev, { productId: product.id, name: product.name, reason, blockedStates: isGlobal ? [] : selectedStates, blockedCities: isGlobal ? [] : selectedCities, isGlobal }]);
    setShowAdd(false); setSearchQuery(""); setSelectedProduct(null); setReason(""); setIsGlobal(false); setSelectedStates([]); setSelectedCities([]);
  };

  const unblock = (productId: number) => setBlocked(prev => prev.filter(b => b.productId !== productId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Product Blocking</h2>
        <Button onClick={() => setShowAdd(true)} className="gap-1 rounded-pill"><Ban className="h-4 w-4" /> Block Product</Button>
      </div>

      {/* Info banner */}
      <div className="rounded-card bg-warning/10 border border-warning/20 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Blocked products show "Not available in your region"</p>
          <p className="text-xs text-muted-foreground">Globally blocked products are hidden everywhere. Geo-restricted products only hidden in selected states/cities.</p>
        </div>
      </div>

      {/* Add block form */}
      {showAdd && (
        <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Block a Product</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-muted rounded-full"><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          {/* Product search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search product to block..." className="w-full rounded-input border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            {filteredProducts.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                {filteredProducts.map(p => (
                  <li key={p.id} onClick={() => { setSelectedProduct(p.id); setSearchQuery(p.name); }} className={`cursor-pointer px-4 py-2 text-sm hover:bg-accent ${selectedProduct === p.id ? "bg-accent" : ""}`}>
                    <span className="font-medium">{p.name}</span> <span className="text-muted-foreground">({p.brand})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedProduct && (
            <>
              <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason for blocking..." className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Block Globally</p>
                  <p className="text-xs text-muted-foreground">Hide from all regions</p>
                </div>
                <Switch checked={isGlobal} onCheckedChange={setIsGlobal} />
              </div>
              {!isGlobal && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Restrict in States</label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {allStates.map(state => (
                        <button key={state} onClick={() => setSelectedStates(prev => prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state])} className={`rounded-pill px-2.5 py-1 text-xs font-medium transition-all ${selectedStates.includes(state) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedStates.length > 0 && availableCities.length > 0 && (
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Restrict in Cities (optional — leave empty for entire state)</label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {availableCities.map(city => (
                          <button key={city} onClick={() => setSelectedCities(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city])} className={`rounded-pill px-2.5 py-1 text-xs font-medium transition-all ${selectedCities.includes(city) ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Button onClick={handleBlock} disabled={!reason} className="gap-1"><Ban className="h-4 w-4" /> Block Product</Button>
            </>
          )}
        </div>
      )}

      {/* Blocked list */}
      <div className="space-y-2">
        {blocked.map(b => (
          <div key={b.productId} className="flex items-center justify-between rounded-card border border-destructive/20 bg-destructive/5 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground notranslate">{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.reason}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {b.isGlobal ? (
                  <span className="rounded-pill bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">🌍 Globally Blocked</span>
                ) : (
                  <>
                    {b.blockedStates.map(s => <span key={s} className="rounded-pill bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">{s}</span>)}
                    {b.blockedCities.map(c => <span key={c} className="rounded-pill bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground"><MapPin className="inline h-2.5 w-2.5" /> {c}</span>)}
                  </>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => unblock(b.productId)} className="text-xs shrink-0">Unblock</Button>
          </div>
        ))}
        {blocked.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No blocked products</p>}
      </div>
    </div>
  );
};

export default ProductBlockingTab;
