import { formatPrice } from "@/lib/cityUtils";

/* ── Slot types ── */
export type BannerSlotType = "hero" | "category" | "featured-gold" | "featured-silver" | "featured-bronze";

export interface BannerSlotConfig {
  type: BannerSlotType;
  label: string;
  slotsPerCity: number;
  pricePerMonth: number;
  dimensions: string;
  description: string;
  badge: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
}

export const BANNER_SLOT_CONFIGS: Record<BannerSlotType, BannerSlotConfig> = {
  hero: {
    type: "hero", label: "Hero Banner", slotsPerCity: 1, pricePerMonth: 5000,
    dimensions: "1200×300px", description: "Full-width banner at top of city homepage",
    badge: "👑", badgeColor: "bg-primary text-primary-foreground", bgColor: "bg-primary/5", borderColor: "border-primary",
  },
  category: {
    type: "category", label: "Category Banner", slotsPerCity: 3, pricePerMonth: 2000,
    dimensions: "800×200px", description: "Banner inside category pages",
    badge: "📂", badgeColor: "bg-accent text-accent-foreground", bgColor: "bg-accent/30", borderColor: "border-accent-foreground/20",
  },
  "featured-gold": {
    type: "featured-gold", label: "Featured Seller (Gold)", slotsPerCity: 2, pricePerMonth: 2000,
    dimensions: "600×200px", description: "Premium shop card on homepage",
    badge: "🥇", badgeColor: "bg-[#FFD700] text-[#5D4E00]", bgColor: "bg-[#FFFDF0]", borderColor: "border-[#FFD700]",
  },
  "featured-silver": {
    type: "featured-silver", label: "Featured Seller (Silver)", slotsPerCity: 2, pricePerMonth: 1000,
    dimensions: "600×200px", description: "Highlighted shop card on homepage",
    badge: "🥈", badgeColor: "bg-[#C0C0C0] text-[#3A3A3A]", bgColor: "bg-[#FAFAFA]", borderColor: "border-[#C0C0C0]",
  },
  "featured-bronze": {
    type: "featured-bronze", label: "Featured Seller (Bronze)", slotsPerCity: 2, pricePerMonth: 500,
    dimensions: "600×200px", description: "Listed shop card on homepage",
    badge: "🥉", badgeColor: "bg-[#CD7F32]/20 text-[#8B5A2B]", bgColor: "bg-card", borderColor: "border-[#CD7F32]/40",
  },
};

/* ── Booking ── */
export interface BannerBooking {
  id: string;
  slotType: BannerSlotType;
  city: string;
  sellerId: string;
  shopName: string;
  bannerImage: string;
  category?: string; // for category banners
  topProduct?: string;
  topProductPrice?: number;
  phone: string;
  address: string;
  rating: number;
  active: boolean;
  startDate: string;
  endDate: string;
  amountPaid: number;
  promoCode?: string;
  autoRenew: boolean;
  status: "pending" | "active" | "expired" | "cancelled";
}

/* ── Promo codes ── */
export interface BannerPromoCode {
  id: string;
  code: string;
  city: string; // specific city or "all"
  slotType: BannerSlotType | "all";
  discountPercent: number;
  maxUses: number;
  usedCount: number;
  usedBySellers: string[];
  active: boolean;
  description: string;
}

const BOOKINGS_KEY = "bazaarhub_banner_bookings";
const PROMOS_KEY = "bazaarhub_banner_promos";

