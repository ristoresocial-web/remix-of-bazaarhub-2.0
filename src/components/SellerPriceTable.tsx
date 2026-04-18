import React from "react";
import { ExternalLink, MapPin, Phone, MessageCircle, Star, Truck, Crown } from "lucide-react";
import { formatPrice, getDistance, getTimestamp } from "@/lib/cityUtils";
import AffiliateDisclaimer from "./AffiliateDisclaimer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import type { PriceEntry } from "@/data/mockData";

interface CityPartnerEntry {
  name: string;
  price: number;
  km: number;
  address: string;
  phone: string;
  rating: number;
  photo: string;
  holiday: boolean;
  holidayUntil: string;
  inStock?: boolean;
}

interface SellerPriceTableProps {
  onlinePrices: PriceEntry[];
  cityPartners: CityPartnerEntry[];
  city: string;
  productName: string;
  lastRefreshed: string;
  onReport: () => void;
}

const SellerPriceTable: React.FC<SellerPriceTableProps> = ({
  onlinePrices,
  cityPartners,
  city,
  productName,
  lastRefreshed,
  onReport,
}) => {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const timestamp = getTimestamp();

  const sortedOnline = [...onlinePrices].filter((p) => p.inStock).sort((a, b) => a.price - b.price);
  const sortedPartners = [...cityPartners].filter((p) => p.inStock !== false).sort((a, b) => a.price - b.price);

  const allPrices = [
    ...sortedOnline.map((p) => p.price),
    ...sortedPartners.map((p) => p.price),
  ];
  const cheapestOverall = Math.min(...allPrices);

  const waMessage = encodeURIComponent(
    `Vanakkam! Bazaar Hub-il ungal ${productName} patthi parthen`
  );

  return (
    <div className="space-y-6">
      {/* Online Sellers */}
      <div className="rounded-2xl border border-bh-blue/20 bg-bh-blue-light/30 shadow-bh-sm overflow-hidden">
        <div className="bg-bh-blue-light px-4 py-3 border-b border-bh-blue/20">
          <h3 className="text-sm font-display font-bold text-bh-blue flex items-center gap-2">
            🌐 <Truck className="h-4 w-4" /> Online Sellers
          </h3>
        </div>
        <div className="divide-y divide-border">
          {sortedOnline.map((entry) => {
            const isCheapest = entry.price === cheapestOverall;
            return (
              <div
                key={entry.platform}
                className={`flex items-center gap-3 p-3 transition-all duration-200 bg-white/70 ${
                  isCheapest ? "ring-2 ring-bh-orange ring-inset bg-bh-orange-light/40" : "hover:bg-white"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="notranslate text-sm font-display font-bold text-bh-text">
                      {entry.platform}
                    </span>
                    {isCheapest && (
                      <span className="rounded-full bg-bh-orange px-2 py-0.5 text-[10px] font-bold text-white shadow-price flex items-center gap-0.5">
                        <Crown className="h-2.5 w-2.5" /> Best Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-bh-text-muted flex items-center gap-0.5">
                      <Truck className="h-2.5 w-2.5" /> 2-4 days
                    </span>
                    <span className="text-[10px] text-bh-text-muted flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-warning text-warning" /> 4.3
                    </span>
                  </div>
                  {entry.isAffiliate && (
                    <p className="text-[10px] text-bh-text-muted mt-0.5">
                      {entry.platform.toLowerCase().includes("amazon")
                        ? `as of ${timestamp} · Amazon Associate link`
                        : "Affiliate link · Commission earned"}
                    </p>
                  )}
                </div>
                <p
                  className={`notranslate font-mono text-lg font-medium whitespace-nowrap price-animate ${
                    isCheapest ? "text-bh-orange-dark" : "text-bh-blue"
                  }`}
                >
                  {formatPrice(entry.price)}
                </p>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="flex items-center gap-1 rounded-full bg-bh-orange px-3 py-1.5 text-xs font-bold text-white shadow-price transition-all duration-200 hover:bg-bh-orange-dark hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap"
                >
                  Buy <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
          {sortedOnline.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              No online sellers available right now
            </p>
          )}
        </div>
      </div>

      {/* City Partners */}
      <div className="rounded-2xl border border-bh-green/20 bg-bh-green-light/30 shadow-bh-sm overflow-hidden">
        <div className="bg-bh-green-light px-4 py-3 border-b border-bh-green/20">
          <h3 className="text-sm font-display font-bold text-bh-green-dark flex items-center gap-2">
            🏪 {city} City Partners
          </h3>
        </div>
        <div className="divide-y divide-border">
          {sortedPartners.map((partner, idx) => {
            const isCheapest = partner.price === cheapestOverall;
            return (
              <div
                key={partner.name}
                className={`p-3 bg-white/70 transition-all duration-200 ${
                  isCheapest ? "ring-2 ring-bh-orange ring-inset bg-bh-orange-light/40" : "hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{partner.photo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-display font-bold text-bh-text">
                        {partner.name}
                      </span>
                      {isCheapest && (
                        <span className="rounded-full bg-bh-orange px-2 py-0.5 text-[10px] font-bold text-white shadow-price flex items-center gap-0.5">
                          <Crown className="h-2.5 w-2.5" /> Best Price
                        </span>
                      )}
                      {idx === 0 && !isCheapest && (
                        <span className="rounded-full bg-bh-green-light text-bh-green-dark border border-bh-green/20 px-2 py-0.5 text-[10px] font-bold">
                          City Best
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-bh-text-muted flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-warning text-warning" /> {partner.rating}
                      </span>
                      <span className="text-[10px] text-bh-text-muted flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" /> {getDistance(partner.km)}
                      </span>
                      <span className="text-[10px] text-bh-green-dark font-bold">● In Stock</span>
                    </div>
                  </div>
                  <p
                    className={`notranslate font-mono text-lg font-medium whitespace-nowrap price-animate ${
                      isCheapest ? "text-bh-orange-dark" : "text-bh-green-dark"
                    }`}
                  >
                    {formatPrice(partner.price)}
                  </p>
                </div>

                {/* Contact buttons */}
                <div className="mt-2 pl-10">
                  {partner.holiday ? (
                    <p className="text-xs text-muted-foreground">
                      🏖️ Shop on holiday until {partner.holidayUntil}
                    </p>
                  ) : isLoggedIn ? (
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/91${partner.phone}?text=${waMessage}`}
                        target="_blank"
                        rel="nofollow sponsored noopener"
                        className="flex items-center gap-1 rounded-pill bg-[#25D366] px-3 py-1 text-[11px] font-semibold text-white transition-all duration-200 hover:opacity-90"
                      >
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </a>
                      <a
                        href={`tel:+91${partner.phone}`}
                        className="flex items-center gap-1 rounded-pill bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground transition-all duration-200 hover:opacity-90"
                      >
                        <Phone className="h-3 w-3" /> Call
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(partner.address)}`}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1 rounded-pill border border-border px-3 py-1 text-[11px] font-semibold text-foreground transition-all duration-200 hover:bg-accent"
                      >
                        <MapPin className="h-3 w-3" /> Map
                      </a>
                    </div>
                  ) : (
                    <Link
                      to="/buyer/login"
                      className="inline-flex items-center gap-1 rounded-pill bg-primary px-4 py-1 text-[11px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
                    >
                      <Phone className="h-3 w-3" /> Login to see contact
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          {sortedPartners.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No city partners available in {city} yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Check online sellers above for the best price
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Prices last updated: {lastRefreshed}</span>
        <button
          onClick={onReport}
          className="text-primary transition-all duration-200 hover:underline"
        >
          Report incorrect price
        </button>
      </div>
      <AffiliateDisclaimer />
    </div>
  );
};

export default SellerPriceTable;
