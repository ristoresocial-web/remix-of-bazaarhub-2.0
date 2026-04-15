import React, { useState, useEffect, useCallback } from "react";
import { MapPin, X, Search, Navigation } from "lucide-react";
import { citiesByState, allCities } from "@/lib/cityUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ selectedCity, onCityChange }) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-city-selector", handler);
    return () => window.removeEventListener("open-city-selector", handler);
  }, []);

  const detectCity = useCallback(() => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district;
          if (city) {
            // Try to find exact match in our list
            const match = allCities.find(c => c.toLowerCase() === city.toLowerCase()) ||
                          allCities.find(c => city.toLowerCase().includes(c.toLowerCase()));
            if (match) {
              onCityChange(match);
              setOpen(false);
            } else {
              // Use detected name even if not in list
              onCityChange(city);
              setOpen(false);
            }
          }
        } catch {
          // Silently fail
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false),
      { timeout: 10000 }
    );
  }, [onCityChange]);

  // Only filter when 3+ chars typed
  const showResults = search.length >= 3;
  const filteredStates = showResults
    ? Object.entries(citiesByState).reduce<Record<string, string[]>>((acc, [state, cities]) => {
        const filtered = cities.filter(c => c.toLowerCase().includes(search.toLowerCase()));
        if (filtered.length) acc[state] = filtered;
        return acc;
      }, {})
    : {};

  // Show popular cities when no search
  const popularCities = ["Madurai", "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Pune", "Kochi", "Jaipur", "Ahmedabad", "Coimbatore"];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-pill border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent"
      >
        <MapPin className="h-4 w-4 text-primary" />
        <span>{selectedCity}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-4 w-full max-w-lg rounded-card border border-border bg-card p-6 shadow-card animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{t("selectCity")}</h2>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 transition-all duration-200 hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* GPS detect button */}
            <button
              onClick={detectCity}
              disabled={detecting}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-input border border-primary/30 bg-primary/5 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/10 disabled:opacity-60"
            >
              <Navigation className={`h-4 w-4 ${detecting ? "animate-spin" : ""}`} />
              {detecting ? "Detecting your location..." : "Auto-detect my city (GPS)"}
            </button>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type 3+ letters to search cities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-input border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>

            <div className="max-h-80 overflow-y-auto pr-1">
              {/* Search results */}
              {showResults && Object.entries(filteredStates).map(([state, cities]) => (
                <div key={state} className="mb-3">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{state}</p>
                  <div className="flex flex-wrap gap-2">
                    {cities.slice(0, 20).map(city => (
                      <button
                        key={city}
                        onClick={() => { onCityChange(city); setOpen(false); setSearch(""); }}
                        className={`rounded-pill px-3 py-1 text-sm font-medium transition-all duration-200 ${
                          selectedCity === city
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-background text-foreground hover:bg-accent"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {showResults && !Object.keys(filteredStates).length && (
                <p className="py-8 text-center text-sm text-muted-foreground">No cities found for "{search}"</p>
              )}

              {/* Popular cities when no search */}
              {!showResults && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Popular Cities</p>
                  <div className="flex flex-wrap gap-2">
                    {popularCities.map(city => (
                      <button
                        key={city}
                        onClick={() => { onCityChange(city); setOpen(false); setSearch(""); }}
                        className={`rounded-pill px-3 py-1 text-sm font-medium transition-all duration-200 ${
                          selectedCity === city
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-background text-foreground hover:bg-accent"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Type 3+ letters above to search 4000+ Indian cities
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CitySelector;
