import type { Product } from "@/data/mockData";

/* ── Smart fallback logic for product comparison (Cases B & C) ── */

export type Availability = "both" | "online" | "offline" | "none";

export interface FallbackMatch {
  product: Product;
  matchPercent: number;
  lowestPrice: number;
}

// Session-level memoization cache
const matchCache = new Map<string, number>();

function cacheKey(aId: number | string, bId: number | string): string {
  const [x, y] = [String(aId), String(bId)].sort();
  return `${x}-${y}`;
}

/** Compare specs of two products and return 0–100 match percent (case-insensitive). */
export function specMatchPercent(target: Product, candidate: Product): number {
  const targetSpecs = target.specs ?? [];
  const candSpecs = candidate.specs ?? [];
  if (targetSpecs.length === 0) return 0;

  const key = cacheKey(target.id, candidate.id);
  const cached = matchCache.get(key);
  if (cached !== undefined) return cached;

  const candMap = new Map<string, string>();
  candSpecs.forEach(([k, v]) => candMap.set(k.toLowerCase(), String(v).toLowerCase()));

  let matched = 0;
  targetSpecs.forEach(([k, v]) => {
    const cv = candMap.get(k.toLowerCase());
    if (cv && cv === String(v).toLowerCase()) matched += 1;
  });

  const pct = Math.round((matched / targetSpecs.length) * 100);
  matchCache.set(key, pct);
  return pct;
}

/** Determine product availability — both / online / offline / none. */
export function getAvailability(product: Product): Availability {
  const inStock = product.prices.filter((p) => p.inStock);
  const hasOnline = inStock.some((p) => p.isAffiliate);
  const hasOffline = product.localAvailable || inStock.some((p) => !p.isAffiliate);
  if (hasOnline && hasOffline) return "both";
  if (hasOnline) return "online";
  if (hasOffline) return "offline";
  return "none";
}

function lowestInStock(p: Product): number {
  const inStock = p.prices.filter((pr) => pr.inStock);
  if (inStock.length === 0) return 0;
  return Math.min(...inStock.map((pr) => pr.price));
}

/** Same brand + ≥80% spec match (excluding self). Sorted by match desc, then price asc. */
export function findSameBrandSameSpec(
  target: Product,
  allProducts: Product[],
  threshold = 80,
): FallbackMatch[] {
  return allProducts
    .filter((p) => p.id !== target.id && p.brand.toLowerCase() === target.brand.toLowerCase())
    .map((p) => ({ product: p, matchPercent: specMatchPercent(target, p), lowestPrice: lowestInStock(p) }))
    .filter((m) => m.matchPercent >= threshold)
    .sort((a, b) => b.matchPercent - a.matchPercent || a.lowestPrice - b.lowestPrice);
}

/** Different brand + ≥70% spec match. Sorted by match desc, then price asc. */
export function findDifferentBrandSameSpec(
  target: Product,
  allProducts: Product[],
  threshold = 70,
): FallbackMatch[] {
  return allProducts
    .filter((p) => p.id !== target.id && p.brand.toLowerCase() !== target.brand.toLowerCase())
    .map((p) => ({ product: p, matchPercent: specMatchPercent(target, p), lowestPrice: lowestInStock(p) }))
    .filter((m) => m.matchPercent >= threshold)
    .sort((a, b) => b.matchPercent - a.matchPercent || a.lowestPrice - b.lowestPrice);
}