const DEFAULT_BOOKINGS: BannerBooking[] = [
  {
    id: "hb-mad-1", slotType: "hero", city: "Madurai", sellerId: "s1",
    shopName: "Sri Murugan Electronics",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop",
    phone: "9943440384", address: "East Masi St, Madurai", rating: 4.8,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 5000, autoRenew: true, status: "active",
  },
  {
    id: "cb-mad-1", slotType: "category", city: "Madurai", sellerId: "s2",
    shopName: "Poorvika Electronics", category: "Mobiles",
    bannerImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=200&fit=crop",
    phone: "9943440384", address: "Bypass Road, Madurai", rating: 4.6,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 2000, autoRenew: true, status: "active",
  },
  {
    id: "cb-mad-2", slotType: "category", city: "Madurai", sellerId: "s6",
    shopName: "Tech World", category: "TVs",
    bannerImage: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=200&fit=crop",
    phone: "9943440384", address: "Goripalayam, Madurai", rating: 4.3,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 2000, autoRenew: false, status: "active",
  },
  {
    id: "fg-mad-1", slotType: "featured-gold", city: "Madurai", sellerId: "s1",
    shopName: "Sri Murugan Electronics",
    bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=200&fit=crop",
    topProduct: 'Samsung 43" Crystal 4K TV', topProductPrice: 28500,
    phone: "9943440384", address: "East Masi St, Madurai", rating: 4.8,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 2000, autoRenew: true, status: "active",
  },
  {
    id: "fg-mad-2", slotType: "featured-gold", city: "Madurai", sellerId: "s2",
    shopName: "Poorvika Electronics",
    bannerImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=200&fit=crop",
    topProduct: "iPhone 15 Pro Max", topProductPrice: 149900,
    phone: "9943440384", address: "Bypass Road, Madurai", rating: 4.6,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 2000, autoRenew: true, status: "active",
  },
  {
    id: "fs-mad-1", slotType: "featured-silver", city: "Madurai", sellerId: "s3",
    shopName: "Lakshmi Electronics",
    bannerImage: "",
    topProduct: "LG 260L Refrigerator", topProductPrice: 24500,
    phone: "9871234567", address: "KK Nagar, Madurai", rating: 4.4,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 1000, autoRenew: true, status: "active",
  },
  {
    id: "fs-mad-2", slotType: "featured-silver", city: "Madurai", sellerId: "s4",
    shopName: "Vijay Home Appliances",
    bannerImage: "",
    topProduct: "Samsung 7kg Washing Machine", topProductPrice: 18900,
    phone: "9879876543", address: "Anna Nagar, Madurai", rating: 4.2,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 1000, autoRenew: false, status: "active",
  },
  {
    id: "fb-mad-1", slotType: "featured-bronze", city: "Madurai", sellerId: "s5",
    shopName: "Kumar Mobiles",
    bannerImage: "",
    topProduct: "Redmi Note 13 Pro", topProductPrice: 19999,
    phone: "9870001234", address: "Teppakulam, Madurai", rating: 4.0,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 500, autoRenew: true, status: "active",
  },
  // Chennai
  {
    id: "hb-chen-1", slotType: "hero", city: "Chennai", sellerId: "cs1",
    shopName: "Sangeetha Mobiles",
    bannerImage: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&h=300&fit=crop",
    phone: "9880012345", address: "T Nagar, Chennai", rating: 4.7,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 5000, autoRenew: true, status: "active",
  },
  {
    id: "fg-chen-1", slotType: "featured-gold", city: "Chennai", sellerId: "cs1",
    shopName: "Sangeetha Mobiles",
    bannerImage: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&h=200&fit=crop",
    topProduct: "Samsung Galaxy S24 Ultra", topProductPrice: 129999,
    phone: "9880012345", address: "T Nagar, Chennai", rating: 4.7,
    active: true, startDate: "2025-03-01", endDate: "2025-04-01",
    amountPaid: 2000, autoRenew: true, status: "active",
  },
];

const DEFAULT_PROMOS: BannerPromoCode[] = [
  { id: "bp1", code: "MADURAI50", city: "Madurai", slotType: "all", discountPercent: 50, maxUses: 20, usedCount: 3, usedBySellers: ["s10"], active: true, description: "50% off any slot in Madurai" },
  { id: "bp2", code: "HBANNERFREE", city: "all", slotType: "hero", discountPercent: 100, maxUses: 5, usedCount: 0, usedBySellers: [], active: true, description: "Free first month Hero Banner (launch promo)" },
  { id: "bp3", code: "CHENNAI30", city: "Chennai", slotType: "all", discountPercent: 30, maxUses: 15, usedCount: 1, usedBySellers: ["cs2"], active: true, description: "30% off any slot in Chennai" },
  { id: "bp4", code: "GOLD25", city: "all", slotType: "featured-gold", discountPercent: 25, maxUses: 50, usedCount: 5, usedBySellers: [], active: true, description: "25% off Gold Featured Seller slots" },
];

