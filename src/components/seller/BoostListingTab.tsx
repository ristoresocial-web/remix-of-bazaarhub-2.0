import React, { useState } from "react";
import { Rocket, CheckCircle, Tag, CreditCard, Sparkles } from "lucide-react";
import { getCitySlotAvailability, TIER_CONFIG, validatePromoCode, type AdTier } from "@/data/adSlotsData";
import { formatPrice } from "@/lib/cityUtils";

const BoostListingTab: React.FC<{ city: string }> = ({ city }) => {
  const availability = getCitySlotAvailability(city);
  const [selectedTier, setSelectedTier] = useState<AdTier | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ valid: boolean; discount: number; error?: string } | null>(null);
  const [purchased, setPurchased] = useState(false);

  const handleApplyPromo = () => {
    if (!promoCode || !selectedTier) return;
    setPromoResult(validatePromoCode(promoCode, selectedTier, "current-seller"));
  };

  const handlePurchase = () => {
    setPurchased(true);
    setTimeout(() => setPurchased(false), 3000);
  };

  const finalPrice = (tier: AdTier) => {
    const base = TIER_CONFIG[tier].price;
    if (promoResult?.valid && selectedTier === tier) return base * (1 - promoResult.discount / 100);
    return base;
  };

  const inputClass = "w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Rocket className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Boost My Listing</h2>
          <p className="text-xs text-muted-foreground">Get featured on the {city} homepage and attract more buyers</p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {(["gold", "silver", "bronze"] as AdTier[]).map(tier => {
          const cfg = TIER_CONFIG[tier];
          const avail = availability[tier];
          const isSelected = selectedTier === tier;

          return (
            <button
              key={tier}
              onClick={() => { setSelectedTier(tier); setPromoResult(null); setPromoCode(""); }}
              disabled={avail.available === 0}
              className={`rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                isSelected ? `${cfg.borderColor} ${cfg.bgColor} shadow-card` : "border-border bg-card hover:border-muted-foreground/30"
              } ${avail.available === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-pill px-3 py-1 text-xs font-bold ${cfg.badgeColor}`}>{cfg.badge} {tier.toUpperCase()}</span>
                {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
              </div>
              <p className="mb-1 text-2xl font-bold text-foreground">{formatPrice(cfg.price)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="mb-2 text-xs text-muted-foreground">Slots {cfg.slotRange} · {cfg.label} badge</p>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-1.5">
                <span className="text-[10px] text-muted-foreground">Available</span>
                <span className={`text-sm font-bold ${avail.available > 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                  {avail.available}/{avail.total}
                </span>
              </div>
              {tier === "gold" && <p className="mt-2 text-[10px] text-muted-foreground">Large card with banner image, WhatsApp button, distance badge</p>}
              {tier === "silver" && <p className="mt-2 text-[10px] text-muted-foreground">Medium card with category, rating, top product price</p>}
              {tier === "bronze" && <p className="mt-2 text-[10px] text-muted-foreground">Compact listing with shop name + product highlight</p>}
            </button>
          );
        })}
      </div>

      {/* Promo + Payment */}
      {selectedTier && availability[selectedTier].available > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Have a promo code?</h3>
          <div className="flex gap-2">
            <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code e.g. GOLD50" className={`${inputClass} flex-1`} />
            <button onClick={handleApplyPromo} disabled={!promoCode} className="rounded-pill bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">Apply</button>
          </div>
          {promoResult && (
            <p className={`text-xs font-medium ${promoResult.valid ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
              {promoResult.valid ? `✓ ${promoResult.discount}% discount applied!` : promoResult.error}
            </p>
          )}

          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{selectedTier.toUpperCase()} Slot — 1 month</span>
              <span className="text-sm text-muted-foreground">{formatPrice(TIER_CONFIG[selectedTier].price)}</span>
            </div>
            {promoResult?.valid && (
              <div className="flex items-center justify-between mb-2 text-[hsl(var(--success))]">
                <span className="text-sm">Promo discount ({promoResult.discount}%)</span>
                <span className="text-sm">-{formatPrice(TIER_CONFIG[selectedTier].price * promoResult.discount / 100)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(finalPrice(selectedTier))}</span>
            </div>
          </div>

          <button onClick={handlePurchase} className="flex w-full items-center justify-center gap-2 rounded-pill bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))]">
            {purchased ? <><Sparkles className="h-4 w-4" /> Slot Reserved!</> : <><CreditCard className="h-4 w-4" /> Pay {formatPrice(finalPrice(selectedTier))}</>}
          </button>
          <p className="text-center text-[10px] text-muted-foreground">Payment integration coming soon. Slot will be activated after verification.</p>
        </div>
      )}
    </div>
  );
};

export default BoostListingTab;
