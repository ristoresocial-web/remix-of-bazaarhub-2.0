import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type SortOption = "price_asc" | "price_desc" | "best_diff" | "most_compared";
export type AvailabilityFilter = "all" | "online" | "offline" | "both";

interface FilterCounts {
  categories: { name: string; count: number }[];
  brands: { name: string; count: number }[];
}

interface FilterPanelProps {
  selectedCategories: string[];
  onCategoriesChange: (cats: string[]) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minMax: [number, number];
  localOnly: boolean;
  onLocalOnlyChange: (v: boolean) => void;
  availability: AvailabilityFilter;
  onAvailabilityChange: (v: AvailabilityFilter) => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  counts: FilterCounts;
  onReset: () => void;
}

const FilterContent: React.FC<FilterPanelProps> = ({
  selectedCategories, onCategoriesChange,
  selectedBrands, onBrandsChange,
  priceRange, onPriceRangeChange, minMax,
  localOnly, onLocalOnlyChange,
  availability, onAvailabilityChange,
  sortBy, onSortChange,
  counts, onReset,
}) => {
  const toggleCategory = (cat: string) => {
    onCategoriesChange(
      selectedCategories.includes(cat)
        ? selectedCategories.filter(c => c !== cat)
        : [...selectedCategories, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    onBrandsChange(
      selectedBrands.includes(brand)
        ? selectedBrands.filter(b => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Filters</h3>
        <button onClick={onReset} className="text-xs text-primary hover:underline">Reset</button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">📦 Category</p>
        {counts.categories.map(cat => (
          <label key={cat.name} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selectedCategories.includes(cat.name)}
              onCheckedChange={() => toggleCategory(cat.name)}
              className="h-3.5 w-3.5"
            />
            <span className="text-sm text-foreground">{cat.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">({cat.count})</span>
          </label>
        ))}
      </div>

      {/* Brands */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">🏷️ Brand</p>
        {counts.brands.map(brand => (
          <label key={brand.name} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selectedBrands.includes(brand.name)}
              onCheckedChange={() => toggleBrand(brand.name)}
              className="h-3.5 w-3.5"
            />
            <span className="text-sm text-foreground">{brand.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">({brand.count})</span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase">💰 Price Range</p>
        <Slider
          min={minMax[0]}
          max={minMax[1]}
          step={1000}
          value={priceRange}
          onValueChange={(v) => onPriceRangeChange(v as [number, number])}
          className="py-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
          <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">🛒 Availability</p>
        <RadioGroup value={availability} onValueChange={(v) => onAvailabilityChange(v as AvailabilityFilter)}>
          {[
            { value: "all", label: "All sources" },
            { value: "both", label: "Online & Nearby" },
            { value: "online", label: "Online only" },
            { value: "offline", label: "Nearby store only" },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt.value} className="h-3.5 w-3.5" />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* City Partners Only */}
      <div className="flex items-center justify-between">
        <Label className="text-sm text-foreground flex items-center gap-1.5">
          📍 City Partners Only
        </Label>
        <Switch checked={localOnly} onCheckedChange={onLocalOnlyChange} />
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">📊 Sort By</p>
        <RadioGroup value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          {[
            { value: "price_asc", label: "Price: Low to High" },
            { value: "price_desc", label: "Price: High to Low" },
            { value: "best_diff", label: "Best Price Difference" },
            { value: "most_compared", label: "Most Compared" },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value={opt.value} className="h-3.5 w-3.5" />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = (props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="fixed bottom-20 right-4 z-40 rounded-full shadow-lg gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="w-[260px] shrink-0 rounded-card border border-border bg-card p-4 shadow-card h-fit sticky top-[140px]">
      <FilterContent {...props} />
    </aside>
  );
};

export default FilterPanel;
