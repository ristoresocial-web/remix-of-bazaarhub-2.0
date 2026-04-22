import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Globe, MapPin, Phone, MessageCircle, Navigation, Star,
  Trophy, ArrowDownUp, Shield, ShieldCheck, ShieldAlert, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import type { ComparisonResult, OnlineSeller, CityPartner } from "@/data/comparisonMockData";
import { allProducts } from "@/data/mockData";
import SmartFallbackPanel from "./SmartFallbackPanel";

interface ComparisonEngineProps {
  data: ComparisonResult;
  city: string;
}

type SortOnline = "price" | "rating";
type SortLocal = "price" | "distance" | "rating";

const TRUST_ICONS: Record<string, React.ElementType> = {
  trusted: ShieldCheck,
  established: Shield,
  new: ShieldAlert,
};

const TRUST_COLORS: Record<string, string> = {
  trusted: "text-success",
  established: "text-primary",
  new: "text-muted-foreground",
};

const INITIAL_VISIBLE = 3;

const ComparisonEngine: React.FC<ComparisonEngineProps> = ({ data, city }) => {
  const { isLoggedIn } = useAuth();
  const [sortOnline, setSortOnline] = useState<SortOnline>("price");
  const [sortLocal, setSortLocal] = useState<SortLocal>("price");
  const [showAllOnline, setShowAllOnline] = useState(false);
  const [showAllLocal, setShowAllLocal] = useState(false);

  const { product, onlineSellers, cityPartners, lowestOnlinePrice, lowestLocalPrice, priceDifference } = data;

  const absoluteLowest = Math.min(lowestOnlinePrice, lowestLocalPrice);
  const diff = Math.abs(priceDifference);
  const cheaperSide = priceDifference > 0 ? "local" : priceDifference < 0 ? "online" : "same";

  const sortedOnline = useMemo(() => {
    const arr = [...onlineSellers];
    if (sortOnline === "price") arr.sort((a, b) => a.price - b.price);
    else arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [onlineSellers, sortOnline]);

  const sortedLocal = useMemo(() => {
    const arr = [...cityPartners];
    if (sortLocal === "price") arr.sort((a, b) => a.price - b.price);
    else if (sortLocal === "distance") arr.sort((a, b) => a.distanceKm - b.distanceKm);
    else arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [cityPartners, sortLocal]);

  const handleGatedAction = (action: string) => {
    if (!isLoggedIn) {
      toast({ title: "Please sign in", description: `Sign in to ${action}` });
      return false;
    }
    return true;
  };

  const hasOnline = onlineSellers.length > 0;
  const hasLocal = cityPartners.length > 0;
  const isSingleSource = (hasOnline && !hasLocal) || (!hasOnline && hasLocal);

  // Match this comparison product to a real product entry by name (best effort) for fallback suggestions.
  const fallbackTarget = useMemo(() => {
    if (!isSingleSource) return null;
    const lowerName = product.name.toLowerCase();
    return (
      allProducts.find((p) => p.name.toLowerCase() === lowerName) ||
      allProducts.find((p) => p.brand.toLowerCase() === product.brand.toLowerCase()) ||
      null
    );
  }, [isSingleSource, product.name, product.brand]);

  return (
    <div className="space-y-6">
      {/* Availability status banner */}
      {hasOnline && hasLocal && (
        <div className="flex items-center justify-center gap-2 rounded-pill bg-bh-green-light border border-bh-green/30 px-4 py-2 text-center">
          <span className="text-sm font-bold text-bh-green-dark">
            ✓ Available Online & Nearby Store — Best Price guaranteed
          </span>
        </div>
      )}
      {isSingleSource && (
        <div className="flex items-center justify-center gap-2 rounded-pill bg-bh-orange-light border border-bh-orange/30 px-4 py-2 text-center">
          <span className="text-sm font-bold text-bh-orange-dark">
            {hasOnline ? "🌐 Available Online only — see alternatives below" : "🏪 Available at Nearby Stores only — see alternatives below"}
          </span>
        </div>
      )}

      {/* Product Header */}
      <div className="flex items-center gap-4 rounded-2xl border border-bh-border bg-bh-surface p-4 shadow-bh-sm">
        <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-contain bg-bh-surface-2" loading="lazy" />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-bh-text-muted">{product.brand}</p>
          <h2 className="notranslate font-display text-lg font-bold text-bh-text">{product.name}</h2>
          <div className="mt-1 flex flex-wrap gap-2">
            {product.specs.slice(0, 3).map((s) => (
              <Badge key={s.key} variant="secondary" className="text-[10px]">
                {s.key}: {s.value}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Split Screen with center savings pill */}
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-0 items-stretch">
        {/* Online column (left) */}
        <div className="rounded-3xl md:rounded-r-none border border-bh-blue/20 bg-bh-blue-light/40 p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="flex items-center gap-2 font-display text-sm sm:text-base font-bold text-bh-blue">
              🌐 Online Sellers
            </h3>
            <div className="flex items-center gap-1">
              <ArrowDownUp className="h-3 w-3 text-bh-text-muted" />
              <select
                value={sortOnline}
                onChange={(e) => setSortOnline(e.target.value as SortOnline)}
                className="rounded-md border border-bh-border bg-white px-2 py-1 text-xs"
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {(showAllOnline ? sortedOnline : sortedOnline.slice(0, INITIAL_VISIBLE)).map((seller) => (
            <OnlineSellerCard
              key={seller.platform}
              seller={seller}
              isLowest={seller.price === lowestOnlinePrice}
              isAbsoluteLowest={seller.price === absoluteLowest}
              city={city}
            />
          ))}
          {sortedOnline.length > INITIAL_VISIBLE && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllOnline((v) => !v)}
              className="w-full text-bh-blue hover:bg-bh-blue/10 text-xs"
            >
              {showAllOnline ? "Show less" : `Show all ${sortedOnline.length} sellers`}
            </Button>
          )}
        </div>

        {/* Center savings pill divider — the star */}
        {diff > 100 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex md:flex-col items-center justify-center md:px-2 md:-mx-px z-10"
          >
            <div className="bg-bh-orange text-white rounded-2xl px-4 py-3 shadow-price text-center whitespace-nowrap border-4 border-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Save</p>
              <p className="font-mono notranslate text-xl font-medium leading-tight">
                ₹{diff.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] font-semibold opacity-95">
                {cheaperSide === "local" ? "locally" : "online"}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center px-2">
            <div className="rounded-2xl border-2 border-dashed border-bh-border bg-white px-3 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-bh-text-muted">Same</p>
              <p className="font-mono text-xs text-bh-text-secondary">price</p>
            </div>
          </div>
        )}

        {/* Local column (right) */}
        <div className="rounded-3xl md:rounded-l-none border border-bh-green/20 bg-bh-green-light/40 p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="flex items-center gap-2 font-display text-sm sm:text-base font-bold text-bh-green-dark">
              🏪 {city} City Partners
            </h3>
            <div className="flex items-center gap-1">
              <ArrowDownUp className="h-3 w-3 text-bh-text-muted" />
              <select
                value={sortLocal}
                onChange={(e) => setSortLocal(e.target.value as SortLocal)}
                className="rounded-md border border-bh-border bg-white px-2 py-1 text-xs"
              >
                <option value="price">Price</option>
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {(showAllLocal ? sortedLocal : sortedLocal.slice(0, INITIAL_VISIBLE)).map((partner) => (
            <CityPartnerCard
              key={partner.id}
              partner={partner}
              isLowest={partner.price === lowestLocalPrice}
              isAbsoluteLowest={partner.price === absoluteLowest}
              city={city}
              isLoggedIn={isLoggedIn}
              onGatedAction={handleGatedAction}
            />
          ))}
          {sortedLocal.length > INITIAL_VISIBLE && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllLocal((v) => !v)}
              className="w-full text-bh-green-dark hover:bg-bh-green/10 text-xs"
            >
              {showAllLocal ? "Show less" : `Show all ${sortedLocal.length} sellers`}
            </Button>
          )}
        </div>
      </div>

      {/* Smart fallback for single-source products */}
      {isSingleSource && fallbackTarget && (
        <SmartFallbackPanel target={fallbackTarget} />
      )}
    </div>
  );
};

