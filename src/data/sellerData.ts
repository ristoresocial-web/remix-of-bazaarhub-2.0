import { ModelSpec, MODEL_DATABASE } from "@/data/compareModels";
import { getActivePlatforms, getPlatformSearchUrl } from "@/data/platformsData";

/* ── Seller data for the Find Sellers feature ── */

export type TrustTier = "New" | "Established" | "Trusted";
export type StockStatus = "In Stock" | "Limited Stock" | "Out of Stock";

export interface ProductSeller {
  id: string;
  sellerName: string;
  shopName: string;
  trustTier: TrustTier;
  type: "local" | "online";
  price: number;
  isLowestPrice?: boolean;
  distance?: number;
  stockStatus: StockStatus;
  rating: number;
  reviewCount: number;
  phone?: string;
  whatsapp?: string;
  googleMapsUrl?: string;
  address?: string;
  url?: string;
  deliveryEstimate?: string;
  isAffiliate?: boolean;
}

export interface OnlinePlatformPrice {
  platform: string;
  price: number;
  url: string;
  inStock: boolean;
  isAffiliate: boolean;
  color: string; // brand color
}

const TRUST_TIERS: TrustTier[] = ["New", "Established", "Trusted"];
const STOCK_STATUSES: StockStatus[] = ["In Stock", "In Stock", "In Stock", "Limited Stock", "Out of Stock"];

export function getLocalSellersForProduct(product: ModelSpec, city: string): ProductSeller[] {
  const sellers: ProductSeller[] = [
    {
      id: `${product.id}-sangeetha`,
      sellerName: "Rajesh Kumar",
      shopName: "Sangeetha Electronics",
      trustTier: "Trusted",
      type: "local",
      price: product.lowestPrice - 500 + Math.floor(Math.random() * 1000),
      distance: 1.2 + Math.random() * 3,
      stockStatus: "In Stock",
      rating: 4.5,
      reviewCount: 342,
      phone: "+91 98765 67890",
      whatsapp: "9876567890",
      googleMapsUrl: `https://maps.google.com/?q=Sangeetha+Electronics+${encodeURIComponent(city)}`,
      address: `Anna Nagar Main Rd, ${city}`,
      deliveryEstimate: "Same day",
    },
    {
      id: `${product.id}-poorvika`,
      sellerName: "Suresh Babu",
      shopName: "Poorvika Mobiles",
      trustTier: "Trusted",
      type: "local",
      price: product.lowestPrice + Math.floor(Math.random() * 1500),
      distance: 0.8 + Math.random() * 2,
      stockStatus: "In Stock",
      rating: 4.6,
      reviewCount: 528,
      phone: "+91 98765 43210",
      whatsapp: "9876543210",
      googleMapsUrl: `https://maps.google.com/?q=Poorvika+Mobiles+${encodeURIComponent(city)}`,
      address: `KK Nagar, ${city}`,
      deliveryEstimate: "2hr delivery",
    },
    {
      id: `${product.id}-newshop`,
      sellerName: "Karthik M.",
      shopName: "KM Electronics",
      trustTier: "New",
      type: "local",
      price: product.lowestPrice - 1000 + Math.floor(Math.random() * 500),
      distance: 3.5 + Math.random() * 4,
      stockStatus: "Limited Stock",
      rating: 3.8,
      reviewCount: 24,
      phone: "+91 98765 11111",
      whatsapp: "9876511111",
      googleMapsUrl: `https://maps.google.com/?q=KM+Electronics+${encodeURIComponent(city)}`,
      address: `Bypass Road, ${city}`,
      deliveryEstimate: "Next day",
    },
    {
      id: `${product.id}-established`,
      sellerName: "Arjun S.",
      shopName: "Digital Hub",
      trustTier: "Established",
      type: "local",
      price: product.lowestPrice + 500 + Math.floor(Math.random() * 2000),
      distance: 2.0 + Math.random() * 5,
      stockStatus: STOCK_STATUSES[Math.floor(Math.random() * STOCK_STATUSES.length)],
      rating: 4.2,
      reviewCount: 156,
      phone: "+91 98765 22222",
      whatsapp: "9876522222",
      googleMapsUrl: `https://maps.google.com/?q=Digital+Hub+${encodeURIComponent(city)}`,
      address: `Main Bazaar, ${city}`,
      deliveryEstimate: "Same day",
    },
  ];

  // Mark lowest price
  const minPrice = Math.min(...sellers.map((s) => s.price));
  sellers.forEach((s) => { s.isLowestPrice = s.price === minPrice; });

  return sellers;
}

export function getOnlinePricesForProduct(product: ModelSpec): OnlinePlatformPrice[] {
  const activePlatforms = getActivePlatforms();

  return activePlatforms.map((p) => ({
    platform: p.name,
    price: product.lowestPrice + Math.floor(Math.random() * 3000 + 200),
    url: getPlatformSearchUrl(p, product.name),
    inStock: Math.random() > 0.15,
    isAffiliate: p.isAffiliate,
    color: `hsl(${p.brandColor})`,
  }));
}
