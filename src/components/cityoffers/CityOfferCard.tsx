import React, { useState } from "react";
import { MapPin, Phone, MessageCircle, Clock, Star, Calendar, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/cityUtils";
import { CityOffer, getOfferStatus, getDaysLeft } from "@/data/cityOffersData";

interface Props {
  offer: CityOffer;
}

const CityOfferCard: React.FC<Props> = ({ offer }) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const status = getOfferStatus(offer);
  const daysLeft = getDaysLeft(offer);
  const savingPercent = Math.round(((offer.originalPrice - offer.offerPrice) / offer.originalPrice) * 100);

  const startFmt = new Date(offer.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const endFmt = new Date(offer.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <div className="group relative overflow-hidden rounded-card border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary">
      {/* Photo carousel */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={offer.photos[photoIdx]}
          alt={offer.shopName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {offer.photos.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIdx((i) => (i - 1 + offer.photos.length) % offer.photos.length)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-foreground/60 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPhotoIdx((i) => (i + 1) % offer.photos.length)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-foreground/60 p-1 text-background opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {offer.photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${i === photoIdx ? "bg-primary-foreground" : "bg-primary-foreground/40"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Status badge */}
        <Badge className={`absolute left-2 top-2 gap-1 text-[10px] font-semibold ${status.color}`}>
          {status.emoji} {status.label}
        </Badge>

        {/* Savings badge */}
        <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground text-[10px] font-bold">
          Save {savingPercent}%
        </Badge>
      </div>

      {/* Content */}
      <div className="space-y-2.5 p-4">
        {/* Shop header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground">{offer.shopName}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{offer.address}</span>
            </p>
          </div>
          <div className="flex items-center gap-0.5 text-xs text-warning-foreground">
            <Star className="h-3 w-3 fill-current" />
            {offer.rating} <span className="text-muted-foreground">({offer.reviewCount})</span>
          </div>
        </div>

        {/* Distance & dates */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Navigation className="h-3 w-3" /> {offer.distance} km
          </span>
          <span className="flex items-center gap-0.5">
            <Calendar className="h-3 w-3" /> {startFmt} – {endFmt}
          </span>
          {status.key !== "upcoming" && daysLeft > 0 && (
            <span className={`flex items-center gap-0.5 font-medium ${daysLeft <= 1 ? "text-destructive" : "text-success"}`}>
              <Clock className="h-3 w-3" /> {daysLeft}d left
            </span>
          )}
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-foreground/80">
          {offer.productDescription}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-success">{formatPrice(offer.offerPrice)}</span>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(offer.originalPrice)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href={offer.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1 rounded-pill border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <MapPin className="h-3 w-3" /> Directions
          </a>
          <a
            href={`tel:${offer.contactPhone}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-primary py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-3 w-3" /> Call
          </a>
          <a
            href={`https://wa.me/91${offer.contactWhatsapp}?text=${encodeURIComponent(`Vanakkam! Bazaar Hub-il ungal "${offer.shopName}" offer patthi parthen.`)}`}
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

export default CityOfferCard;
