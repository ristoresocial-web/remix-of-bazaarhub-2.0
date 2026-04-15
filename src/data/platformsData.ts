// Online Platforms Database — admin-managed, localStorage-persisted

export interface OnlinePlatform {
  id: string;
  name: string;
  logoUrl: string;
  baseUrl: string;
  searchUrlTemplate: string; // e.g. "https://www.meesho.com/search?q={query}"
  affiliateUrlTemplate: string;
  displayOrder: number;
  active: boolean;
  states: string[]; // empty = available everywhere
  isAffiliate: boolean;
  brandColor: string; // HSL for theming
  affiliateDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "bazaarhub_online_platforms";

const defaultPlatforms: OnlinePlatform[] = [
  {
    id: "amazon",
    name: "Amazon",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    baseUrl: "https://www.amazon.in",
    searchUrlTemplate: "https://www.amazon.in/s?k={query}",
    affiliateUrlTemplate: "https://www.amazon.in/s?k={query}&tag=bazaarhub-21",
    displayOrder: 1,
    active: true,
    states: [],
    isAffiliate: true,
    brandColor: "33 100% 50%",
    affiliateDisclaimer: "Amazon Associate link. We earn from qualifying purchases.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Flipkart_logo.png/200px-Flipkart_logo.png",
    baseUrl: "https://www.flipkart.com",
    searchUrlTemplate: "https://www.flipkart.com/search?q={query}",
    affiliateUrlTemplate: "https://www.flipkart.com/search?q={query}&affid=bazaarhub",
    displayOrder: 2,
    active: true,
    states: [],
    isAffiliate: true,
    brandColor: "45 95% 62%",
    affiliateDisclaimer: "Flipkart affiliate link. Commission earned.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "meesho",
    name: "Meesho",
    logoUrl: "https://images.meesho.com/images/pow/meesho-app-icon.png",
    baseUrl: "https://www.meesho.com",
    searchUrlTemplate: "https://www.meesho.com/search?q={query}",
    affiliateUrlTemplate: "",
    displayOrder: 3,
    active: true,
    states: [],
    isAffiliate: false,
    brandColor: "320 100% 37%",
    affiliateDisclaimer: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "croma",
    name: "Croma",
    logoUrl: "https://media.croma.com/image/upload/v1637759004/Croma%20Assets/CMS/Category%20icon/Final%20Category%20Icons/Croma_logo_ycxnmn.svg",
    baseUrl: "https://www.croma.com",
    searchUrlTemplate: "https://www.croma.com/searchB?q={query}",
    affiliateUrlTemplate: "",
    displayOrder: 4,
    active: true,
    states: [],
    isAffiliate: false,
    brandColor: "174 100% 24%",
    affiliateDisclaimer: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "reliance-digital",
    name: "Reliance Digital",
    logoUrl: "https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg",
    baseUrl: "https://www.reliancedigital.in",
    searchUrlTemplate: "https://www.reliancedigital.in/search?q={query}",
    affiliateUrlTemplate: "",
    displayOrder: 5,
    active: true,
    states: [],
    isAffiliate: false,
    brandColor: "210 100% 40%",
    affiliateDisclaimer: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "jiomart",
    name: "JioMart",
    logoUrl: "https://www.jiomart.com/assets/ds2web/jds-icons/jiomart-logo.svg",
    baseUrl: "https://www.jiomart.com",
    searchUrlTemplate: "https://www.jiomart.com/search/{query}",
    affiliateUrlTemplate: "",
    displayOrder: 6,
    active: true,
    states: [],
    isAffiliate: false,
    brandColor: "210 100% 45%",
    affiliateDisclaimer: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tata-cliq",
    name: "Tata CLiQ",
    logoUrl: "https://www.tatacliq.com/src/general/components/img/tatacliq-logo.svg",
    baseUrl: "https://www.tatacliq.com",
    searchUrlTemplate: "https://www.tatacliq.com/search/?searchCategory=all&text={query}",
    affiliateUrlTemplate: "",
    displayOrder: 7,
    active: false,
    states: [],
    isAffiliate: false,
    brandColor: "270 80% 50%",
    affiliateDisclaimer: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "snapdeal",
    name: "Snapdeal",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Snapdeal_logo.png/220px-Snapdeal_logo.png",
    baseUrl: "https://www.snapdeal.com",
    searchUrlTemplate: "https://www.snapdeal.com/search?keyword={query}",
    affiliateUrlTemplate: "",
    displayOrder: 8,
    active: false,
    states: [],
    isAffiliate: false,
    brandColor: "0 85% 50%",
    affiliateDisclaimer: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getAllPlatforms(): OnlinePlatform[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPlatforms));
  return [...defaultPlatforms];
}

export function savePlatforms(platforms: OnlinePlatform[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(platforms));
}

export function getActivePlatforms(state?: string): OnlinePlatform[] {
  return getAllPlatforms()
    .filter((p) => p.active)
    .filter((p) => p.states.length === 0 || (state && p.states.includes(state)))
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getPlatformSearchUrl(platform: OnlinePlatform, query: string): string {
  const template = platform.affiliateUrlTemplate || platform.searchUrlTemplate;
  return template.replace("{query}", encodeURIComponent(query));
}

export function addPlatform(platform: Omit<OnlinePlatform, "id" | "createdAt" | "updatedAt">): OnlinePlatform {
  const platforms = getAllPlatforms();
  const newPlatform: OnlinePlatform = {
    ...platform,
    id: platform.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  platforms.push(newPlatform);
  savePlatforms(platforms);
  return newPlatform;
}

export function updatePlatform(id: string, updates: Partial<OnlinePlatform>): void {
  const platforms = getAllPlatforms();
  const idx = platforms.findIndex((p) => p.id === id);
  if (idx !== -1) {
    platforms[idx] = { ...platforms[idx], ...updates, updatedAt: new Date().toISOString() };
    savePlatforms(platforms);
  }
}

export function deletePlatform(id: string): void {
  const platforms = getAllPlatforms().filter((p) => p.id !== id);
  savePlatforms(platforms);
}
