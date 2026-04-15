export type AdTier = "gold" | "silver" | "bronze";

export interface AdSlot {
  id: string;
  tier: AdTier;
  city: string;
  sellerId: string;
  shopName: string;
  bannerImage?: string;
  topProduct: string;
  topProductPrice: number;
  category: string;
  rating: number;
  distance: string;
  phone: string;
  address: string;
  active: boolean;
  startDate: string;
  endDate: string;
  promoCode?: string;
  amountPaid: number;
}

export interface AdPromoCode {
  id: string;
  code: string;
  tier: AdTier;
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  usedBySellers: string[];
  active: boolean;
}

export const TIER_CONFIG: Record<AdTier, { label: string; badge: string; price: number; maxSlots: number; slotRange: string; badgeColor: string; bgColor: string; borderColor: string }> = {
  gold: { label: "Featured", badge: "🥇", price: 2000, maxSlots: 3, slotRange: "1-3", badgeColor: "bg-[#FFD700] text-[#5D4E00]", bgColor: "bg-[#FFFDF0]", borderColor: "border-[#FFD700]" },
  silver: { label: "Sponsored", badge: "🥈", price: 1000, maxSlots: 4, slotRange: "4-7", badgeColor: "bg-[#C0C0C0] text-[#3A3A3A]", bgColor: "bg-[#FAFAFA]", borderColor: "border-[#C0C0C0]" },
  bronze: { label: "Promoted", badge: "🥉", price: 500, maxSlots: 3, slotRange: "8-10", badgeColor: "bg-[#CD7F32]/20 text-[#8B5A2B]", bgColor: "bg-card", borderColor: "border-[#CD7F32]/40" },
};

const STORAGE_KEY = "bazaarhub_ad_slots";
const PROMO_KEY = "bazaarhub_ad_promos";

const DEFAULT_SLOTS: AdSlot[] = [
  {
    id: "g1", tier: "gold", city: "Madurai", sellerId: "s1", shopName: "Sri Murugan Electronics",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=200&fit=crop",
    topProduct: 'Samsung 43" Crystal 4K TV', topProductPrice: 28500, category: "TVs",
    rating: 4.8, distance: "2.1 km", phone: "9876543210", address: "East Masi St, Madurai",
    active: true, startDate: "2025-03-01", endDate: "2025-03-31", amountPaid: 2000,
  },
  {
    id: "g2", tier: "gold", city: "Madurai", sellerId: "s2", shopName: "Poorvika Electronics",
    bannerImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=200&fit=crop",
    topProduct: "iPhone 15 Pro Max", topProductPrice: 149900, category: "Mobiles",
    rating: 4.6, distance: "3.5 km", phone: "9876501234", address: "Bypass Road, Madurai",
    active: true, startDate: "2025-03-01", endDate: "2025-03-31", amountPaid: 2000,
  },
  {
    id: "s1", tier: "silver", city: "Madurai", sellerId: "s3", shopName: "Lakshmi Electronics",
    topProduct: "LG 260L Refrigerator", topProductPrice: 24500, category: "Refrigerators",
    rating: 4.4, distance: "1.8 km", phone: "9871234567", address: "KK Nagar, Madurai",
    active: true, startDate: "2025-03-01", endDate: "2025-03-31", amountPaid: 1000,
  },
  {
    id: "s2", tier: "silver", city: "Madurai", sellerId: "s4", shopName: "Vijay Home Appliances",
    topProduct: "Samsung 7kg Washing Machine", topProductPrice: 18900, category: "Washing Machines",
    rating: 4.2, distance: "4.2 km", phone: "9879876543", address: "Anna Nagar, Madurai",
    active: true, startDate: "2025-03-01", endDate: "2025-03-31", amountPaid: 1000,
  },
  {
    id: "b1", tier: "bronze", city: "Madurai", sellerId: "s5", shopName: "Kumar Mobiles",
    topProduct: "Redmi Note 13 Pro", topProductPrice: 19999, category: "Mobiles",
    rating: 4.0, distance: "5.0 km", phone: "9870001234", address: "Teppakulam, Madurai",
    active: true, startDate: "2025-03-01", endDate: "2025-03-31", amountPaid: 500,
  },
  // Chennai slots
  {
    id: "cg1", tier: "gold", city: "Chennai", sellerId: "cs1", shopName: "Sangeetha Mobiles",
    bannerImage: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&h=200&fit=crop",
    topProduct: "Samsung Galaxy S24 Ultra", topProductPrice: 129999, category: "Mobiles",
    rating: 4.7, distance: "1.5 km", phone: "9880012345", address: "T Nagar, Chennai",
    active: true, startDate: "2025-03-01", endDate: "2025-03-31", amountPaid: 2000,
  },
];

const DEFAULT_PROMOS: AdPromoCode[] = [
  { id: "p1", code: "GOLD50", tier: "gold", discountPercent: 50, maxUses: 10, usedCount: 2, usedBySellers: ["s10", "s11"], active: true },
  { id: "p2", code: "SILVER30", tier: "silver", discountPercent: 30, maxUses: 20, usedCount: 5, usedBySellers: [], active: true },
  { id: "p3", code: "BRONZE20", tier: "bronze", discountPercent: 20, maxUses: 50, usedCount: 8, usedBySellers: [], active: true },
];

export function getAdSlots(): AdSlot[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_SLOTS;
}
export function saveAdSlots(slots: AdSlot[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(slots)); }

export function getAdPromos(): AdPromoCode[] {
  try { const r = localStorage.getItem(PROMO_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_PROMOS;
}
export function saveAdPromos(promos: AdPromoCode[]) { localStorage.setItem(PROMO_KEY, JSON.stringify(promos)); }

export function getActiveSlotsByCity(city: string): AdSlot[] {
  const now = new Date().toISOString().slice(0, 10);
  return getAdSlots()
    .filter(s => s.city === city && s.active && s.startDate <= now && s.endDate >= now)
    .sort((a, b) => {
      const tierOrder: Record<AdTier, number> = { gold: 0, silver: 1, bronze: 2 };
      return tierOrder[a.tier] - tierOrder[b.tier];
    });
}

export function getCitySlotAvailability(city: string): Record<AdTier, { total: number; used: number; available: number }> {
  const slots = getAdSlots().filter(s => s.city === city && s.active);
  return {
    gold: { total: 3, used: slots.filter(s => s.tier === "gold").length, available: 3 - slots.filter(s => s.tier === "gold").length },
    silver: { total: 4, used: slots.filter(s => s.tier === "silver").length, available: 4 - slots.filter(s => s.tier === "silver").length },
    bronze: { total: 3, used: slots.filter(s => s.tier === "bronze").length, available: 3 - slots.filter(s => s.tier === "bronze").length },
  };
}

export function validatePromoCode(code: string, tier: AdTier, sellerId: string): { valid: boolean; discount: number; error?: string } {
  const promos = getAdPromos();
  const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active);
  if (!promo) return { valid: false, discount: 0, error: "Invalid promo code" };
  if (promo.tier !== tier) return { valid: false, discount: 0, error: `This code is for ${promo.tier.toUpperCase()} tier only` };
  if (promo.usedCount >= promo.maxUses) return { valid: false, discount: 0, error: "Code has reached max uses" };
  if (promo.usedBySellers.includes(sellerId)) return { valid: false, discount: 0, error: "You've already used this code" };
  return { valid: true, discount: promo.discountPercent };
}