/* ── Online seller card ── */
function OnlineSellerCard({
  seller,
  isLowest,
  isAbsoluteLowest,
  city,
}: {
  seller: OnlineSeller;
  isLowest: boolean;
  isAbsoluteLowest: boolean;
  city: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-xl border bg-white p-3 transition-all ${
        isAbsoluteLowest ? "border-bh-orange ring-2 ring-bh-orange ring-offset-1 shadow-price" : "border-white hover:shadow-bh-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-bh-text" style={{ color: `hsl(${seller.color})` }}>
              {seller.platform}
            </span>
            {isAbsoluteLowest && (
              <Badge className="bg-bh-orange text-white text-[10px] gap-1 shadow-price">
                <Trophy className="h-3 w-3" /> 🏆 Best Deal
              </Badge>
            )}
            {isLowest && !isAbsoluteLowest && (
              <Badge variant="secondary" className="text-[10px] bg-bh-blue-light text-bh-blue border border-bh-blue/20">Best Online</Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-bh-text-muted">
            <Star className="h-3 w-3 fill-warning text-warning" /> {seller.rating} ({seller.reviewCount.toLocaleString("en-IN")})
          </div>
        </div>
        <div className="text-right">
          <p className={`notranslate font-mono text-lg font-medium price-animate ${isAbsoluteLowest ? "text-bh-orange-dark" : "text-bh-blue"}`}>
            ₹{seller.price.toLocaleString("en-IN")}
          </p>
          {isAbsoluteLowest && (
            <span className="inline-block mt-0.5 rounded-pill bg-success/15 text-success text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              ✓ Lowest Price
            </span>
          )}
          {!seller.inStock && <span className="block text-[10px] text-destructive">Out of stock</span>}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-bh-text-muted">
        <span>⚡ {seller.delivery}</span>
        <Button
          asChild
          size="sm"
          className="h-8 gap-1 text-[11px] bg-bh-orange hover:bg-bh-orange-dark text-white"
          disabled={!seller.inStock}
        >
          <a
            href={seller.url}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
          >
            Buy Now <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

/* ── City Partner card ── */
function CityPartnerCard({
  partner,
  isLowest,
  isAbsoluteLowest,
  city,
  isLoggedIn,
  onGatedAction,
}: {
  partner: CityPartner;
  isLowest: boolean;
  isAbsoluteLowest: boolean;
  city: string;
  isLoggedIn: boolean;
  onGatedAction: (action: string) => boolean;
}) {
  const TrustIcon = TRUST_ICONS[partner.trustLevel] || Shield;
  const trustColor = TRUST_COLORS[partner.trustLevel] || "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-xl border bg-white p-3 transition-all ${
        isAbsoluteLowest ? "border-bh-orange ring-2 ring-bh-orange ring-offset-1 shadow-price" : "border-white hover:shadow-bh-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-bh-text">{partner.shopName}</span>
            {isAbsoluteLowest && (
              <Badge className="bg-bh-orange text-white text-[10px] gap-1 shadow-price">
                <Trophy className="h-3 w-3" /> 🏆 Best Deal
              </Badge>
            )}
            {isLowest && !isAbsoluteLowest && (
              <Badge variant="secondary" className="text-[10px] bg-bh-green-light text-bh-green-dark border border-bh-green/20">Best Local</Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-bh-text-muted">
            <span className="flex items-center gap-1">
              <TrustIcon className={`h-3 w-3 ${trustColor}`} />
              {partner.trustLevel.charAt(0).toUpperCase() + partner.trustLevel.slice(1)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" /> {partner.rating}
            </span>
            <span>📍 {partner.distanceKm.toFixed(1)} km</span>
          </div>
        </div>
        <div className="text-right">
          <p className={`notranslate font-mono text-lg font-medium price-animate ${isAbsoluteLowest ? "text-bh-orange-dark" : "text-bh-green-dark"}`}>
            ₹{partner.price.toLocaleString("en-IN")}
          </p>
          {isAbsoluteLowest && (
            <span className="inline-block mt-0.5 rounded-pill bg-success/15 text-success text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              ✓ Lowest Price
            </span>
          )}
          {partner.inStock ? (
            <span className="block text-[10px] text-bh-green-dark font-bold">● In Stock</span>
          ) : (
            <span className="block text-[10px] text-destructive">Out of Stock</span>
          )}
        </div>
      </div>

      <p className="mt-1 text-[10px] text-bh-text-muted">{partner.address}</p>

      {/* Primary CTA — View Nearby Store */}
      <Button
        size="sm"
        className="mt-2 w-full h-8 gap-1 text-[11px] bg-bh-green-dark hover:bg-bh-green text-white"
        onClick={() => {
          if (!onGatedAction("view this nearby store")) return;
          window.open(partner.googleMapsUrl, "_blank", "noopener,noreferrer");
        }}
      >
        <Navigation className="h-3 w-3" /> View Nearby Store
      </Button>

      {/* Secondary contact buttons — gated */}
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-[10px]"
          onClick={() => {
            if (!onGatedAction("call this seller")) return;
            window.open(`tel:${partner.phone}`);
          }}
        >
          <Phone className="h-3 w-3" /> Call
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1 text-[10px] border-success/30 text-success hover:bg-success/10"
          onClick={() => {
            if (!onGatedAction("WhatsApp this seller")) return;
            window.open(`https://wa.me/91${partner.whatsapp}?text=${encodeURIComponent(`Hi, I found your shop on BazaarHub. Is ${""} available?`)}`);
          }}
        >
          <MessageCircle className="h-3 w-3" /> WhatsApp
        </Button>
      </div>
    </motion.div>
  );
}

export default ComparisonEngine;
