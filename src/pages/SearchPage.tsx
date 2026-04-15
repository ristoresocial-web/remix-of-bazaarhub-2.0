import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  X,
  MapPin,
  MessageCircle,
  ArrowUpDown,
  AlertCircle,
  Map,
  Bell,
  Store,
  Check,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockProducts, mockCategories } from "@/data/mockData";
import type { Product } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import { formatPrice, getTimestamp } from "@/lib/cityUtils";
import { getActivePlatforms, getPlatformSearchUrl } from "@/data/platformsData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const FILTER_CHIPS = [
  { key: "all", label: "All" },
  { key: "local", label: "Local Available" },
  { key: "under30k", label: "Under ₹30k" },
  { key: "top-rated", label: "4 Stars+" },
];

const SORT_OPTIONS = [
  { key: "local-first", label: "Local First" },
  { key: "cheapest", label: "Cheapest" },
  { key: "nearest", label: "Nearest" },
  { key: "top-rated", label: "Top Rated" },
];

// Now dynamic — pulled from admin-managed platforms

const NEARBY_CITIES = [
  { name: "Chennai", sellers: 3 },
  { name: "Trichy", sellers: 1 },
];

const SearchPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlCity = searchParams.get("city") || "";

  const [query, setQuery] = useState(urlQuery);
  const city = urlCity || localStorage.getItem("bazaarhub_city") || "Madurai";

  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("local-first");
  const [activeFilter, setActiveFilter] = useState("all");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showZero, setShowZero] = useState(false);
  const timestamp = getTimestamp();
  const onlinePlatforms = getActivePlatforms();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [query, sortBy, activeFilter]);

  const filtered = mockProducts.filter((p) => {
    const matchQ =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase());

    if (!matchQ) return false;

    if (activeFilter === "local") return p.localAvailable;
    if (activeFilter === "under30k") {
      const cheapest = Math.min(...p.prices.filter((pr) => pr.inStock).map((pr) => pr.price));
      return cheapest < 30000;
    }
    if (activeFilter === "top-rated") return true;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "local-first") {
      if (a.localAvailable && !b.localAvailable) return -1;
      if (!a.localAvailable && b.localAvailable) return 1;
      return 0;
    }
    if (sortBy === "cheapest") {
      const aMin = Math.min(...a.prices.filter((p) => p.inStock).map((p) => p.price));
      const bMin = Math.min(...b.prices.filter((p) => p.inStock).map((p) => p.price));
      return aMin - bMin;
    }
    if (sortBy === "nearest") {
      const aDist = a.localShop?.km ?? 999;
      const bDist = b.localShop?.km ?? 999;
      return aDist - bDist;
    }
    return 0;
  });

  const zeroResults = showZero || sorted.length === 0;
  const localCount = sorted.filter((p) => p.localAvailable).length;

  const toggleCompare = (id: number) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
  };

  const getCheapest = (p: Product) =>
    Math.min(...p.prices.filter((pr) => pr.inStock).map((pr) => pr.price));

  const getSaving = (p: Product) => {
    const prices = p.prices.filter((pr) => pr.inStock).map((pr) => pr.price);
    if (prices.length < 2) return 0;
    return Math.max(...prices) - Math.min(...prices);
  };

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>{query ? `${query} in ${city}` : `Search Products in ${city}`} — Bazaar Hub</title>
        <meta
          name="description"
          content={`Compare prices for ${query || "products"} in ${city} — Local vs Amazon vs Flipkart | Bazaar Hub`}
        />
      </Helmet>

      {/* TOP BAR */}
      <div className="border-b border-border bg-card sticky top-[64px] z-30">
        <div className="container py-3 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search any product in ${city}...`}
                className="w-full rounded-pill border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-pill bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <MapPin className="h-3 w-3" />
                Results in {city}
              </span>
              <button
                onClick={() => window.dispatchEvent(new Event("open-city-selector"))}
                className="text-xs font-medium text-primary transition-all duration-200 hover:underline"
              >
                Change
              </button>
            </div>
            {!zeroResults && (
              <p className="text-xs text-muted-foreground">
                {localCount} {city} City Partner{localCount !== 1 ? "s" : ""} + online
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.key}
                onClick={() => setActiveFilter(chip.key)}
                className={`whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  activeFilter === chip.key
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                {chip.label}
              </button>
            ))}

            <button
              onClick={() => setShowZero(!showZero)}
              className={`ml-auto whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                showZero
                  ? "bg-destructive text-destructive-foreground"
                  : "border border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {showZero ? "Show Results" : "Show Zero Results"}
            </button>
          </div>
        </div>
      </div>

      {/* SORT BAR */}
      {!zeroResults && (
        <div className="border-b border-border bg-background">
          <div className="container flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
            <ArrowUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  sortBy === opt.key
                    ? "border-2 border-primary bg-primary-light text-accent-foreground"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="container py-6">
        {loading && !showZero ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : zeroResults ? (
          <div className="mx-auto max-w-lg rounded-card bg-card p-8 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-foreground">
              No {city} City Partners for "{query || "your search"}"
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">Almost there! Check online platforms below.</p>

            <div className="my-4 h-px bg-border" />

            <p className="mb-3 text-xs font-medium text-muted-foreground uppercase">Check online platforms:</p>
            <div className="space-y-3">
              {onlinePlatforms.map((platform) => {
                const searchUrl = getPlatformSearchUrl(platform, query || "smartphone");
                return (
                  <div key={platform.id} className="flex items-center justify-between rounded-card border border-border bg-background p-3">
                    <div className="flex items-center gap-3 text-left">
                      <div className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {platform.logoUrl ? (
                          <img src={platform.logoUrl} alt={platform.name} className="h-6 w-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{platform.name}</p>
                        {platform.isAffiliate && platform.affiliateDisclaimer && (
                          <p className="text-[10px] text-muted-foreground">{platform.affiliateDisclaimer}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={searchUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg"
                    >
                      View on {platform.name}
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="mt-4">
              <AffiliateDisclaimer />
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
              <Map className="h-4 w-4" />
              <span>Found in nearby cities:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {NEARBY_CITIES.map((c) => (
                <Link
                  key={c.name}
                  to={`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(c.name)}`}
                  className="rounded-pill border-2 border-primary bg-background px-4 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-accent"
                >
                  {c.name} — {c.sellers} seller{c.sellers !== 1 ? "s" : ""}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <Button className="w-full gap-2">
                <Bell className="h-4 w-4" />
                Alert me when available in {city}
              </Button>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link to="/seller/register">
                  <Store className="h-4 w-4" />
                  Be the first seller here!
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {sorted.length} product{sorted.length !== 1 ? "s" : ""} found
              {query && (
                <>
                  {" "}for "<strong className="text-foreground">{query}</strong>"
                </>
              )}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((p) => {
                const cheapest = getCheapest(p);
                const saving = getSaving(p);
                const isInCompare = compareList.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="group relative rounded-card border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary hover:scale-[1.02]"
                  >
                    <Link to={`/product/${p.id}/${p.slug}`} className="block">
                      <div className="relative h-48 overflow-hidden rounded-t-card bg-background p-4">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                        {p.localAvailable && (
                          <span className="absolute left-2 top-2 rounded-pill bg-success px-2 py-0.5 text-[10px] font-semibold text-success-foreground">
                            Available Locally
                          </span>
                        )}
                        {saving > 0 && (
                          <span className="absolute right-2 top-2 rounded-pill bg-success-light px-2 py-0.5 text-[10px] font-bold text-success">
                            Save {formatPrice(saving)}
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>
                        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                          {p.name}
                        </h3>

                        {p.localAvailable && (
                          <span className="inline-block rounded-pill bg-success-light px-2 py-0.5 text-[10px] font-medium text-success">
                            Same day delivery
                          </span>
                        )}

                        <div className="flex items-baseline gap-2">
                          <p className="text-lg font-bold text-success">{formatPrice(cheapest)}</p>
                          {p.localAvailable && p.localShop && (
                            <span className="text-[10px] text-muted-foreground">
                              Local • {p.localShop.km} km
                            </span>
                          )}
                        </div>

                        {p.localShop && (
                          <p className="text-xs text-muted-foreground">{p.localShop.name}</p>
                        )}

                        <p className="text-[10px] text-muted-foreground">
                          {p.prices.length} prices compared
                        </p>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between border-t border-border px-3 py-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          checked={isInCompare}
                          onCheckedChange={() => toggleCompare(p.id)}
                          className="h-3.5 w-3.5"
                        />
                        <span className="text-[10px] text-muted-foreground">Compare</span>
                      </label>
                      {p.localAvailable && p.localShop && (
                        <a
                          href={`https://wa.me/91${p.localShop.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                            `Vanakkam! Bazaar Hub-il ungal ${p.name} patthi parthen.`
                          )}`}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 rounded-pill bg-success px-2.5 py-1 text-[10px] font-semibold text-success-foreground transition-all duration-200 hover:bg-success/90"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </a>
                      )}
                    </div>

                    <div className="px-3 pb-2">
                      <AffiliateDisclaimer />
                    </div>
                  </div>
                );
              })}
            </div>

            {sorted.length > 1 && (
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link to="/product/compare">Compare All Prices</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* COMPARE BAR */}
      {compareList.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-secondary text-secondary-foreground md:bottom-0">
          <div className="container flex items-center justify-between py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="whitespace-nowrap text-sm font-medium">
                Comparing: {compareList.length} product{compareList.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-1.5">
                {compareList.map((id) => {
                  const prod = mockProducts.find((p) => p.id === id);
                  return prod ? (
                    <span
                      key={id}
                      className="flex items-center gap-1 rounded-pill bg-background/20 px-2 py-0.5 text-xs"
                    >
                      {prod.name.slice(0, 15)}…
                      <button
                        onClick={() => toggleCompare(id)}
                        className="transition-all duration-200 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            </div>
            <Button size="sm" variant="hero" asChild>
              <Link to="/product/compare">Compare Now</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
