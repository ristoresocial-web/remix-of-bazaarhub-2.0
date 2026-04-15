import React, { useState } from "react";
import { MapPin, MessageCircle, Star, Calendar, Navigation, ChevronLeft, ChevronRight, Crown, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FoodStall, getFoodStallStatus } from "@/data/foodFestivalData";

interface Props {
  stall: FoodStall;
}

const FoodStallCard: React.FC<Props> = ({ stall }) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const status = getFoodStallStatus(stall);

  const startFmt = new Date(stall.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const endFmt = new Date(stall.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div className="group relative overflow-hidden rounded-card border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary">
      {/* City Pick crown */}
      {stall.isCityPick && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-pill bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
          <Crown className="h-3 w-3" /> City Pick
        </div>
      )}

      {/* Photo carousel */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={stall.photos[photoIdx]}
          alt={stall.stallName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {stall.photos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIdx((i) => (i - 1 + stall.photos.length) % stall.photos.length)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-foreground/60 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPhotoIdx((i) => (i + 1) % stall.photos.length)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-foreground/60 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {stall.photos.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === photoIdx ? "bg-primary-foreground" : "bg-primary-foreground/40"}`} />
              ))}
            </div>
          </>
        )}

        {/* Status badge */}
        <Badge className={`absolute left-2 top-2 gap-1 text-[10px] font-semibold ${status.color}`}>
          {status.emoji} {status.label}
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground">{stall.stallName}</h3>
            {stall.ownerName && (
              <p className="text-xs text-muted-foreground">by {stall.ownerName}</p>
            )}
          </div>
          <div className="flex items-center gap-0.5 text-xs text-warning-foreground">
            <Star className="h-3 w-3 fill-current" />
            {stall.rating} <span className="text-muted-foreground">({stall.reviewCount})</span>
          </div>
        </div>

        {/* Cuisine + Festival */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <UtensilsCrossed className="h-2.5 w-2.5" /> {stall.cuisineType}
          </Badge>
          {stall.festivalName && (
            <Badge variant="outline" className="gap-1 text-[10px] border-amber-300 text-amber-700 bg-amber-50">
              🎪 {stall.festivalName}
            </Badge>
          )}
        </div>

        {/* Location + dates */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Navigation className="h-3 w-3" /> {stall.distance} km
          </span>
          <span className="flex items-center gap-0.5">
            <Calendar className="h-3 w-3" /> {startFmt} – {endFmt}
          </span>
        </div>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{stall.address}</span>
        </p>

        {/* Today's Menu */}
        <div className="rounded-lg bg-muted/50 p-2.5">
          <p className="mb-1 text-[10px] font-semibold text-foreground uppercase tracking-wider">Today's Menu</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{stall.todaysMenu}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={stall.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-pill border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <MapPin className="h-3 w-3" /> Directions
          </a>
          <a
            href={`https://wa.me/91${stall.whatsappNumber}?text=${encodeURIComponent(`Hi! I saw your stall "${stall.stallName}" on BazaarHub. Is the stall open now?`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-success py-2 text-xs font-semibold text-success-foreground transition-colors hover:bg-success/90"
          >
            <MessageCircle className="h-3 w-3" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default FoodStallCard;
