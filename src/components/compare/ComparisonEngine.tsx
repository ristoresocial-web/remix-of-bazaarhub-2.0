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

const ComparisonEngine: React.FC<ComparisonEngineProps> = ({ data, city }) => {
  const { isLoggedIn } = useAuth();
  const [sortOnline, setSortOnline] = useState<SortOnline>("price");
  const [sortLocal, setSortLocal] = useState<SortLocal>("price");

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

  return (
    <div className="space-y-4">
      {/* Product Header */}
      <div className="flex items-center gap-4 rounded-card border border-border bg-card p-4">
        <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-contain bg-background" loading="lazy" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">{product.brand}</p>
          <h2 className="notranslate text-lg font-bold text-foreground">{product.name}</h2>
          <div className="mt-1 flex flex-wrap gap-2">
            {product.specs.slice(0, 3).map((s) => (
              <Badge key={s.key} variant="secondary" className="text-[10px]">
                {s.key}: {s.value}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Price Difference Banner */}
      {diff > 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-card border p-4 text-center ${
            cheaperSide === "local"
              ? "border-success/30 bg-success/10"
              : "border-primary/30 bg-primary/10"
          }`}
        >
          <p className="text-lg font-bold">
            💰 ₹{diff.toLocaleString("en-IN")} cheaper {cheaperSide === "local" ? `locally` : "online"}
          </p>
          <p className="text-sm text-muted-foreground">
            {cheaperSide === "local"
              ? `at ${data.lowestCityPartner}, ${city}`
              : `on ${data.lowestOnlinePlatform} with delivery`}
          </p>
        </motion.div>
      )}

      {/* Split Screen */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Online Sellers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Globe className="h-4 w-4" /> Online Sellers
            </h3>
            <div className="flex items-center gap-1">
              <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
              <select
                value={sortOnline}
                onChange={(e) => setSortOnline(e.target.value as SortOnline)}
                className="rounded border border-border bg-card px-2 py-1 text-xs"
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {sortedOnline.map((seller) => (
            <OnlineSellerCard
              key={seller.platform}
              seller={seller}
              isLowest={seller.price === lowestOnlinePrice}
              isAbsoluteLowest={seller.price === absoluteLowest}
              city={city}
            />
          ))}
        </div>

        {/* Local Sellers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <MapPin className="h-4 w-4" /> {city} City Partners
            </h3>
            <div className="flex items-center gap-1">
              <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
              <select
                value={sortLocal}
                onChange={(e) => setSortLocal(e.target.value as SortLocal)}
                className="rounded border border-border bg-card px-2 py-1 text-xs"
              >
                <option value="price">Price</option>
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {sortedLocal.map((partner) => (
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
        </div>
      </div>
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
      className={`rounded-card border bg-card p-3 transition-all ${
        isAbsoluteLowest ? "border-success shadow-md" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground" style={{ color: `hsl(${seller.color})` }}>
              {seller.platform}
            </span>
            {isAbsoluteLowest && (
              <Badge className="bg-success text-success-foreground text-[10px] gap-1">
                <Trophy className="h-3 w-3" /> Lowest Price in {city}
              </Badge>
            )}
            {isLowest && !isAbsoluteLowest && (
              <Badge variant="secondary" className="text-[10px]">Best Online</Badge>

            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" /> {seller.rating} ({seller.reviewCount.toLocaleString("en-IN")})
          </div>
        </div>
        <div className="text-right">
          <p className="notranslate text-lg font-bold text-foreground">₹{seller.price.toLocaleString("en-IN")}</p>
          {!seller.inStock && <span className="text-[10px] text-destructive">Out of stock</span>}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>⚡ Delivery: {seller.delivery}</span>
        <a
          href={seller.url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
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
      className={`rounded-card border bg-card p-3 transition-all ${
        isAbsoluteLowest ? "border-success shadow-md" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{partner.shopName}</span>
            {isAbsoluteLowest && (
              <Badge className="bg-success text-success-foreground text-[10px] gap-1">
                <Trophy className="h-3 w-3" /> Lowest Price in {city}
              </Badge>
            )}
            {isLowest && !isAbsoluteLowest && (
              <Badge variant="secondary" className="text-[10px]">Best City Partner</Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <TrustIcon className={`h-3 w-3 ${trustColor}`} />
              {partner.trustLevel.charAt(0).toUpperCase() + partner.trustLevel.slice(1)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" /> {partner.rating}
            </span>
            <span>📍 {partner.distanceKm.toFixed(1)} km</span>
          </div>
        </div>
        <div className="text-right">
          <p className="notranslate text-lg font-bold text-foreground">₹{partner.price.toLocaleString("en-IN")}</p>
          {partner.inStock ? (
            <span className="text-[10px] text-success">🟢 In Stock</span>
          ) : (
            <span className="text-[10px] text-destructive">Out of Stock</span>
          )}
        </div>
      </div>

      <p className="mt-1 text-[10px] text-muted-foreground">{partner.address}</p>

      {/* Contact buttons — gated */}
      <div className="mt-2 flex items-center gap-2">
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
        <Button
          size="sm"
          variant="ghost"
          className="h-7 gap-1 text-[10px]"
          onClick={() => {
            if (!onGatedAction("get directions")) return;
            window.open(partner.googleMapsUrl);
          }}
        >
          <Navigation className="h-3 w-3" /> Directions
        </Button>
      </div>
    </motion.div>
  );
}

export default ComparisonEngine;
