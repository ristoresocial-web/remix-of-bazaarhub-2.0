import React, { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search, MapPin, Phone, MessageCircle, Star, Navigation, ExternalLink,
  Bell, Heart, BarChart3, Filter, ArrowUpDown, Shield, ShieldCheck, ShieldAlert,
  Package, X, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { MODEL_DATABASE, ModelSpec } from "@/data/compareModels";
import { getLocalSellersForProduct, getOnlinePricesForProduct, ProductSeller, TrustTier, StockStatus } from "@/data/sellerData";
import { formatPrice, getTimestamp } from "@/lib/cityUtils";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";

/* ── Trust tier styling ── */
const TIER_CONFIG: Record<TrustTier, { icon: React.ElementType; class: string }> = {
  New: { icon: ShieldAlert, class: "bg-muted text-muted-foreground border-border" },
  Established: { icon: Shield, class: "bg-primary/10 text-primary border-primary/20" },
  Trusted: { icon: ShieldCheck, class: "bg-success/10 text-success border-success/20" },
};

const STOCK_CONFIG: Record<StockStatus, string> = {
  "In Stock": "bg-success/10 text-success border-success/20",
  "Limited Stock": "bg-warning/10 text-warning-foreground border-warning/20",
  "Out of Stock": "bg-destructive/10 text-destructive border-destructive/20",
};

type SortKey = "price" | "distance" | "rating";
type SellerTypeFilter = "all" | "local" | "online";

const FindSellersPage: React.FC = () => {
  const city = localStorage.getItem("bazaarhub_city") || "Madurai";
  const timestamp = getTimestamp();
  const [query, setQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ModelSpec | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("price");
  const [typeFilter, setTypeFilter] = useState<SellerTypeFilter>("all");
  const [wishlisted, setWishlisted] = useState(false);
  const [priceAlert, setPriceAlert] = useState(false);
  const [showPriceChart, setShowPriceChart] = useState(false);
  const isLoggedIn = !!localStorage.getItem("bazaarhub_buyer_token"); // mock

  // Auto-suggest
  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    return MODEL_DATABASE
      .filter((m) => m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  // Seller data (memoized once per product)
  const localSellers = useMemo(
    () => (selectedProduct ? getLocalSellersForProduct(selectedProduct, city) : []),
    [selectedProduct, city]
  );
  const onlinePrices = useMemo(
    () => (selectedProduct ? getOnlinePricesForProduct(selectedProduct) : []),
    [selectedProduct]
  );

  // Filter & sort
  const filteredSellers = useMemo(() => {
    let list = [...localSellers];
    if (typeFilter === "local") list = list.filter((s) => s.type === "local");
    list.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "distance") return (a.distance ?? 999) - (b.distance ?? 999);
      return b.rating - a.rating;
    });
    return list;
  }, [localSellers, typeFilter, sortBy]);

  const allPrices = useMemo(() => {
    const prices: { name: string; price: number; type: "local" | "online" }[] = filteredSellers.map((s) => ({ name: s.shopName, price: s.price, type: "local" as const }));
    onlinePrices.forEach((p) => prices.push({ name: p.platform, price: p.price, type: "online" as const }));
    return prices.sort((a, b) => a.price - b.price);
  }, [filteredSellers, onlinePrices]);

  const lowestOverall = allPrices.length > 0 ? allPrices[0].price : 0;

  const selectProduct = useCallback((m: ModelSpec) => {
    setSelectedProduct(m);
    setQuery("");
    setShowSuggest(false);
    setWishlisted(false);
    setPriceAlert(false);
    setShowPriceChart(false);
  }, []);

  const handlePriceAlert = () => {
    setPriceAlert(true);
    toast({ title: "Price alert set!", description: `We'll notify you when any seller reduces the price of ${selectedProduct?.name}.` });
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    toast({ title: wishlisted ? "Removed from wishlist" : "Added to wishlist!", description: wishlisted ? undefined : "Saved to your buyer profile." });
  };

  const handleNotifySellers = () => {
    toast({ title: "Interest registered!", description: `Nearby sellers in ${city} will be notified about demand for this product.` });
  };

  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return <>{text.slice(0, idx)}<mark className="bg-primary/20 text-foreground rounded-sm">{text.slice(idx, idx + query.length)}</mark>{text.slice(idx + query.length)}</>;
  };

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>{selectedProduct ? `${selectedProduct.name} — Sellers in ${city}` : "Find Sellers"} | Bazaar Hub</title>
        <meta name="description" content={`Find all local and online sellers for ${selectedProduct?.name || "products"} in ${city}. Compare prices and contact sellers directly.`} />
      </Helmet>

      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent">
        <div className="container py-6 md:py-8">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Find Sellers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search for a product to see all sellers — local shops & online platforms — in{" "}
            <button onClick={() => window.dispatchEvent(new Event("open-city-selector"))} className="font-semibold text-primary hover:underline">{city}</button>
          </p>
        </div>
      </div>

      <div className="container py-6 space-y-6">

        {/* Search bar */}
        <div className="relative max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggest(true); }}
              onFocus={() => setShowSuggest(true)}
              placeholder="Search product name, brand, or model…"
              className="pl-9 pr-10"
            />
            {query && (
              <button onClick={() => { setQuery(""); setShowSuggest(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {showSuggest && query.length >= 2 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
              {suggestions.length > 0 ? suggestions.map((m) => (
                <button key={m.id} onClick={() => selectProduct(m)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent">
                  <img src={m.image} alt={m.name} className="h-12 w-12 rounded-lg object-contain bg-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{highlight(m.name)}</p>
                    <p className="text-xs text-muted-foreground">{highlight(m.brand)} · {m.category} · From {formatPrice(m.lowestPrice)}</p>
                  </div>
                </button>
              )) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No products found for "{query}"</div>
              )}
            </div>
          )}
        </div>

        {/* Selected product card */}
        {selectedProduct && (
          <div className="rounded-card border border-border bg-card p-4 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="h-24 w-24 rounded-lg object-contain bg-muted sm:h-28 sm:w-28" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedProduct.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedProduct.brand} · {selectedProduct.category}</p>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="rounded-full p-1 hover:bg-muted shrink-0">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Starting from</span>
                  <span className="text-xl font-bold text-success">{formatPrice(lowestOverall || selectedProduct.lowestPrice)}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-warning-foreground">
                  <Star className="h-3 w-3 fill-current" /> {selectedProduct.avgRating} ({selectedProduct.ratingCount} reviews)
                </div>

                {/* Action buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handlePriceAlert} disabled={priceAlert} className="gap-1 text-xs">
                    <Bell className={`h-3.5 w-3.5 ${priceAlert ? "fill-primary text-primary" : ""}`} />
                    {priceAlert ? "Alert set" : "Alert me if price drops"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleWishlist} className="gap-1 text-xs">
                    <Heart className={`h-3.5 w-3.5 ${wishlisted ? "fill-destructive text-destructive" : ""}`} />
                    {wishlisted ? "Wishlisted" : "Save to Wishlist"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPriceChart(!showPriceChart)} className="gap-1 text-xs">
                    <BarChart3 className="h-3.5 w-3.5" /> Compare Prices
                  </Button>
                </div>
              </div>
            </div>

            {/* Mini price chart */}
            {showPriceChart && (
              <div className="mt-4 rounded-card border border-border bg-muted/20 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">All Seller Prices Compared</h3>
                <div className="space-y-2">
                  {allPrices.map((p, i) => {
                    const maxPrice = Math.max(...allPrices.map((x) => x.price));
                    const pct = maxPrice > 0 ? (p.price / maxPrice) * 100 : 0;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 truncate text-xs font-medium text-foreground">{p.name}</span>
                        <div className="relative flex-1 h-6 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all ${p.type === "local" ? "bg-primary/70" : "bg-accent-foreground/30"}`}
                            style={{ width: `${pct}%` }}
                          />
                          <span className="absolute inset-y-0 right-2 flex items-center text-xs font-bold text-foreground">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                        {i === 0 && <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Lowest</Badge>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter / Sort bar */}
        {selectedProduct && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-foreground">
              Local Sellers in {city} ({filteredSellers.length})
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex rounded-pill border border-border bg-background p-0.5">
                {(["all", "local", "online"] as const).map((f) => (
                  <button key={f} onClick={() => setTypeFilter(f)} className={`rounded-pill px-3 py-1 text-xs font-semibold capitalize transition-colors ${typeFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {f === "all" ? "All" : f === "local" ? "Local Only" : "Online Only"}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-pill border border-border bg-background px-2 py-1">
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="bg-transparent text-xs font-semibold text-foreground outline-none">
                  <option value="price">Lowest Price</option>
                  <option value="distance">Nearest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Seller cards */}
        {selectedProduct && filteredSellers.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSellers.map((seller) => {
              const TierIcon = TIER_CONFIG[seller.trustTier].icon;
              return (
                <div key={seller.id} className={`rounded-card border bg-card p-4 shadow-card transition-all hover:shadow-card-hover ${seller.isLowestPrice ? "border-success" : "border-border"}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{seller.shopName}</p>
                      <p className="text-xs text-muted-foreground">{seller.sellerName}</p>
                    </div>
                    <Badge className={`shrink-0 gap-0.5 text-[10px] ${TIER_CONFIG[seller.trustTier].class}`}>
                      <TierIcon className="h-3 w-3" /> {seller.trustTier}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg font-bold ${seller.isLowestPrice ? "text-success" : "text-foreground"}`}>
                      {formatPrice(seller.price)}
                    </span>
                    {seller.isLowestPrice && (
                      <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Lowest Price</Badge>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-muted-foreground">
                    {seller.distance && (
                      <span className="flex items-center gap-0.5"><Navigation className="h-3 w-3" /> {seller.distance.toFixed(1)} km</span>
                    )}
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" /> {seller.rating} ({seller.reviewCount})</span>
                    <Badge className={`text-[10px] ${STOCK_CONFIG[seller.stockStatus]}`}>
                      <Package className="mr-0.5 h-2.5 w-2.5" /> {seller.stockStatus}
                    </Badge>
                  </div>

                  {seller.deliveryEstimate && (
                    <p className="mb-3 text-xs text-muted-foreground">🚚 {seller.deliveryEstimate}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {seller.googleMapsUrl && (
                      <a href={seller.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-1 rounded-pill border border-border py-2 text-xs font-semibold text-foreground hover:bg-accent">
                        <MapPin className="h-3 w-3" /> Directions
                      </a>
                    )}
                    <a href={`tel:${seller.phone}`} className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                      <Phone className="h-3 w-3" /> Call
                    </a>
                    {isLoggedIn && seller.whatsapp ? (
                      <a
                        href={`https://wa.me/91${seller.whatsapp}?text=${encodeURIComponent(`Vanakkam! Bazaar Hub-il "${selectedProduct.name}" stock/price patthi enquiry.`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-success py-2 text-xs font-semibold text-success-foreground hover:bg-success/90"
                      >
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </a>
                    ) : !isLoggedIn && seller.whatsapp ? (
                      <button
                        onClick={() => toast({ title: "Login required", description: "Please log in as a buyer to contact sellers via WhatsApp." })}
                        className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-muted py-2 text-xs font-semibold text-muted-foreground"
                      >
                        <MessageCircle className="h-3 w-3" /> Login to Chat
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No sellers found */}
        {selectedProduct && filteredSellers.length === 0 && (
          <div className="rounded-card border-2 border-dashed border-border bg-muted/20 py-12 text-center">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-semibold text-foreground">No local sellers found for this product in {city}</p>
            <p className="mt-1 text-xs text-muted-foreground">Click below to notify nearby sellers about your interest.</p>
            <Button variant="outline" className="mt-4 gap-1" onClick={handleNotifySellers}>
              <Bell className="h-4 w-4" /> Notify Nearby Sellers
            </Button>
          </div>
        )}

        {/* Online sellers */}
        {selectedProduct && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-foreground">Online Prices</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {onlinePrices.map((p) => (
                <a
                  key={p.platform}
                  href={p.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="flex items-center justify-between rounded-card border border-border bg-card p-4 transition-all hover:shadow-card-hover hover:border-primary"
                >
                  <div>
                    <p className="text-sm font-bold text-foreground">{p.platform}</p>
                    <p className="text-lg font-bold text-success">{formatPrice(p.price)}</p>
                    <p className="text-[10px] text-muted-foreground">as of {timestamp}</p>
                    <Badge className={`mt-1 text-[10px] ${p.inStock ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Amazon Associate link. We earn from qualifying purchases. Flipkart & other affiliate links. Commission earned.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!selectedProduct && (
          <div className="rounded-card border-2 border-dashed border-border bg-muted/20 py-16 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h2 className="mb-2 text-lg font-bold text-foreground">Search for a product</h2>
            <p className="text-sm text-muted-foreground">
              Type a product name, brand, or model above to see all sellers with prices in {city}
            </p>
          </div>
        )}

        <AffiliateDisclaimer />
      </div>
    </div>
  );
};

export default FindSellersPage;
