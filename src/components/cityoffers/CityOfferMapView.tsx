import React from "react";
import { MapPin, Phone, Star, Clock, Navigation, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/cityUtils";
import { CityOffer, getOfferStatus, getDaysLeft } from "@/data/cityOffersData";

interface Props {
  offers: CityOffer[];
  city: string;
}

const CityOfferMapView: React.FC<Props> = ({ offers, city }) => {
  const [selectedOffer, setSelectedOffer] = React.useState<CityOffer | null>(null);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Map embed */}
      <div className="relative h-[400px] flex-1 overflow-hidden rounded-card border border-border bg-muted lg:h-[600px]">
        <iframe
          src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=shops+in+${encodeURIComponent(city)}&zoom=13`}
          className="h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          title={`Map of pop-up shops in ${city}`}
        />

        {/* Pin overlay legend */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1 rounded-card bg-card/95 p-2 shadow-card backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-foreground">📍 {offers.length} locations</span>
          <div className="flex gap-2 text-[10px] text-muted-foreground">
            <span>🟢 Live</span>
            <span>🟡 Ending</span>
            <span>🔵 Upcoming</span>
          </div>
        </div>
      </div>

      {/* Sidebar listing */}
      <div className="w-full space-y-2 lg:w-80">
        <h3 className="text-sm font-semibold text-foreground">All Locations</h3>
        <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
          {offers.map((offer) => {
            const status = getOfferStatus(offer);
            const daysLeft = getDaysLeft(offer);
            const active = selectedOffer?.id === offer.id;

            return (
              <button
                key={offer.id}
                onClick={() => setSelectedOffer(active ? null : offer)}
                className={`w-full rounded-card border p-3 text-left transition-all duration-200 ${
                  active ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{offer.shopName}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Navigation className="h-3 w-3 shrink-0" /> {offer.distance} km
                    </p>
                  </div>
                  <Badge className={`shrink-0 text-[10px] ${status.color}`}>
                    {status.emoji} {status.label}
                  </Badge>
                </div>

                <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{offer.productDescription}</p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-success">{formatPrice(offer.offerPrice)}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-warning" /> {offer.rating}
                    {daysLeft > 0 && status.key !== "upcoming" && (
                      <span className="ml-1">• {daysLeft}d left</span>
                    )}
                  </div>
                </div>

                {active && (
                  <div className="mt-3 flex gap-2 border-t border-border pt-3">
                    <a
                      href={offer.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-1 items-center justify-center gap-1 rounded-pill border border-border py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                    >
                      <MapPin className="h-3 w-3" /> Map
                    </a>
                    <a
                      href={`tel:${offer.contactPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-1 items-center justify-center gap-1 rounded-pill bg-primary py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      <Phone className="h-3 w-3" /> Call
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

export default CityOfferMapView;
