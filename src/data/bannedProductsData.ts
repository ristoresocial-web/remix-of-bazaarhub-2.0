// Banned Products Data Layer

export interface BannedKeyword {
  id: number;
  keyword: string;
  category: string;
  severity: "critical" | "high" | "medium";
  addedAt: string;
  addedBy: string;
}

export interface BlockedListing {
  id: number;
  sellerId: string;
  sellerName: string;
  productName: string;
  productDescription: string;
  matchedKeywords: string[];
  blockedAt: string;
  status: "blocked" | "confirmed" | "whitelisted" | "appealed" | "appeal-approved" | "appeal-rejected";
  adminNotes?: string;
  appealMessage?: string;
  appealProof?: string; // filename
  appealedAt?: string;
}

export interface GeoBlockRule {
  id: number;
  keyword: string;
  blockedStates: string[];
  reason: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  keywords: "bazaarhub_banned_keywords",
  blocked: "bazaarhub_blocked_listings",
  geoRules: "bazaarhub_geo_block_rules",
};

const DEFAULT_KEYWORDS: BannedKeyword[] = [
  { id: 1, keyword: "firearm", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 2, keyword: "ammunition", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 3, keyword: "gun", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 4, keyword: "pistol", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 5, keyword: "rifle", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 6, keyword: "narcotics", category: "Drugs", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 7, keyword: "cocaine", category: "Drugs", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 8, keyword: "heroin", category: "Drugs", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 9, keyword: "marijuana", category: "Drugs", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 10, keyword: "prescription drugs", category: "Drugs", severity: "high", addedAt: "2025-01-01", addedBy: "System" },
  { id: 11, keyword: "jammer", category: "Electronics", severity: "high", addedAt: "2025-01-01", addedBy: "System" },
  { id: 12, keyword: "signal jammer", category: "Electronics", severity: "high", addedAt: "2025-01-01", addedBy: "System" },
  { id: 13, keyword: "pirated", category: "Counterfeit", severity: "high", addedAt: "2025-01-01", addedBy: "System" },
  { id: 14, keyword: "counterfeit", category: "Counterfeit", severity: "high", addedAt: "2025-01-01", addedBy: "System" },
  { id: 15, keyword: "replica", category: "Counterfeit", severity: "medium", addedAt: "2025-01-01", addedBy: "System" },
  { id: 16, keyword: "first copy", category: "Counterfeit", severity: "medium", addedAt: "2025-01-01", addedBy: "System" },
  { id: 17, keyword: "gutka", category: "Tobacco", severity: "high", addedAt: "2025-01-01", addedBy: "System" },
  { id: 18, keyword: "pan masala", category: "Tobacco", severity: "medium", addedAt: "2025-01-01", addedBy: "System" },
  { id: 19, keyword: "explosive", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
  { id: 20, keyword: "detonator", category: "Weapons", severity: "critical", addedAt: "2025-01-01", addedBy: "System" },
];

const DEFAULT_GEO_RULES: GeoBlockRule[] = [
  { id: 1, keyword: "gutka", blockedStates: ["Tamil Nadu", "Maharashtra", "Bihar", "Rajasthan"], reason: "Banned under FSSA regulations", createdAt: "2025-01-01" },
  { id: 2, keyword: "pan masala", blockedStates: ["Tamil Nadu", "Maharashtra"], reason: "State-level ban on tobacco products", createdAt: "2025-01-01" },
];

const DEFAULT_BLOCKED: BlockedListing[] = [
  {
    id: 1, sellerId: "S001", sellerName: "Quick Mart Madurai", productName: "Premium Signal Jammer Device",
    productDescription: "High power signal jammer for all frequencies", matchedKeywords: ["signal jammer", "jammer"],
    blockedAt: "2025-06-10T14:30:00", status: "blocked",
  },
  {
    id: 2, sellerId: "S004", sellerName: "Traders Hub Chennai", productName: "First Copy Designer Watch Collection",
    productDescription: "Replica luxury watches at best price", matchedKeywords: ["first copy", "replica"],
    blockedAt: "2025-06-12T09:15:00", status: "confirmed", adminNotes: "Confirmed counterfeit goods.",
  },
];

// Persistence helpers
export function getBannedKeywords(): BannedKeyword[] {
  const stored = localStorage.getItem(STORAGE_KEYS.keywords);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.keywords, JSON.stringify(DEFAULT_KEYWORDS));
  return DEFAULT_KEYWORDS;
}
export function saveBannedKeywords(data: BannedKeyword[]) {
  localStorage.setItem(STORAGE_KEYS.keywords, JSON.stringify(data));
}

export function getBlockedListings(): BlockedListing[] {
  const stored = localStorage.getItem(STORAGE_KEYS.blocked);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.blocked, JSON.stringify(DEFAULT_BLOCKED));
  return DEFAULT_BLOCKED;
}
export function saveBlockedListings(data: BlockedListing[]) {
  localStorage.setItem(STORAGE_KEYS.blocked, JSON.stringify(data));
}

export function getGeoBlockRules(): GeoBlockRule[] {
  const stored = localStorage.getItem(STORAGE_KEYS.geoRules);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.geoRules, JSON.stringify(DEFAULT_GEO_RULES));
  return DEFAULT_GEO_RULES;
}
export function saveGeoBlockRules(data: GeoBlockRule[]) {
  localStorage.setItem(STORAGE_KEYS.geoRules, JSON.stringify(data));
}

// Auto-block scanning function
export function scanProductForBannedContent(
  title: string,
  description: string,
  category: string
): { blocked: boolean; matchedKeywords: string[] } {
  const keywords = getBannedKeywords();
  const text = `${title} ${description} ${category}`.toLowerCase();
  const matched: string[] = [];

  for (const kw of keywords) {
    if (text.includes(kw.keyword.toLowerCase())) {
      matched.push(kw.keyword);
    }
  }

  return { blocked: matched.length > 0, matchedKeywords: matched };
}

// Check geo-block for a product in a given state
export function isGeoBlocked(productName: string, description: string, userState: string): { blocked: boolean; reason?: string } {
  const rules = getGeoBlockRules();
  const text = `${productName} ${description}`.toLowerCase();

  for (const rule of rules) {
    if (text.includes(rule.keyword.toLowerCase()) && rule.blockedStates.includes(userState)) {
      return { blocked: true, reason: rule.reason };
    }
  }
  return { blocked: false };
}

// Log a blocked attempt
export function logBlockedListing(
  sellerId: string,
  sellerName: string,
  productName: string,
  productDescription: string,
  matchedKeywords: string[]
): BlockedListing {
  const listings = getBlockedListings();
  const entry: BlockedListing = {
    id: Date.now(),
    sellerId,
    sellerName,
    productName,
    productDescription,
    matchedKeywords,
    blockedAt: new Date().toISOString(),
    status: "blocked",
  };
  listings.unshift(entry);
  saveBlockedListings(listings);
  return entry;
}
