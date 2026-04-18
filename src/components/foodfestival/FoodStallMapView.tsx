import React, { useState } from "react";
import { MapPin, Star, Navigation, MessageCircle, Crown, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FoodStall, getFoodStallStatus } from "@/data/foodFestivalData";
import { useMapsKey } from "@/lib/googleMapsKey";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  stalls: FoodStall[];
  city: string;
}

const FoodStallMapView: React.FC<Props> = ({ stalls, city }) => {
  const [selected, setSelected] = useState<FoodStall | null>(null);
  const { key: mapsKey, loading: keyLoading } = useMapsKey();

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Map */}
      <div className="relative h-[400px] flex-1 overflow-hidden rounded-card border border-border bg-muted lg:h-[600px]">
        {keyLoading || !mapsKey ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <iframe
            src={`https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=food+stalls+in+${encodeURIComponent(city)}&zoom=13`}
            className="h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            title={`Food stalls map in ${city}`}
          />
        )}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 rounded-card bg-card/95 p-2 shadow-card backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-foreground">🍽️ {stalls.length} food stalls</span>
          <div className="flex gap-2 text-[10px] text-muted-foreground">
            <span>🟢 Live</span>
            <span>🟠 Today Only</span>
            <span>⭐ Festival</span>
          </div>
        </div>
      </div>

      {/* Sidebar listing */}
      <div className="w-full space-y-2 lg:w-80">
        <h3 className="text-sm font-semibold text-foreground">All Stalls</h3>
        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {stalls.map((stall) => {
            const status = getFoodStallStatus(stall);
            const active = selected?.id === stall.id;

            return (
              <button
                key={stall.id}
                onClick={() => setSelected(active ? null : stall)}
                className={`w-full rounded-card border p-3 text-left transition-all duration-200 ${
                  active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      {stall.isCityPick && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
                      <p className="truncate text-sm font-semibold text-foreground">{stall.stallName}</p>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <UtensilsCrossed className="h-2.5 w-2.5" /> {stall.cuisineType}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Navigation className="h-3 w-3" /> {stall.distance} km
                      </span>
                    </div>
                  </div>
                  <Badge className={`shrink-0 text-[10px] ${status.color}`}>
                    {status.emoji} {status.label}
                  </Badge>
                </div>

                <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{stall.todaysMenu}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-warning" /> {stall.rating}
                  </div>
                </div>

                {active && (
                  <div className="mt-3 flex gap-2 border-t border-border pt-3">
                    <a
                      href={stall.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-1 items-center justify-center gap-1 rounded-pill border border-border py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                    >
                      <MapPin className="h-3 w-3" /> Map
                    </a>
                    <a
                      href={`https://wa.me/91${stall.whatsappNumber}?text=${encodeURIComponent(`Hi! I saw "${stall.stallName}" on BazaarHub.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-success py-1.5 text-xs font-medium text-success-foreground"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoodStallMapView;
