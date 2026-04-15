import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, MessageCircle, ChevronRight } from "lucide-react";
import { getFeaturedSellers, BANNER_SLOT_CONFIGS, type BannerBooking } from "@/data/bannerSlotsData";
import { formatPrice } from "@/lib/cityUtils";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  city: string;
}

const GoldCard: React.FC<{ slot: BannerBooking }> = ({ slot }) => {
  const { isLoggedIn } = useAuth();
  const cfg = BANNER_SLOT_CONFIGS["featured-gold"];
  const waUrl = `https://wa.me/91${slot.phone}?text=${encodeURIComponent(`Hi, I saw your ad on BazaarHub for ${slot.topProduct}. Is it available?`)}`;

  return (
    <div className={`rounded-2xl border-2 ${cfg.borderColor} ${cfg.bgColor} overflow-hidden shadow-card transition-all duration-200 hover:shadow-hover`}>
      {slot.bannerImage && (
        <div className="relative h-32 w-full overflow-hidden">
          <img src={slot.bannerImage} alt={slot.shopName} className="h-full w-full object-cover" loading="lazy" />
          <span className={`absolute left-3 top-3 rounded-pill px-3 py-1 text-[10px] font-bold ${cfg.badgeColor}`}>
            {cfg.badge} Sponsored
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">{slot.shopName}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-warning text-warning" /> {slot.rating}
          </div>
        </div>
        {slot.topProduct && <p className="mb-1 text-xs text-muted-foreground">{slot.topProduct}</p>}
        {slot.topProductPrice && <p className="mb-3 text-lg font-bold text-primary">{formatPrice(slot.topProductPrice)}</p>}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> {slot.address.split(",")[0]}
          </span>
          {isLoggedIn ? (
            <a href={waUrl} target="_blank" rel="nofollow noopener"
              className="flex items-center gap-1 rounded-pill bg-[#25D366] px-3 py-1.5 text-[11px] font-semibold text-white transition-all duration-200 hover:opacity-90">
              <MessageCircle className="h-3 w-3" /> WhatsApp
            </a>
          ) : (
            <Link to="/buyer/login" className="flex items-center gap-1 rounded-pill bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
              Login to contact
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const SilverCard: React.FC<{ slot: BannerBooking }> = ({ slot }) => {
  const cfg = BANNER_SLOT_CONFIGS["featured-silver"];
  return (
    <div className={`rounded-xl border ${cfg.borderColor} ${cfg.bgColor} p-4 shadow-card transition-all duration-200 hover:shadow-hover`}>
      <div className="mb-2 flex items-center justify-between">
        <span className={`rounded-pill px-2 py-0.5 text-[9px] font-bold ${cfg.badgeColor}`}>{cfg.badge} Sponsored</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" /> {slot.rating}
        </div>
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{slot.shopName}</h3>
      {slot.topProductPrice && <p className="text-base font-bold text-primary">{formatPrice(slot.topProductPrice)}</p>}
      {slot.topProduct && <p className="mt-1 text-[10px] text-muted-foreground">{slot.topProduct}</p>}
    </div>
  );
};

const BronzeCard: React.FC<{ slot: BannerBooking }> = ({ slot }) => {
  const cfg = BANNER_SLOT_CONFIGS["featured-bronze"];
  return (
    <div className={`rounded-lg border ${cfg.borderColor} ${cfg.bgColor} px-3 py-2.5 transition-all duration-200 hover:shadow-card`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`shrink-0 rounded-pill px-2 py-0.5 text-[8px] font-bold ${cfg.badgeColor}`}>{cfg.badge}</span>
            <h3 className="truncate text-xs font-semibold text-foreground">{slot.shopName}</h3>
            <span className="text-[8px] text-muted-foreground">Sponsored</span>
          </div>
          {slot.topProduct && (
            <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
              {slot.topProduct}{slot.topProductPrice ? ` — ${formatPrice(slot.topProductPrice)}` : ""}
            </p>
          )}
        </div>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </div>
    </div>
  );
};

const FeaturedSellers: React.FC<Props> = ({ city }) => {
  const slots = getFeaturedSellers(city);
  if (slots.length === 0) return null;

  const goldSlots = slots.filter(s => s.slotType === "featured-gold");
  const silverSlots = slots.filter(s => s.slotType === "featured-silver");
  const bronzeSlots = slots.filter(s => s.slotType === "featured-bronze");

  return (
    <section className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Featured Sellers in {city}</h2>
          <p className="text-xs text-muted-foreground">Trusted city partners with great deals</p>
        </div>
        <Link to="/find-sellers" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {goldSlots.length > 0 && (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {goldSlots.map(s => <GoldCard key={s.id} slot={s} />)}
        </div>
      )}

      {silverSlots.length > 0 && (
        <div className="mb-4 grid gap-3 grid-cols-2 md:grid-cols-4">
          {silverSlots.map(s => <SilverCard key={s.id} slot={s} />)}
        </div>
      )}

      {bronzeSlots.length > 0 && (
        <div className="space-y-2">
          {bronzeSlots.map(s => <BronzeCard key={s.id} slot={s} />)}
        </div>
      )}
    </section>
  );
};

export default FeaturedSellers;
