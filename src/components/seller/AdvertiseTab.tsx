import React, { useState } from "react";
import { Megaphone, CheckCircle, Tag, CreditCard, Image, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BANNER_SLOT_CONFIGS, getCityBannerAvailability, validateBannerPromo,
  bookBannerSlot, type BannerSlotType,
} from "@/data/bannerSlotsData";
import { formatPrice } from "@/lib/cityUtils";

const CATEGORIES = ["Mobiles", "TVs", "Laptops", "Refrigerators", "Washing Machines", "ACs", "Electronics", "Home & Kitchen"];

const AdvertiseTab: React.FC<{ city: string }> = ({ city }) => {
  const availability = getCityBannerAvailability(city);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedType, setSelectedType] = useState<BannerSlotType | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<{ valid: boolean; discount: number; error?: string } | null>(null);
  const [form, setForm] = useState({
    bannerImage: "",
    category: "",
    topProduct: "",
    topProductPrice: "",
    shopName: "My Electronics Store",
    phone: "9876543210",
    address: "Main Road, " + city,
  });
  const [booked, setBooked] = useState(false);

  const config = selectedType ? BANNER_SLOT_CONFIGS[selectedType] : null;
  const basePrice = config?.pricePerMonth || 0;
  const discount = promoResult?.valid ? promoResult.discount : 0;
  const finalPrice = basePrice * (1 - discount / 100);

  const handleApplyPromo = () => {
    if (!promoCode || !selectedType) return;
    const result = validateBannerPromo(promoCode, city, selectedType, "current-seller");
    setPromoResult(result);
    if (result.valid) {
      toast.success(`Promo applied! ${result.discount}% off`);
    } else {
      toast.error(result.error);
    }
  };

  const handleBook = () => {
    if (!selectedType || !config) return;
    bookBannerSlot({
      slotType: selectedType,
      city,
      sellerId: "current-seller",
      shopName: form.shopName,
      bannerImage: form.bannerImage,
      category: form.category || undefined,
      topProduct: form.topProduct || undefined,
      topProductPrice: form.topProductPrice ? parseInt(form.topProductPrice) : undefined,
      phone: form.phone,
      address: form.address,
      rating: 4.5,
      active: false,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      amountPaid: finalPrice,
      promoCode: promoResult?.valid ? promoCode : undefined,
      autoRenew: true,
    });
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="rounded-card border border-border bg-card p-8 text-center shadow-card space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Booking Submitted!</h2>
        <p className="text-sm text-muted-foreground">
          Your {config?.label} slot in {city} will go live within 2 hours after admin review.
        </p>
        <p className="text-xs text-muted-foreground">Amount paid: {formatPrice(finalPrice)} · Auto-renewal: Monthly</p>
        <p className="text-xs text-muted-foreground">You'll receive an email reminder 7 days before expiry.</p>
        <Button onClick={() => { setBooked(false); setStep(1); setSelectedType(null); setPromoCode(""); setPromoResult(null); }}>
          Book Another Slot
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Advertise in {city}</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Boost your shop's visibility to buyers in {city}. Choose a banner slot, upload your image, and go live!
      </p>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {s}
            </div>
            {s < 4 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {step === 1 ? "Choose Slot" : step === 2 ? "Upload & Details" : step === 3 ? "Promo Code" : "Confirm"}
        </span>
      </div>

      {/* Step 1: Choose slot type */}
      {step === 1 && (
        <div className="grid gap-3 md:grid-cols-2">
          {(Object.entries(BANNER_SLOT_CONFIGS) as [BannerSlotType, typeof BANNER_SLOT_CONFIGS[BannerSlotType]][]).map(([type, cfg]) => {
            const avail = availability[type];
            const soldOut = avail.available <= 0;
            return (
              <button
                key={type}
                disabled={soldOut}
                onClick={() => { setSelectedType(type); setStep(2); }}
                className={`rounded-card border-2 p-4 text-left transition-all duration-200 ${
                  soldOut
                    ? "border-border bg-muted/50 opacity-60 cursor-not-allowed"
                    : `${cfg.borderColor} ${cfg.bgColor} hover:shadow-card-hover cursor-pointer`
                } ${selectedType === type ? "ring-2 ring-primary" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${cfg.badgeColor}`}>
                    {cfg.badge} {cfg.label}
                  </span>
                  <Badge variant={soldOut ? "destructive" : "secondary"} className="text-[10px]">
                    {soldOut ? "Sold Out" : `${avail.available}/${avail.total} available`}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{cfg.description}</p>
                <p className="text-xs text-muted-foreground mb-2">Image: {cfg.dimensions}</p>
                <p className="text-xl font-bold text-foreground">{formatPrice(cfg.pricePerMonth)}<span className="text-xs font-normal text-muted-foreground">/month</span></p>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Upload & details */}
      {step === 2 && config && (
        <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${config.badgeColor}`}>
              {config.badge} {config.label}
            </span>
            <span className="text-sm text-muted-foreground">in {city}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Banner Image URL *</label>
            <Input
              value={form.bannerImage}
              onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
              placeholder={`Recommended: ${config.dimensions}`}
            />
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Image className="h-3 w-3" /> Upload {config.dimensions} image
            </div>
            {form.bannerImage && (
              <div className="mt-2 rounded-lg border border-border overflow-hidden">
                <img src={form.bannerImage} alt="Preview" className="w-full h-24 object-cover" />
              </div>
            )}
          </div>

          {selectedType === "category" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-[var(--radius-input)] border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {selectedType?.startsWith("featured-") && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Top Product</label>
                <Input value={form.topProduct} onChange={(e) => setForm({ ...form, topProduct: e.target.value })} placeholder="e.g. iPhone 15 Pro" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Product Price (₹)</label>
                <Input type="number" value={form.topProductPrice} onChange={(e) => setForm({ ...form, topProductPrice: e.target.value })} placeholder="149900" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Shop Name</label>
              <Input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Phone</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!form.bannerImage || (selectedType === "category" && !form.category)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Promo code */}
      {step === 3 && config && (
        <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" /> Have a promo code?
          </h3>
          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoResult(null); }}
              placeholder="e.g. MADURAI50"
              className="flex-1"
            />
            <Button variant="outline" onClick={handleApplyPromo} disabled={!promoCode}>Apply</Button>
          </div>
          {promoResult && (
            <p className={`text-xs ${promoResult.valid ? "text-success" : "text-destructive"}`}>
              {promoResult.valid ? `✓ ${promoResult.discount}% discount applied!` : promoResult.error}
            </p>
          )}

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{config.label} ({city})</span>
              <span className="text-foreground">{formatPrice(basePrice)}/month</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Promo discount ({discount}%)</span>
                <span>-{formatPrice(basePrice * discount / 100)}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatPrice(finalPrice)}/month</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Continue to Payment</Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm & Pay */}
      {step === 4 && config && (
        <div className="rounded-card border border-border bg-card p-5 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Confirm & Pay
          </h3>

          <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Slot</span><span className="font-medium text-foreground">{config.label}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium text-foreground">{city}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium text-foreground">1 month (auto-renew)</span></div>
            {form.category && <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium text-foreground">{form.category}</span></div>}
            {form.topProduct && <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium text-foreground">{form.topProduct}</span></div>}
            <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
              <span>Amount</span>
              <span className="text-primary">{formatPrice(finalPrice)}</span>
            </div>
          </div>

          {form.bannerImage && (
            <div className="rounded-lg border border-border overflow-hidden">
              <img src={form.bannerImage} alt="Banner preview" className="w-full h-20 object-cover" />
            </div>
          )}

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <span>Your slot will go live within 2 hours after admin verification. Auto-renewal every month. Email reminder 7 days before expiry.</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleBook} className="flex-1 gap-2">
              <CreditCard className="h-4 w-4" /> Pay {formatPrice(finalPrice)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiseTab;
