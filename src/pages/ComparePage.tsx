import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Share2, RotateCcw, Plus, Smartphone, Tv, Laptop,
  Snowflake, Fan, SlidersHorizontal, Search, WashingMachine, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ModelSearchBox from "@/components/compare/ModelSearchBox";
import ComparisonTable from "@/components/compare/ComparisonTable";
import ConfigSearchPanel from "@/components/compare/ConfigSearchPanel";
import ComparisonEngine from "@/components/compare/ComparisonEngine";
import { MODEL_DATABASE, ModelSpec, CATEGORIES, CompareCategory } from "@/data/compareModels";
import { searchComparisonProducts, getComparisonBySlug, type ComparisonResult } from "@/data/comparisonMockData";
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer";
import AIScoreBadge from "@/components/AIScoreBadge";
import AIVerdictStrip from "@/components/AIVerdictStrip";
import LocalPriceWinner from "@/components/LocalPriceWinner";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Mobiles: Smartphone,
  TVs: Tv,
  Laptops: Laptop,
  Refrigerators: Snowflake,
  ACs: Fan,
  "Washing Machines": WashingMachine,
};

const ALL_CATEGORIES = ["Mobiles", "TVs", "Laptops", "ACs", "Refrigerators", "Washing Machines"] as const;

const ComparePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const city = localStorage.getItem("bazaarhub_city") || "Madurai";
  const [category, setCategory] = useState<CompareCategory>("Mobiles");
  const [selectedModels, setSelectedModels] = useState<ModelSpec[]>([]);
  const [mode, setMode] = useState<"model" | "config" | "price">("model");

  // Price compare state
  const [priceQuery, setPriceQuery] = useState("");
  const [priceResults, setPriceResults] = useState<ComparisonResult[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonResult | null>(null);

  // URL param support for price compare
  useEffect(() => {
    const productParam = searchParams.get("product");
    if (productParam) {
      setMode("price");
      const found = getComparisonBySlug(productParam);
      if (found) setSelectedComparison(found);
    }
  }, [searchParams]);

  const selectedIds = selectedModels.map((m) => m.id);

  const addModel = useCallback((model: ModelSpec) => {
    setSelectedModels((prev) => {
      if (prev.length >= 3 || prev.find((m) => m.id === model.id)) return prev;
      return [...prev, model];
    });
  }, []);

  const removeModel = useCallback((id: string) => {
    setSelectedModels((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleCategoryChange = (cat: CompareCategory) => {
    setCategory(cat);
    setSelectedModels([]);
  };

  const handleClear = () => {
    setSelectedModels([]);
  };

  const handleShare = async () => {
    const ids = selectedModels.map((m) => m.id).join(",");
    const url = `${window.location.origin}/product/compare?cat=${category}&models=${ids}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share this comparison with friends." });
    } catch {
      toast({ title: "Share link", description: url });
    }
  };

  const handleConfigCompare = (models: ModelSpec[]) => {
    setSelectedModels(models);
    setMode("model"); // switch to model view to show full comparison
  };

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>Compare {category} — Head-to-Head Specs | Bazaar Hub</title>
        <meta name="description" content={`Compare ${category} models side-by-side. Detailed specs, prices from local & online sellers in ${city}. Bazaar Hub.`} />
      </Helmet>

      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Compare {category}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === "model"
                  ? "Head-to-head specs comparison — pick models to compare side by side"
                  : mode === "config"
                  ? "Search by configuration — find products that match your requirements"
                  : "Compare online vs city partner prices for the same product"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedModels.length >= 2 && (
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-1">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
              )}
              {selectedModels.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleClear} className="gap-1">
                  <RotateCcw className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">

        {/* Step 1: Category Selection */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">Step 1</Badge>
            <span className="text-sm font-semibold text-foreground">Select Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Smartphone;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat as CompareCategory)}
                  className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    category === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-card text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center rounded-card border border-border bg-card p-1">
          <button
            onClick={() => setMode("model")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-pill py-2.5 text-xs font-semibold transition-all ${
              mode === "model" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" /> Model vs Model
          </button>
          <button
            onClick={() => setMode("config")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-pill py-2.5 text-xs font-semibold transition-all ${
              mode === "config" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" /> Config Search
          </button>
          <button
            onClick={() => setMode("price")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-pill py-2.5 text-xs font-semibold transition-all ${
              mode === "price" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="h-4 w-4" /> Price Compare
          </button>
        </div>

        {mode === "price" ? (
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Search product to compare prices…"
                value={priceQuery}
                onChange={(e) => {
                  setPriceQuery(e.target.value);
                  setPriceResults(searchComparisonProducts(e.target.value));
                  if (!e.target.value) setSelectedComparison(null);
                }}
                className="max-w-md"
              />
            </div>

            {!selectedComparison && priceResults.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {priceResults.map((r) => (
                  <button
                    key={r.product.id}
                    onClick={() => setSelectedComparison(r)}
                    className="flex items-center gap-3 rounded-card border border-border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <img src={r.product.image} alt={r.product.name} className="h-14 w-14 rounded-lg object-contain bg-background" />
                    <div className="min-w-0 flex-1">
                      <p className="notranslate truncate text-sm font-bold text-foreground">{r.product.name}</p>
                      <p className="text-xs text-muted-foreground">{r.product.brand}</p>
                      <p className="text-xs text-success font-semibold">
                        from ₹{Math.min(r.lowestOnlinePrice, r.lowestLocalPrice).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!selectedComparison && priceResults.length === 0 && priceQuery && (
              <div className="rounded-card border-2 border-dashed border-border bg-muted/20 py-12 text-center">
                <p className="text-sm text-muted-foreground">No products found. Try a different search.</p>
              </div>
            )}

            {!selectedComparison && !priceQuery && (
              <div className="rounded-card border-2 border-dashed border-border bg-muted/20 py-12 text-center">
                <DollarSign className="mx-auto mb-3 h-10 w-10 text-primary/40" />
                <p className="text-sm text-muted-foreground">Search for a product above to compare online vs city partner prices</p>
              </div>
            )}

            {selectedComparison && (
              <div>
                <Button variant="ghost" size="sm" className="mb-3 gap-1" onClick={() => setSelectedComparison(null)}>
                  <RotateCcw className="h-3.5 w-3.5" /> Pick Different Product
                </Button>
                <ComparisonEngine data={selectedComparison} city={city} />
              </div>
            )}
          </div>
        ) : mode === "config" ? (
          <ConfigSearchPanel category={category} onSelectForCompare={handleConfigCompare} city={city} />
        ) : (
          <>
            {/* Model search boxes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Box 1 */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">Step 2</Badge>
                  <span className="text-sm font-semibold text-foreground">Model A</span>
                </div>
                {selectedModels[0] ? (
                  <div className="flex items-center gap-3 rounded-card border-2 border-primary bg-primary/5 p-3">
                    <img src={selectedModels[0].image} alt={selectedModels[0].name} className="h-12 w-12 rounded-lg object-contain bg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{selectedModels[0].name}</p>
                      <p className="text-xs text-muted-foreground">{selectedModels[0].brand} · ₹{selectedModels[0].lowestPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <button onClick={() => removeModel(selectedModels[0].id)} className="rounded-full p-1 hover:bg-destructive/10">
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <ModelSearchBox category={category} selectedIds={selectedIds} onSelect={addModel} placeholder={`Search ${category} brand or model…`} />
                )}
              </div>

              {/* Box 2 */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">Step 3</Badge>
                  <span className="text-sm font-semibold text-foreground">Model B</span>
                </div>
                {selectedModels[1] ? (
                  <div className="flex items-center gap-3 rounded-card border-2 border-primary bg-primary/5 p-3">
                    <img src={selectedModels[1].image} alt={selectedModels[1].name} className="h-12 w-12 rounded-lg object-contain bg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{selectedModels[1].name}</p>
                      <p className="text-xs text-muted-foreground">{selectedModels[1].brand} · ₹{selectedModels[1].lowestPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <button onClick={() => removeModel(selectedModels[1].id)} className="rounded-full p-1 hover:bg-destructive/10">
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <ModelSearchBox category={category} selectedIds={selectedIds} onSelect={addModel} placeholder={`Search second ${category.toLowerCase()} model…`} />
                )}
              </div>

              {/* Box 3: Optional */}
              {selectedModels.length >= 2 && selectedModels.length < 3 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">Optional</Badge>
                    <span className="text-sm font-semibold text-foreground">+ Add 3rd Model</span>
                  </div>
                  <ModelSearchBox category={category} selectedIds={selectedIds} onSelect={addModel} placeholder={`Add a third ${category.toLowerCase()} to compare…`} />
                </div>
              )}

              {selectedModels[2] && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">Model C</Badge>
                  </div>
                  <div className="flex items-center gap-3 rounded-card border-2 border-primary bg-primary/5 p-3">
                    <img src={selectedModels[2].image} alt={selectedModels[2].name} className="h-12 w-12 rounded-lg object-contain bg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{selectedModels[2].name}</p>
                      <p className="text-xs text-muted-foreground">{selectedModels[2].brand} · ₹{selectedModels[2].lowestPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <button onClick={() => removeModel(selectedModels[2].id)} className="rounded-full p-1 hover:bg-destructive/10">
                      <RotateCcw className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* AI Score Badges */}
            {selectedModels.length >= 2 && (
              <div className="space-y-4">
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedModels.length}, 1fr)` }}>
                  {selectedModels.map((m) => (
                    <div key={m.id} className="flex flex-col items-center rounded-xl border border-border bg-card p-4 shadow-sm">
                      <p className="mb-2 text-xs font-semibold text-muted-foreground truncate max-w-full">{m.name}</p>
                      <AIScoreBadge
                        productName={m.name}
                        category={category}
                        price={m.lowestPrice}
                        city={city}
                        specs={Object.values(m.specs).flat().join(", ")}
                        localSellersCount={0}
                        lowestLocalPrice={m.lowestPrice}
                        onlineLowestPrice={m.lowestPrice}
                      />
                      <div className="mt-2 w-full">
                        <LocalPriceWinner
                          localLowest={m.lowestPrice}
                          onlineLowest={m.lowestPrice + Math.floor(Math.random() * 3000 - 1000)}
                          city={city}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Verdict Strip */}
                {selectedModels.length >= 2 && (
                  <AIVerdictStrip
                    modelA={{ name: selectedModels[0].name, score: 0, verdict: "" }}
                    modelB={{ name: selectedModels[1].name, score: 0, verdict: "" }}
                    city={city}
                  />
                )}
              </div>
            )}

            {/* Comparison Table */}
            {selectedModels.length >= 2 ? (
              <ComparisonTable models={selectedModels} onRemove={removeModel} />
            ) : (
              <div className="rounded-card border-2 border-dashed border-border bg-muted/20 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h2 className="mb-2 text-lg font-bold text-foreground">
                  {selectedModels.length === 0
                    ? "Select two models to compare"
                    : "Pick a second model to start comparing"}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Use the search boxes above, or switch to <strong>Search by Configuration</strong> if you don't know the model name
                </p>
                <Button variant="outline" onClick={() => setMode("config")} className="gap-1">
                  <SlidersHorizontal className="h-4 w-4" /> Try Configuration Search
                </Button>
              </div>
            )}
          </>
        )}

        <AffiliateDisclaimer />
      </div>
    </div>
  );
};

export default ComparePage;
