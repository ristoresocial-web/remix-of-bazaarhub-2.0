import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ComparisonEngine from "@/components/compare/ComparisonEngine";
import type {
  ComparisonResult,
  ComparisonProduct,
  OnlineSeller,
  CityPartner,
} from "@/data/comparisonMockData";
import type { Product } from "@/data/mockData";

interface InlineComparePanelProps {
  product: Product;
  city: string;
}

// Brand colors for known online platforms (HSL strings used inline by ComparisonEngine)
const PLATFORM_COLORS: Record<string, string> = {
  Amazon: "32 100% 50%",
  Flipkart: "211 100% 50%",
  Meesho: "327 100% 35%",
  Croma: "0 75% 45%",
  Reliance: "215 80% 40%",
  Tatacliq: "262 60% 45%",
};

/**
 * Build a ComparisonResult on-the-fly from a Product's existing prices array.
 * - Online = entries with isAffiliate=true
 * - Offline (city partner) = entries with isAffiliate=false (or product.localShop)
 */
function buildInlineResult(product: Product, city: string): ComparisonResult {
  const compProduct: ComparisonProduct = {
    id: String(product.id),
    slug: product.slug,
    name: product.name,
    image: product.image,
    category: product.category,
    brand: product.brand,
    specs: (product.specs ?? []).map(([key, value]) => ({ key, value })),
  };

  const onlineSellers: OnlineSeller[] = product.prices
    .filter((p) => p.isAffiliate)
    .map((p) => ({
      platform: p.platform,
      price: p.price,
      delivery: "2–4 day delivery",
      rating: 4.2 + Math.random() * 0.6,
      reviewCount: 1000 + Math.floor(Math.random() * 9000),
      url: p.url,
      inStock: p.inStock,
      color: PLATFORM_COLORS[p.platform] ?? "210 10% 30%",
    }))
    .sort((a, b) => a.price - b.price);

  const localFromPrices: CityPartner[] = product.prices
    .filter((p) => !p.isAffiliate)
    .map((p, idx) => ({
      id: `${product.id}-local-${idx}`,
      shopName: p.platform,
      ownerName: "—",
      price: p.price,
      distanceKm: 1 + Math.random() * 8,
      city,
      inStock: p.inStock,
      phone: product.localShop?.phone ?? "9999999999",
      whatsapp: product.localShop?.phone ?? "9999999999",
      address: product.localShop?.address ?? `${city}`,
      trustLevel: idx === 0 ? "trusted" : idx === 1 ? "established" : "new",
      rating: 4.0 + Math.random() * 0.8,
      reviewCount: 50 + Math.floor(Math.random() * 200),
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        (product.localShop?.address ?? "") + " " + city,
      )}`,
    }));

  // If product is flagged localAvailable but no non-affiliate prices exist, synthesize one from localShop
  const cityPartners: CityPartner[] =
    localFromPrices.length === 0 && product.localAvailable && product.localShop
      ? [
          {
            id: `${product.id}-local-shop`,
            shopName: product.localShop.name,
            ownerName: "—",
            price: Math.min(...product.prices.filter((p) => p.inStock).map((p) => p.price)) || 0,
            distanceKm: product.localShop.km,
            city,
            inStock: true,
            phone: product.localShop.phone,
            whatsapp: product.localShop.phone,
            address: product.localShop.address,
            trustLevel: "established",
            rating: 4.3,
            reviewCount: 80,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              product.localShop.address + " " + city,
            )}`,
          },
        ]
      : localFromPrices.sort((a, b) => a.price - b.price);

  const onlineInStock = onlineSellers.filter((s) => s.inStock);
  const localInStock = cityPartners.filter((s) => s.inStock);
  const lowestOnline = onlineInStock.length > 0 ? Math.min(...onlineInStock.map((s) => s.price)) : Infinity;
  const lowestLocal = localInStock.length > 0 ? Math.min(...localInStock.map((s) => s.price)) : Infinity;
  const finiteOnline = isFinite(lowestOnline) ? lowestOnline : 0;
  const finiteLocal = isFinite(lowestLocal) ? lowestLocal : 0;

  return {
    product: compProduct,
    onlineSellers,
    cityPartners,
    lowestOnlinePrice: finiteOnline,
    lowestLocalPrice: finiteLocal,
    priceDifference:
      isFinite(lowestOnline) && isFinite(lowestLocal) ? finiteOnline - finiteLocal : 0,
    lowestOnlinePlatform: onlineSellers.find((s) => s.price === finiteOnline)?.platform ?? "",
    lowestCityPartner: cityPartners.find((s) => s.price === finiteLocal)?.shopName ?? "",
  };
}

const InlineComparePanel: React.FC<InlineComparePanelProps> = ({ product, city }) => {
  const result = useMemo(() => buildInlineResult(product, city), [product, city]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-card border border-border bg-card p-4 shadow-card"
    >
      <ComparisonEngine data={result} city={city} />
    </motion.div>
  );
};

export default InlineComparePanel;
