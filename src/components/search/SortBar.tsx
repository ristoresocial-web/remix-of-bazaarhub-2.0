import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortOption } from "./FilterPanel";

interface SortBarProps {
  resultCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

const SortBar: React.FC<SortBarProps> = ({
  resultCount, viewMode, onViewModeChange, sortBy, onSortChange,
}) => {
  return (
    <div className="flex items-center justify-between rounded-card border border-border bg-card px-4 py-2 shadow-sm">
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">{resultCount}</strong> result{resultCount !== 1 ? "s" : ""} found
      </p>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`rounded-md p-1.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="best_diff">Best Price Difference</SelectItem>
            <SelectItem value="most_compared">Most Compared</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortBar;
