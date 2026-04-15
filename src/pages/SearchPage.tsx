import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search as SearchIcon, X, MapPin, Bell, Store } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { allProducts } from "@/data/mockData";
import type { Product } from "@/data/mockData";
import { ProductCardSkeleton } from "@/components/LoadingSkeleton";
import { formatPrice } from "@/lib/cityUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FilterPanel, { type SortOption } from "@/components/search/FilterPanel";
import ProductSearchCard from "@/components/search/ProductSearchCard";
import SortBar from "@/components/search/SortBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

const getCheapest = (p: Product) =>
  Math.min(...p.prices.filter(pr => pr.inStock).map(pr => pr.price));

const getPriceDiff = (p: Product) => {
  const inStock = p.prices.filter(pr => pr.inStock);
  const local = inStock.filter(pr => !pr.isAffiliate);
  const online = inStock.filter(pr => pr.isAffiliate);
  if (local.length === 0 || online.length === 0) return 0;
  return Math.abs(Math.min(...local.map(x => x.price)) - Math.min(...online.map(x => x.price)));
};

const SearchPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const urlCity = searchParams.get("city") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlBrand = searchParams.get("brand") || "";
  const urlSort = (searchParams.get("sort") || "most_compared") as SortOption;
  const urlPage = parseInt(searchParams.get("page") || "1", 10);

  const [query, setQuery] = useState(urlQuery);
  const city = urlCity || localStorage.getItem("bazaarhub_city") || "Madurai";

  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(urlCategory ? [urlCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(urlBrand ? [urlBrand] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [localOnly, setLocalOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>(urlSort);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareList, setCompareList] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(urlPage);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [urlQuery, sortBy, selectedCategories, selectedBrands, priceRange, localOnly]);

  // Compute min/max for slider
  const priceMinMax = useMemo<[number, number]>(() => {
    const prices = allProducts.flatMap(p => p.prices.filter(pr => pr.inStock).map(pr => pr.price));
    if (prices.length === 0) return [0, 200000];
    return [Math.min(...prices), Math.max(...prices)];
  }, []);

  useEffect(() => {
    setPriceRange(priceMinMax);
  }, [priceMinMax]);

  // Query-matched products
  const queryMatched = useMemo(() => {
    return allProducts.filter(p => {
      if (!urlQuery) return true;
      const q = urlQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
    });
  }, [urlQuery]);

  // Filter counts (computed from query-matched)
  const filterCounts = useMemo(() => {
    const catMap = new Map<string, number>();
    const brandMap = new Map<string, number>();
    queryMatched.forEach(p => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
    });
    return {
      categories: Array.from(catMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      brands: Array.from(brandMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    };
  }, [queryMatched]);

  // Apply filters
  const filtered = useMemo(() => {
    return queryMatched.filter(p => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      const cheapest = getCheapest(p);
      if (cheapest < priceRange[0] || cheapest > priceRange[1]) return false;
      if (localOnly && !p.localAvailable) return false;
      return true;
    });
  }, [queryMatched, selectedCategories, selectedBrands, priceRange, localOnly]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "price_asc") return getCheapest(a) - getCheapest(b);
      if (sortBy === "price_desc") return getCheapest(b) - getCheapest(a);
      if (sortBy === "best_diff") return getPriceDiff(b) - getPriceDiff(a);
      return b.prices.length - a.prices.length; // most_compared
    });
  }, [filtered, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const toggleCompare = (id: number) => {
    setCompareList(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    navigate(`/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(priceMinMax);
    setLocalOnly(false);
    setSortBy("most_compared");
    setCurrentPage(1);
  };

  const activeFilterTags = [
    ...selectedCategories.map(c => ({ key: `cat-${c}`, label: c, remove: () => setSelectedCategories(prev => prev.filter(x => x !== c)) })),
    ...selectedBrands.map(b => ({ key: `brand-${b}`, label: b, remove: () => setSelectedBrands(prev => prev.filter(x => x !== b)) })),
    ...(localOnly ? [{ key: "local", label: "City Partners Only", remove: () => setLocalOnly(false) }] : []),
  ];

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>{urlQuery ? `${urlQuery} in ${city}` : `Search Products in ${city}`} — BazaarHub</title>
        <meta name="description" content={`Compare prices for ${urlQuery || "products"} in ${city} — Local vs Amazon vs Flipkart | BazaarHub`} />
      </Helmet>

      {/* TITLE BAR */}
      <div className="border-b border-border bg-card sticky top-[64px] z-30">
        <div className="container py-3 space-y-2">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Search any product in ${city}...`}
                className="w-full rounded-pill border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-semibold text-foreground">
                {urlQuery ? <>Results for "<span className="text-primary">{urlQuery}</span>" in {city}</> : `All Products in ${city}`}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-pill bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                <MapPin className="h-3 w-3" />
                {city}
              </span>
              <button onClick={() => window.dispatchEvent(new Event("open-city-selector"))} className="text-[10px] text-primary hover:underline">
                Change
              </button>
            </div>
          </div>

          {activeFilterTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">Showing:</span>
              {activeFilterTags.map(tag => (
                <Badge key={tag.key} variant="secondary" className="gap-1 text-[10px] cursor-pointer" onClick={tag.remove}>
                  {tag.label} <X className="h-2.5 w-2.5" />
                </Badge>
              ))}
              <button onClick={handleReset} className="text-[10px] text-primary hover:underline ml-1">
                Clear All ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container py-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          /* EMPTY STATE */
          <div className="mx-auto max-w-lg rounded-card bg-card p-8 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <SearchIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-1 text-lg font-bold text-foreground">
              No results for "{urlQuery || "your search"}" in {city}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">Almost there! Try these suggestions:</p>
            <ul className="text-sm text-muted-foreground space-y-1 mb-6">
              <li>• Check spelling</li>
              <li>• Search with a different city</li>
              <li>• Browse all categories</li>
            </ul>
            <div className="space-y-2">
              <Button className="w-full gap-2" asChild>
                <Link to="/"><SearchIcon className="h-4 w-4" /> Browse All Products</Link>
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Bell className="h-4 w-4" /> Alert me when available in {city}
              </Button>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link to="/seller/register"><Store className="h-4 w-4" /> Be the first seller here!</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* RESULTS WITH FILTER SIDEBAR */
          <div className="flex gap-6 items-start">
            <FilterPanel
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minMax={priceMinMax}
              localOnly={localOnly}
              onLocalOnlyChange={setLocalOnly}
              sortBy={sortBy}
              onSortChange={setSortBy}
              counts={filterCounts}
              onReset={handleReset}
            />

            <div className="flex-1 min-w-0 space-y-4">
              <SortBar
                resultCount={sorted.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  : "space-y-3"
              }>
                {paginated.map(p => (
                  <ProductSearchCard
                    key={p.id}
                    product={p}
                    isCompare={compareList.includes(p.id)}
                    onToggleCompare={() => toggleCompare(p.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
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
                {compareList.map(id => {
                  const prod = allProducts.find(p => p.id === id);
                  return prod ? (
                    <span key={id} className="flex items-center gap-1 rounded-pill bg-background/20 px-2 py-0.5 text-xs">
                      {prod.name.slice(0, 15)}…
                      <button onClick={() => toggleCompare(id)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
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
