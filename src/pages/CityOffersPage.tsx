import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { MapPin, Phone, MessageCircle, Clock, Tag, Calendar, ExternalLink, Filter, Map as MapIcon, Grid3X3, Search, Star, Navigation, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/cityUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CityOfferCard from "@/components/cityoffers/CityOfferCard";
import CityOfferMapView from "@/components/cityoffers/CityOfferMapView";
import FoodFestivalTab from "@/components/foodfestival/FoodFestivalTab";
import { CityOffer, mockCityOffers, CATEGORY_OPTIONS, getOfferStatus } from "@/data/cityOffersData";
import { mockFoodStalls } from "@/data/foodFestivalData";
import { useSearchParams, useLocation } from "react-router-dom";

const DISTANCE_OPTIONS = [
  { value: "all", label: "Any Distance" },
  { value: "2", label: "Within 2 km" },
  { value: "5", label: "Within 5 km" },
  { value: "10", label: "Within 10 km" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "live", label: "🟢 Live Now" },
  { value: "ending", label: "🟡 Ending Today" },
  { value: "upcoming", label: "🔵 Upcoming" },
];

const CityOffersPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const city = localStorage.getItem("bazaarhub_city") || "Madurai";
  
  const isFoodPath = location.pathname === "/city-offers/food";
  const activeTab = isFoodPath || searchParams.get("tab") === "food" ? "food" : "offers";
  const setActiveTab = (tab: "offers" | "food") => {
    const params = new URLSearchParams(searchParams);
    if (tab === "food") params.set("tab", "food");
    else params.delete("tab");
    setSearchParams(params);
  };

  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOffers = useMemo(() => {
    let offers = [...mockCityOffers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      offers = offers.filter(
        (o) =>
          o.shopName.toLowerCase().includes(q) ||
          o.productDescription.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      offers = offers.filter((o) => o.category === categoryFilter);
    }

    if (distanceFilter !== "all") {
      const maxKm = parseFloat(distanceFilter);
      offers = offers.filter((o) => o.distance <= maxKm);
    }

    if (statusFilter !== "all") {
      offers = offers.filter((o) => getOfferStatus(o).key === statusFilter);
    }

    return offers;
  }, [searchQuery, categoryFilter, distanceFilter, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { live: 0, ending: 0, upcoming: 0 };
    mockCityOffers.forEach((o) => {
      const s = getOfferStatus(o).key;
      if (s in counts) counts[s as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const foodStallCount = mockFoodStalls.length;

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>{activeTab === "food" ? `Food Festival in ${city}` : `City Offers in ${city}`} — Bazaar Hub</title>
        <meta name="description" content={`Discover temporary shops, food festivals, and seasonal sellers in ${city}. Compare local deals on Bazaar Hub.`} />
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-bh-border bg-gradient-to-br from-bh-orange-light/40 via-bh-surface-2 to-white">
        <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-bh-orange/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-bh-green/10 blur-3xl" />
        <div className="container relative py-6 md:py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-bh-text md:text-4xl">
                சிறப்பு சலுகைகள் — City Offers
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="gap-1 bg-bh-orange-light text-bh-orange-dark border-bh-orange/20">
                  <MapPin className="h-3 w-3" />
                  {city}
                </Badge>
                <button
                  onClick={() => window.dispatchEvent(new Event("open-city-selector"))}
                  className="text-xs font-semibold text-bh-orange hover:underline"
                >
                  Change City
                </button>
              </div>
            </div>

            {/* Status summary pills */}
            <div className="flex items-center gap-2">
              <Badge className="bg-bh-green-light text-bh-green-dark border-bh-green/20 gap-1 font-mono">
                🟢 {statusCounts.live} Live
              </Badge>
              <Badge className="bg-bh-orange-light text-bh-orange-dark border-bh-orange/20 gap-1 font-mono">
                🟡 {statusCounts.ending} Ending
              </Badge>
              <Badge className="bg-bh-blue-light text-bh-blue border-bh-blue/20 gap-1 font-mono">
                🔵 {statusCounts.upcoming} Upcoming
              </Badge>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="mt-4 flex items-center gap-1 rounded-pill border border-bh-border bg-bh-surface/80 backdrop-blur-sm p-1 w-fit shadow-bh-sm">
            <button
              onClick={() => setActiveTab("offers")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === "offers" ? "bg-bh-orange text-white shadow-price" : "text-bh-text-secondary hover:text-bh-text"
              }`}
            >
              <ShoppingBag className="h-4 w-4" /> City Offers
            </button>
            <button
              onClick={() => setActiveTab("food")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === "food" ? "bg-bh-orange text-white shadow-price" : "text-bh-text-secondary hover:text-bh-text"
              }`}
            >
              <UtensilsCrossed className="h-4 w-4" /> Food Festival
              <Badge className="bg-white/20 text-current text-[10px] px-1.5 py-0 font-mono">{foodStallCount}</Badge>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "food" ? (
        <FoodFestivalTab city={city} />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="sticky top-16 z-20 border-b border-border bg-card shadow-sm">
            <div className="container py-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1 md:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search shops or products…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="Distance" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTANCE_OPTIONS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
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
            {filteredOffers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Filter className="mb-3 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold text-foreground">No offers found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search in a different city.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setCategoryFilter("All"); setDistanceFilter("all"); setStatusFilter("all"); }}>
                  Clear all filters
                </Button>
              </div>
            ) : viewMode === "map" ? (
              <CityOfferMapView offers={filteredOffers} city={city} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredOffers.map((offer) => (
                  <CityOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CityOffersPage;
