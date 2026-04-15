import React, { useState, useMemo } from "react";
import { Search, Filter, Grid3X3, Map as MapIcon, Plus, UtensilsCrossed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FoodStallCard from "./FoodStallCard";
import FoodStallMapView from "./FoodStallMapView";
import FoodStallForm from "./FoodStallForm";
import { mockFoodStalls, CUISINE_OPTIONS, getFoodStallStatus, FoodStall } from "@/data/foodFestivalData";

interface Props {
  city: string;
}

const DISTANCE_OPTIONS = [
  { value: "all", label: "Any Distance" },
  { value: "2", label: "Within 2 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active Only" },
  { value: "upcoming", label: "Upcoming" },
];

const FoodFestivalTab: React.FC<Props> = ({ city }) => {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"nearest" | "rating">("nearest");
  const [showForm, setShowForm] = useState(false);

  const filteredStalls = useMemo(() => {
    let stalls = [...mockFoodStalls];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      stalls = stalls.filter(
        (s) =>
          s.stallName.toLowerCase().includes(q) ||
          s.todaysMenu.toLowerCase().includes(q) ||
          s.cuisineType.toLowerCase().includes(q) ||
          (s.festivalName && s.festivalName.toLowerCase().includes(q))
      );
    }

    if (cuisineFilter !== "All") {
      stalls = stalls.filter((s) => s.cuisineType === cuisineFilter);
    }

    if (distanceFilter !== "all") {
      const maxKm = parseFloat(distanceFilter);
      stalls = stalls.filter((s) => s.distance <= maxKm);
    }

    if (statusFilter === "active") {
      stalls = stalls.filter((s) => {
        const st = getFoodStallStatus(s).key;
        return st === "live" || st === "today-only" || st === "festival-special";
      });
    } else if (statusFilter === "upcoming") {
      stalls = stalls.filter((s) => {
        const st = getFoodStallStatus(s).key;
        return st === "upcoming" || st === "starts-tomorrow";
      });
    }

    // Sort: city picks first, then by criteria
    stalls.sort((a, b) => {
      if (a.isCityPick && !b.isCityPick) return -1;
      if (!a.isCityPick && b.isCityPick) return 1;
      if (sortBy === "nearest") return a.distance - b.distance;
      return b.rating - a.rating;
    });

    return stalls;
  }, [searchQuery, cuisineFilter, distanceFilter, statusFilter, sortBy]);

  const statusCounts = useMemo(() => {
    const counts = { live: 0, todayOnly: 0, festival: 0, upcoming: 0 };
    mockFoodStalls.forEach((s) => {
      const st = getFoodStallStatus(s).key;
      if (st === "live") counts.live++;
      if (st === "today-only") counts.todayOnly++;
      if (st === "festival-special") counts.festival++;
      if (st === "upcoming" || st === "starts-tomorrow") counts.upcoming++;
    });
    return counts;
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                🍽️ Food Festival — {city}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredStalls.length} food stalls active in your city
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-success/10 text-success border-success/20 gap-1">
                🟢 {statusCounts.live} Live
              </Badge>
              <Badge className="bg-warning/10 text-warning-foreground border-warning/20 gap-1">
                🟠 {statusCounts.todayOnly} Today
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 border-amber-300 gap-1">
                ⭐ {statusCounts.festival} Festival
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                🔵 {statusCounts.upcoming} Upcoming
              </Badge>
              <Button size="sm" onClick={() => setShowForm(true)} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> List Your Stall
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[112px] z-20 border-b border-border bg-card shadow-sm">
        <div className="container py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search stalls, menus…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Cuisines</SelectItem>
                  {CUISINE_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  {DISTANCE_OPTIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "nearest" | "rating")}>
                <SelectTrigger className="w-[130px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest First</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center rounded-pill border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 rounded-l-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="h-3.5 w-3.5" /> Grid
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1 rounded-r-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    viewMode === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapIcon className="h-3.5 w-3.5" /> Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6">
        {filteredStalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">No food stalls found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setCuisineFilter("All"); setDistanceFilter("all"); setStatusFilter("all"); }}>
              Clear all filters
            </Button>
          </div>
        ) : viewMode === "map" ? (
          <FoodStallMapView stalls={filteredStalls} city={city} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStalls.map((stall) => (
              <FoodStallCard key={stall.id} stall={stall} />
            ))}
          </div>
        )}
      </div>

      {showForm && <FoodStallForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default FoodFestivalTab;