// ── CRUD ──

export function getBannerBookings(): BannerBooking[] {
  try { const r = localStorage.getItem(BOOKINGS_KEY); if (r) return JSON.parse(r); } catch {}
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(DEFAULT_BOOKINGS));
  return [...DEFAULT_BOOKINGS];
}
export function saveBannerBookings(b: BannerBooking[]) { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(b)); }

export function getBannerPromos(): BannerPromoCode[] {
  try { const r = localStorage.getItem(PROMOS_KEY); if (r) return JSON.parse(r); } catch {}
  localStorage.setItem(PROMOS_KEY, JSON.stringify(DEFAULT_PROMOS));
  return [...DEFAULT_PROMOS];
}
export function saveBannerPromos(p: BannerPromoCode[]) { localStorage.setItem(PROMOS_KEY, JSON.stringify(p)); }

// ── Queries ──

export function getActiveBookingsByCity(city: string): BannerBooking[] {
  return getBannerBookings().filter(b => b.city === city && b.active && b.status === "active");
}

export function getCityBannerAvailability(city: string): Record<BannerSlotType, { total: number; used: number; available: number }> {
  const bookings = getActiveBookingsByCity(city);
  const result = {} as Record<BannerSlotType, { total: number; used: number; available: number }>;
  for (const [type, config] of Object.entries(BANNER_SLOT_CONFIGS)) {
    const used = bookings.filter(b => b.slotType === type).length;
    result[type as BannerSlotType] = { total: config.slotsPerCity, used, available: config.slotsPerCity - used };
  }
  return result;
}

export function getHeroBanner(city: string): BannerBooking | undefined {
  return getActiveBookingsByCity(city).find(b => b.slotType === "hero");
}

export function getCategoryBanners(city: string, category?: string): BannerBooking[] {
  return getActiveBookingsByCity(city).filter(b =>
    b.slotType === "category" && (!category || b.category === category)
  );
}

export function getFeaturedSellers(city: string): BannerBooking[] {
  const order: BannerSlotType[] = ["featured-gold", "featured-silver", "featured-bronze"];
  return getActiveBookingsByCity(city)
    .filter(b => b.slotType.startsWith("featured-"))
    .sort((a, b) => order.indexOf(a.slotType) - order.indexOf(b.slotType));
}

export function validateBannerPromo(
  code: string, city: string, slotType: BannerSlotType, sellerId: string
): { valid: boolean; discount: number; error?: string } {
  const promos = getBannerPromos();
  const promo = promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active);
  if (!promo) return { valid: false, discount: 0, error: "Invalid promo code" };
  if (promo.city !== "all" && promo.city !== city) return { valid: false, discount: 0, error: `This code is only valid for ${promo.city}` };
  if (promo.slotType !== "all" && promo.slotType !== slotType) return { valid: false, discount: 0, error: `This code is not valid for ${BANNER_SLOT_CONFIGS[slotType].label}` };
  if (promo.usedCount >= promo.maxUses) return { valid: false, discount: 0, error: "Code has reached maximum uses" };
  if (promo.usedBySellers.includes(sellerId)) return { valid: false, discount: 0, error: "You've already used this code" };
  return { valid: true, discount: promo.discountPercent };
}

export function bookBannerSlot(booking: Omit<BannerBooking, "id" | "status">): BannerBooking {
  const bookings = getBannerBookings();
  const newBooking: BannerBooking = {
    ...booking,
    id: `bb-${Date.now()}`,
    status: "pending",
  };
  bookings.push(newBooking);
  saveBannerBookings(bookings);
  return newBooking;
}

// ── Revenue ──

export function getCityRevenue(city: string): number {
  return getBannerBookings()
    .filter(b => b.city === city && b.status === "active")
    .reduce((sum, b) => sum + b.amountPaid, 0);
}

export function getTotalRevenue(): number {
  return getBannerBookings()
    .filter(b => b.status === "active")
    .reduce((sum, b) => sum + b.amountPaid, 0);
}

export const ALL_BANNER_CITIES = ["Madurai", "Chennai", "Coimbatore", "Trichy", "Bangalore", "Hyderabad", "Mumbai", "Delhi"];
