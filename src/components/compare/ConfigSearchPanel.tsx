import React, { useState, useMemo } from "react";
import { Search, Sparkles, SlidersHorizontal, Check, X, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MODEL_DATABASE, ModelSpec, CompareCategory, extractNumber } from "@/data/compareModels";
import { formatPrice } from "@/lib/cityUtils";

/* ── Config filter definitions per category ── */

interface FilterOption {
  label: string;
  values: string[];
}

interface SliderFilter {
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface BoolFilter {
  label: string;
}

interface ConfigDef {
  selects: FilterOption[];
  sliders: SliderFilter[];
  bools: BoolFilter[];
  priceMax: number;
}

const CONFIG_DEFS: Record<string, ConfigDef> = {
  Mobiles: {
    selects: [
      { label: "RAM", values: ["Any", "4 GB", "6 GB", "8 GB", "12 GB", "16 GB"] },
      { label: "Storage", values: ["Any", "64 GB", "128 GB", "256 GB", "512 GB", "1 TB"] },
      { label: "Camera (Main)", values: ["Any", "12 MP+", "50 MP+", "108 MP+", "200 MP+"] },
      { label: "Battery", values: ["Any", "4000 mAh+", "5000 mAh+", "6000 mAh+"] },
    ],
    sliders: [],
    bools: [{ label: "5G" }],
    priceMax: 200000,
  },
  Laptops: {
    selects: [
      { label: "RAM", values: ["Any", "8 GB", "16 GB", "32 GB", "64 GB"] },
      { label: "Storage", values: ["Any", "256 GB", "512 GB", "1 TB", "2 TB"] },
      { label: "Processor", values: ["Any", "Intel", "AMD", "Apple"] },
      { label: "Screen Size", values: ["Any", '13"', '14"', '15"', '16"', '17"'] },
    ],
    sliders: [],
    bools: [],
    priceMax: 300000,
  },
  TVs: {
    selects: [
      { label: "Screen Size", values: ["Any", '32"', '43"', '50"', '55"', '65"', '75"'] },
      { label: "Resolution", values: ["Any", "HD", "FHD", "4K", "8K"] },
      { label: "Smart OS", values: ["Any", "Android", "webOS", "Tizen", "Google TV"] },
      { label: "Panel", values: ["Any", "LED", "OLED", "QLED"] },
      { label: "Refresh Rate", values: ["Any", "60 Hz", "120 Hz", "144 Hz"] },
    ],
    sliders: [],
    bools: [],
    priceMax: 500000,
  },
  Refrigerators: {
    selects: [
      { label: "Capacity", values: ["Any", "180L+", "250L+", "350L+", "500L+"] },
      { label: "Type", values: ["Any", "Single Door", "Double Door", "French Door", "Side by Side"] },
      { label: "Energy Rating", values: ["Any", "3 Star", "4 Star", "5 Star"] },
    ],
    sliders: [],
    bools: [{ label: "Inverter" }],
    priceMax: 150000,
  },
  ACs: {
    selects: [
      { label: "Tonnage", values: ["Any", "1 Ton", "1.5 Ton", "2 Ton"] },
      { label: "Star Rating", values: ["Any", "3 Star", "4 Star", "5 Star"] },
      { label: "Brand", values: ["Any", "Daikin", "LG", "Samsung", "Voltas", "Blue Star"] },
    ],
    sliders: [],
    bools: [{ label: "Inverter" }],
    priceMax: 100000,
  },
  "Washing Machines": {
    selects: [
      { label: "Capacity", values: ["Any", "6 kg", "7 kg", "8 kg", "9 kg", "10 kg"] },
      { label: "Type", values: ["Any", "Front Load", "Top Load"] },
      { label: "RPM", values: ["Any", "700+", "1000+", "1200+", "1400+"] },
      { label: "Star Rating", values: ["Any", "3 Star", "4 Star", "5 Star"] },
    ],
    sliders: [],
    bools: [],
    priceMax: 80000,
  },
};

/* ── Match scoring ── */
interface MatchResult {
  model: ModelSpec;
  score: number; // 0-100
  matchedSpecs: string[];
  missedSpecs: string[];
}

function scoreModel(
  model: ModelSpec,
  filters: Record<string, string>,
  boolFilters: Record<string, boolean>,
  priceRange: [number, number]
): MatchResult {
  const matched: string[] = [];
  const missed: string[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  // Price check
  totalChecks++;
  if (model.lowestPrice >= priceRange[0] && model.lowestPrice <= priceRange[1]) {
    passedChecks++;
    matched.push("Price");
  } else {
    missed.push("Price");
  }

  // Select filters
  for (const [label, value] of Object.entries(filters)) {
    if (value === "Any") continue;
    totalChecks++;

    const specStr = JSON.stringify(model.specs).toLowerCase();
    const valLower = value.toLowerCase().replace("+", "");

    // Extract numeric threshold
    const numMatch = value.match(/([\d,.]+)/);
    if (numMatch) {
      const threshold = parseFloat(numMatch[1].replace(/,/g, ""));
      // Find the corresponding spec value
      let specValue: string | undefined;
      if (label === "RAM") specValue = model.specs.performance.ram;
      else if (label === "Storage") specValue = model.specs.performance.storage;
      else if (label.includes("Camera")) specValue = model.specs.camera.rearMain;
      else if (label === "Battery") specValue = model.specs.battery.capacity;
      else if (label === "Screen Size") specValue = model.specs.display.size;
      else if (label === "Refresh Rate") specValue = model.specs.display.refreshRate;

      if (specValue) {
        const specNum = extractNumber(specValue);
        if (specNum !== null && value.includes("+") ? specNum >= threshold : specNum === threshold) {
          passedChecks++;
          matched.push(label);
          continue;
        }
      }
    }

    // String matching fallback
    if (label === "Resolution" && model.specs.display.resolution.toLowerCase().includes(valLower)) {
      passedChecks++; matched.push(label); continue;
    }
    if (label === "Panel" && model.specs.display.panelType.toLowerCase().includes(valLower)) {
      passedChecks++; matched.push(label); continue;
    }
    if (label === "Smart OS" && model.specs.features.os.toLowerCase().includes(valLower)) {
      passedChecks++; matched.push(label); continue;
    }
    if (label === "Processor" && model.specs.performance.processor.toLowerCase().includes(valLower)) {
      passedChecks++; matched.push(label); continue;
    }
    if (specStr.includes(valLower)) {
      passedChecks++; matched.push(label); continue;
    }

    missed.push(label);
  }

  // Bool filters
  for (const [label, enabled] of Object.entries(boolFilters)) {
    if (!enabled) continue;
    totalChecks++;
    if (label === "5G" && model.specs.features.fiveG === "Yes") {
      passedChecks++; matched.push("5G");
    } else if (label === "Inverter") {
      // Mock: always match for now
      passedChecks++; matched.push("Inverter");
    } else {
      missed.push(label);
    }
  }

  const score = totalChecks === 0 ? 100 : Math.round((passedChecks / totalChecks) * 100);
  return { model, score, matchedSpecs: matched, missedSpecs: missed };
}

/* ── AI text parser (client-side keyword extraction) ── */
function parseAIDescription(text: string, category: string): { filters: Record<string, string>; bools: Record<string, boolean>; priceMax?: number } {
  const lower = text.toLowerCase();
  const filters: Record<string, string> = {};
  const bools: Record<string, boolean> = {};
  let priceMax: number | undefined;

  // Price extraction
  const priceMatch = lower.match(/(?:under|below|less than|budget|max|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/);
  if (priceMatch) priceMax = parseInt(priceMatch[1].replace(/,/g, ""), 10);
  const priceMatch2 = lower.match(/(?:₹|rs\.?)\s*([\d,]+)/);
  if (!priceMax && priceMatch2) priceMax = parseInt(priceMatch2[1].replace(/,/g, ""), 10);

  if (category === "Mobiles") {
    if (lower.match(/big\s*battery|long\s*battery|battery\s*life/)) filters["Battery"] = "5000 mAh+";
    const ramMatch = lower.match(/(\d+)\s*gb\s*ram/);
    if (ramMatch) filters["RAM"] = `${ramMatch[1]} GB`;
    if (lower.includes("good camera") || lower.includes("selfie") || lower.includes("camera")) filters["Camera (Main)"] = "50 MP+";
    if (lower.includes("high") && lower.includes("camera") || lower.includes("200mp")) filters["Camera (Main)"] = "200 MP+";
    const storageMatch = lower.match(/(\d+)\s*gb\s*storage/);
    if (storageMatch) filters["Storage"] = `${storageMatch[1]} GB`;
    if (lower.includes("5g")) bools["5G"] = true;
  } else if (category === "TVs") {
    if (lower.includes("4k")) filters["Resolution"] = "4K";
    if (lower.includes("8k")) filters["Resolution"] = "8K";
    if (lower.includes("oled")) filters["Panel"] = "OLED";
    if (lower.includes("qled")) filters["Panel"] = "QLED";
    const sizeMatch = lower.match(/(\d+)\s*(?:inch|")/);
    if (sizeMatch) filters["Screen Size"] = `${sizeMatch[1]}"`;
    if (lower.includes("120") && lower.includes("hz")) filters["Refresh Rate"] = "120 Hz";
  } else if (category === "Laptops") {
    const ramMatch = lower.match(/(\d+)\s*gb\s*ram/);
    if (ramMatch) filters["RAM"] = `${ramMatch[1]} GB`;
    if (lower.includes("apple") || lower.includes("mac")) filters["Processor"] = "Apple";
    if (lower.includes("intel")) filters["Processor"] = "Intel";
    if (lower.includes("amd")) filters["Processor"] = "AMD";
  }

  return { filters, bools, priceMax };
}

/* ── Component ── */
interface Props {
  category: CompareCategory;
  onSelectForCompare: (models: ModelSpec[]) => void;
  city: string;
}

const ConfigSearchPanel: React.FC<Props> = ({ category, onSelectForCompare, city }) => {
  const config = CONFIG_DEFS[category] || CONFIG_DEFS.Mobiles;

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [boolFilters, setBoolFilters] = useState<Record<string, boolean>>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([0, config.priceMax]);
  const [searched, setSearched] = useState(false);
  const [aiText, setAiText] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [aiParsing, setAiParsing] = useState(false);
  const [compareSet, setCompareSet] = useState<Set<string>>(new Set());

  // Reset when category changes
  React.useEffect(() => {
    const c = CONFIG_DEFS[category] || CONFIG_DEFS.Mobiles;
    setFilters({});
    setBoolFilters({});
    setPriceRange([0, c.priceMax]);
    setSearched(false);
    setCompareSet(new Set());
    setAiText("");
    setShowAI(false);
  }, [category]);

  const results = useMemo<MatchResult[]>(() => {
    if (!searched) return [];
    const catModels = MODEL_DATABASE.filter((m) => m.category === category);
    return catModels
      .map((m) => scoreModel(m, filters, boolFilters, priceRange))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [searched, category, filters, boolFilters, priceRange]);

  const handleSearch = () => setSearched(true);

  const handleAIFill = () => {
    if (!aiText.trim()) return;
    setAiParsing(true);
    setTimeout(() => {
      const parsed = parseAIDescription(aiText, category);
      setFilters((prev) => ({ ...prev, ...parsed.filters }));
      setBoolFilters((prev) => ({ ...prev, ...parsed.bools }));
      if (parsed.priceMax) setPriceRange([0, parsed.priceMax]);
      setAiParsing(false);
      setShowAI(false);
      setSearched(true);
    }, 800);
  };

  const toggleCompare = (id: string) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const handleCompareSelected = () => {
    const models = results
      .filter((r) => compareSet.has(r.model.id))
      .map((r) => r.model);
    if (models.length >= 2) onSelectForCompare(models);
  };

  const handleClearFilters = () => {
    setFilters({});
    setBoolFilters({});
    setPriceRange([0, config.priceMax]);
    setSearched(false);
    setCompareSet(new Set());
  };

  return (
    <div className="space-y-5">
      {/* AI Assistant toggle */}
      <div className="rounded-card border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">AI Configuration Assistant</span>
          </div>
          <Button
            variant={showAI ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAI(!showAI)}
            className="gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {showAI ? "Hide" : "Describe what you need"}
          </Button>
        </div>

        {showAI && (
          <div className="mt-3 space-y-3">
            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              placeholder={
                category === "Mobiles"
                  ? "e.g., I want a phone with big battery and good selfie camera under 20000"
                  : category === "TVs"
                  ? "e.g., 55 inch 4K OLED TV with 120Hz under 1 lakh"
                  : `Describe the ${category.toLowerCase()} you're looking for…`
              }
              className="w-full rounded-input border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              rows={3}
            />
            <Button onClick={handleAIFill} disabled={aiParsing || !aiText.trim()} className="w-full sm:w-auto">
              {aiParsing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Analyzing…
                </span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Fill filters with AI</span>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Filter grid */}
      <div className="rounded-card border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Configuration Filters</span>
          {Object.values(filters).some((v) => v !== "Any") && (
            <button onClick={handleClearFilters} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
              Clear all
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.selects.map((f) => (
            <div key={f.label}>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">{f.label}</label>
              <Select value={filters[f.label] || "Any"} onValueChange={(v) => setFilters((p) => ({ ...p, [f.label]: v }))}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {f.values.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Booleans */}
          {config.bools.map((b) => (
            <div key={b.label} className="flex items-center justify-between rounded-input border border-border bg-background px-3 py-2">
              <span className="text-xs font-medium text-foreground">{b.label}</span>
              <Switch
                checked={boolFilters[b.label] || false}
                onCheckedChange={(c) => setBoolFilters((p) => ({ ...p, [b.label]: c }))}
              />
            </div>
          ))}

          {/* Price range */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Price Range: {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
            </label>
            <Slider
              min={0}
              max={config.priceMax}
              step={1000}
              value={priceRange}
              onValueChange={(v) => setPriceRange(v as [number, number])}
              className="w-full"
            />
          </div>
        </div>

        <Button onClick={handleSearch} className="mt-4 w-full sm:w-auto gap-1">
          <Search className="h-4 w-4" /> Search {category}
        </Button>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Showing {results.length} product{results.length !== 1 ? "s" : ""} matching your configuration in{" "}
              <span className="text-primary">{city}</span>
            </p>
            {compareSet.size >= 2 && (
              <Button size="sm" onClick={handleCompareSelected} className="gap-1">
                Compare {compareSet.size} selected
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="rounded-card border-2 border-dashed border-border bg-muted/20 py-12 text-center">
              <SlidersHorizontal className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No products match these filters</p>
              <p className="mt-1 text-xs text-muted-foreground">Try relaxing some filters or changing the price range</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <div
                  key={r.model.id}
                  className={`relative rounded-card border-2 bg-card p-4 transition-all duration-200 hover:shadow-card-hover ${
                    compareSet.has(r.model.id) ? "border-primary shadow-sm" : "border-border"
                  }`}
                >
                  {/* Match score */}
                  <div className="absolute right-3 top-3">
                    <Badge
                      className={`text-[10px] font-bold ${
                        r.score >= 80
                          ? "bg-success/10 text-success border-success/20"
                          : r.score >= 50
                          ? "bg-warning/10 text-warning-foreground border-warning/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {r.score}% match
                    </Badge>
                  </div>

                  {/* Product info */}
                  <div className="flex items-start gap-3">
                    <img src={r.model.image} alt={r.model.name} className="h-16 w-16 rounded-lg object-contain bg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{r.model.name}</p>
                      <p className="text-xs text-muted-foreground">{r.model.brand}</p>
                      <p className="mt-1 text-base font-bold text-success">{formatPrice(r.model.lowestPrice)}</p>
                      <div className="flex items-center gap-1 text-xs text-warning-foreground">
                        <Star className="h-3 w-3 fill-current" /> {r.model.avgRating} ({r.model.ratingCount})
                      </div>
                    </div>
                  </div>

                  {/* Matched/missed specs */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {r.matchedSpecs.map((s) => (
                      <span key={s} className="inline-flex items-center gap-0.5 rounded-pill bg-success/10 border border-success/20 px-2 py-0.5 text-[10px] font-medium text-success">
                        <Check className="h-2.5 w-2.5" /> {s}
                      </span>
                    ))}
                    {r.missedSpecs.map((s) => (
                      <span key={s} className="inline-flex items-center gap-0.5 rounded-pill bg-destructive/10 border border-destructive/20 px-2 py-0.5 text-[10px] font-medium text-destructive">
                        <X className="h-2.5 w-2.5" /> {s}
                      </span>
                    ))}
                  </div>

                  {/* Key specs preview */}
                  <div className="mt-3 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                    <span>📱 {r.model.specs.display.size} {r.model.specs.display.panelType}</span>
                    <span>⚡ {r.model.specs.performance.processor}</span>
                    <span>🔋 {r.model.specs.battery.capacity}</span>
                    <span>💾 {r.model.specs.performance.ram}</span>
                  </div>

                  {/* Compare checkbox */}
                  <button
                    onClick={() => toggleCompare(r.model.id)}
                    className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-pill border py-2 text-xs font-semibold transition-all ${
                      compareSet.has(r.model.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {compareSet.has(r.model.id) ? (
                      <><Check className="h-3.5 w-3.5" /> Selected for compare</>
                    ) : (
                      <>+ Select to compare</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigSearchPanel;
