import { Product } from "@/data/mockData";

/* ── Detailed spec model for head-to-head comparison ── */

export interface ModelSpec {
  id: string;
  name: string;
  brand: string;
  category: CompareCategory;
  image: string;
  specs: {
    display: { size: string; resolution: string; refreshRate: string; panelType: string };
    performance: { processor: string; ram: string; storage: string; storageType?: string; graphicsCard?: string; weight?: string };
    camera: { rearMain: string; ultraWide: string; macro: string; front: string };
    battery: { capacity: string; charging: string; backupHours?: string };
    features: { fingerprint: string; fiveG: string; nfc: string; ipRating: string; os: string };
    // Category-specific extras
    tv?: { hdmiPorts: string; screenToBodyRatio: string };
    ac?: { tonnage: string; starRating: string; inverter: string; coolingCapacity: string; unitsPerYear: string };
    fridge?: { capacityL: string; type: string; starRating: string; inverter: string; warrantyYears: string };
    washer?: { capacityKg: string; type: string; rpm: string; starRating: string };
  };
  lowestPrice: number;
  avgRating: number;
  ratingCount: number;
}

export interface SpecRow {
  label: string;
  section: string;
  getValue: (m: ModelSpec) => string;
  higherIsBetter?: boolean;
}

/* ── Category-aware spec sections ── */
function getSpecSections(category: CompareCategory): { title: string; icon: string; rows: SpecRow[] }[] {
  const base: { title: string; icon: string; rows: SpecRow[] }[] = [];

  if (category === "Mobiles") {
    base.push(
      { title: "Display", icon: "📱", rows: [
        { label: "Screen Size", section: "Display", getValue: (m) => m.specs.display.size, higherIsBetter: true },
        { label: "Resolution", section: "Display", getValue: (m) => m.specs.display.resolution },
        { label: "Refresh Rate", section: "Display", getValue: (m) => m.specs.display.refreshRate, higherIsBetter: true },
        { label: "Panel Type", section: "Display", getValue: (m) => m.specs.display.panelType },
      ]},
      { title: "Performance", icon: "⚡", rows: [
        { label: "Processor", section: "Performance", getValue: (m) => m.specs.performance.processor },
        { label: "RAM", section: "Performance", getValue: (m) => m.specs.performance.ram, higherIsBetter: true },
        { label: "Storage", section: "Performance", getValue: (m) => m.specs.performance.storage, higherIsBetter: true },
      ]},
      { title: "Camera", icon: "📷", rows: [
        { label: "Rear Main", section: "Camera", getValue: (m) => m.specs.camera.rearMain, higherIsBetter: true },
        { label: "Ultra-Wide", section: "Camera", getValue: (m) => m.specs.camera.ultraWide, higherIsBetter: true },
        { label: "Macro", section: "Camera", getValue: (m) => m.specs.camera.macro, higherIsBetter: true },
        { label: "Front Camera", section: "Camera", getValue: (m) => m.specs.camera.front, higherIsBetter: true },
      ]},
      { title: "Battery", icon: "🔋", rows: [
        { label: "Capacity", section: "Battery", getValue: (m) => m.specs.battery.capacity, higherIsBetter: true },
        { label: "Fast Charging", section: "Battery", getValue: (m) => m.specs.battery.charging, higherIsBetter: true },
      ]},
      { title: "Features", icon: "✨", rows: [
        { label: "Fingerprint", section: "Features", getValue: (m) => m.specs.features.fingerprint },
        { label: "5G", section: "Features", getValue: (m) => m.specs.features.fiveG },
        { label: "NFC", section: "Features", getValue: (m) => m.specs.features.nfc },
        { label: "IP Rating", section: "Features", getValue: (m) => m.specs.features.ipRating },
        { label: "OS", section: "Features", getValue: (m) => m.specs.features.os },
      ]},
    );
  } else if (category === "Laptops") {
    base.push(
      { title: "Display", icon: "💻", rows: [
        { label: "Screen Size", section: "Display", getValue: (m) => m.specs.display.size, higherIsBetter: true },
        { label: "Resolution", section: "Display", getValue: (m) => m.specs.display.resolution },
        { label: "Refresh Rate", section: "Display", getValue: (m) => m.specs.display.refreshRate, higherIsBetter: true },
        { label: "Panel Type", section: "Display", getValue: (m) => m.specs.display.panelType },
      ]},
      { title: "Performance", icon: "⚡", rows: [
        { label: "Processor", section: "Performance", getValue: (m) => m.specs.performance.processor },
        { label: "RAM", section: "Performance", getValue: (m) => m.specs.performance.ram, higherIsBetter: true },
        { label: "Storage", section: "Performance", getValue: (m) => m.specs.performance.storage, higherIsBetter: true },
        { label: "Storage Type", section: "Performance", getValue: (m) => m.specs.performance.storageType || "—" },
        { label: "Graphics Card", section: "Performance", getValue: (m) => m.specs.performance.graphicsCard || "Integrated" },
        { label: "Weight", section: "Performance", getValue: (m) => m.specs.performance.weight || "—" },
      ]},
      { title: "Battery", icon: "🔋", rows: [
        { label: "Capacity", section: "Battery", getValue: (m) => m.specs.battery.capacity, higherIsBetter: true },
        { label: "Battery Backup", section: "Battery", getValue: (m) => m.specs.battery.backupHours || "—", higherIsBetter: true },
        { label: "Charging", section: "Battery", getValue: (m) => m.specs.battery.charging },
      ]},
      { title: "Features", icon: "✨", rows: [
        { label: "Fingerprint", section: "Features", getValue: (m) => m.specs.features.fingerprint },
        { label: "OS", section: "Features", getValue: (m) => m.specs.features.os },
        { label: "Webcam", section: "Features", getValue: (m) => m.specs.camera.front || "—" },
      ]},
    );
  } else if (category === "TVs") {
    base.push(
      { title: "Display", icon: "📺", rows: [
        { label: "Screen Size", section: "Display", getValue: (m) => m.specs.display.size, higherIsBetter: true },
        { label: "Resolution", section: "Display", getValue: (m) => m.specs.display.resolution },
        { label: "Refresh Rate", section: "Display", getValue: (m) => m.specs.display.refreshRate, higherIsBetter: true },
        { label: "Panel Type", section: "Display", getValue: (m) => m.specs.display.panelType },
        { label: "HDMI Ports", section: "Display", getValue: (m) => m.specs.tv?.hdmiPorts || "—", higherIsBetter: true },
        { label: "Screen-to-Body Ratio", section: "Display", getValue: (m) => m.specs.tv?.screenToBodyRatio || "—", higherIsBetter: true },
      ]},
      { title: "Performance", icon: "⚡", rows: [
        { label: "Processor", section: "Performance", getValue: (m) => m.specs.performance.processor },
        { label: "RAM", section: "Performance", getValue: (m) => m.specs.performance.ram, higherIsBetter: true },
        { label: "Storage", section: "Performance", getValue: (m) => m.specs.performance.storage, higherIsBetter: true },
      ]},
      { title: "Features", icon: "✨", rows: [
        { label: "Smart OS", section: "Features", getValue: (m) => m.specs.features.os },
      ]},
    );
  } else if (category === "ACs") {
    base.push(
      { title: "Specs", icon: "❄️", rows: [
        { label: "Tonnage", section: "Specs", getValue: (m) => m.specs.ac?.tonnage || "—", higherIsBetter: true },
        { label: "Star Rating", section: "Specs", getValue: (m) => m.specs.ac?.starRating || "—", higherIsBetter: true },
        { label: "Inverter", section: "Specs", getValue: (m) => m.specs.ac?.inverter || "—" },
        { label: "Cooling Capacity", section: "Specs", getValue: (m) => m.specs.ac?.coolingCapacity || "—", higherIsBetter: true },
      ]},
      { title: "Electricity", icon: "⚡", rows: [
        { label: "Units/Year", section: "Electricity", getValue: (m) => m.specs.ac?.unitsPerYear || "—" },
        { label: "Annual Cost (₹6/unit)", section: "Electricity", getValue: (m) => {
          const units = extractNumber(m.specs.ac?.unitsPerYear || "");
          return units !== null ? `₹${(units * 6).toLocaleString("en-IN")}` : "—";
        }},
      ]},
    );
  } else if (category === "Refrigerators") {
    base.push(
      { title: "Specs", icon: "🧊", rows: [
        { label: "Capacity", section: "Specs", getValue: (m) => m.specs.fridge?.capacityL || "—", higherIsBetter: true },
        { label: "Type", section: "Specs", getValue: (m) => m.specs.fridge?.type || "—" },
        { label: "Star Rating", section: "Specs", getValue: (m) => m.specs.fridge?.starRating || "—", higherIsBetter: true },
        { label: "Inverter", section: "Specs", getValue: (m) => m.specs.fridge?.inverter || "—" },
        { label: "Warranty", section: "Specs", getValue: (m) => m.specs.fridge?.warrantyYears || "—", higherIsBetter: true },
      ]},
    );
  } else if (category === "Washing Machines") {
    base.push(
      { title: "Specs", icon: "🫧", rows: [
        { label: "Capacity", section: "Specs", getValue: (m) => m.specs.washer?.capacityKg || "—", higherIsBetter: true },
        { label: "Type", section: "Specs", getValue: (m) => m.specs.washer?.type || "—" },
        { label: "RPM", section: "Specs", getValue: (m) => m.specs.washer?.rpm || "—", higherIsBetter: true },
        { label: "Star Rating", section: "Specs", getValue: (m) => m.specs.washer?.starRating || "—", higherIsBetter: true },
      ]},
    );
  }

  // Price & Rating always last
  base.push({
    title: "Price & Rating", icon: "💰",
    rows: [
      { label: "Lowest Price", section: "Price", getValue: (m) => `₹${m.lowestPrice.toLocaleString("en-IN")}` },
      { label: "Avg. Rating", section: "Price", getValue: (m) => `${m.avgRating} ★ (${m.ratingCount})` },
    ],
  });

  return base;
}

export { getSpecSections };

// Keep SPEC_SECTIONS for backward compat — defaults to Mobiles
export const SPEC_SECTIONS = getSpecSections("Mobiles");

/* ── Helper: extract numeric value from spec string for comparison ── */
export function extractNumber(val: string): number | null {
  const match = val.match(/([\d,.]+)/);
  if (!match) return null;
  return parseFloat(match[1].replace(/,/g, ""));
}

/* ── Determine cell highlight ── */
export type CellHighlight = "same" | "different" | "inferior" | "none";

export function getCellHighlight(
  values: string[],
  idx: number,
  higherIsBetter?: boolean
): CellHighlight {
  const nonEmpty = values.filter((v) => v && v !== "—" && v !== "N/A");
  if (nonEmpty.length < 2) return "none";

  const allSame = nonEmpty.every((v) => v === nonEmpty[0]);
  if (allSame) return "same";

  if (higherIsBetter !== undefined) {
    const nums = values.map(extractNumber);
    const validNums = nums.filter((n): n is number => n !== null);
    if (validNums.length >= 2) {
      const current = nums[idx];
      if (current !== null) {
        const best = higherIsBetter ? Math.max(...validNums) : Math.min(...validNums);
        const worst = higherIsBetter ? Math.min(...validNums) : Math.max(...validNums);
        if (current === worst && current !== best) return "inferior";
      }
    }
  }

  return "different";
}

export const HIGHLIGHT_CLASSES: Record<CellHighlight, string> = {
  same: "bg-success/10 text-success border border-success/20",
  different: "bg-warning/10 text-warning-foreground border border-warning/20",
  inferior: "bg-destructive/10 text-destructive border border-destructive/20",
  none: "text-foreground",
};

/* ── EMI Calculator ── */
export function calculateEMI(price: number, months: number, annualRate: number = 12): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return price / months;
  return Math.round((price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

/* ── Best Value AI Score ── */
export function calculateValueScore(model: ModelSpec): number {
  // Weighted scoring based on category-relevant specs per rupee
  const price = model.lowestPrice;
  let specScore = 0;

  // RAM points
  const ram = extractNumber(model.specs.performance.ram) || 0;
  specScore += ram * 5;

  // Storage points
  const storage = extractNumber(model.specs.performance.storage) || 0;
  specScore += storage * 0.1;

  // Battery points
  const battery = extractNumber(model.specs.battery.capacity) || 0;
  specScore += battery * 0.01;

  // Camera points (for mobiles)
  const camera = extractNumber(model.specs.camera.rearMain) || 0;
  specScore += camera * 0.5;

  // Rating bonus
  specScore += model.avgRating * 10;

  // Refresh rate bonus
  const refreshRate = extractNumber(model.specs.display.refreshRate) || 60;
  specScore += (refreshRate - 60) * 0.2;

  // Category-specific bonuses
  if (model.specs.ac) {
    const stars = extractNumber(model.specs.ac.starRating) || 3;
    specScore += stars * 20;
  }
  if (model.specs.fridge) {
    const cap = extractNumber(model.specs.fridge.capacityL) || 0;
    specScore += cap * 0.1;
  }
  if (model.specs.washer) {
    const rpm = extractNumber(model.specs.washer.rpm) || 0;
    specScore += rpm * 0.01;
  }

  // Normalize: spec points per lakh rupee, scale to 0-10
  const perLakh = (specScore / (price / 100000));
  return Math.min(10, Math.max(1, Math.round(perLakh * 10) / 10));
}

/* ── Mock model database ── */
export const MODEL_DATABASE: ModelSpec[] = [
  // ═══ MOBILES ═══
  {
    id: "samsung-galaxy-a55",
    name: "Samsung Galaxy A55 5G",
    brand: "Samsung",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    specs: {
      display: { size: '6.6"', resolution: "1080 x 2340 (FHD+)", refreshRate: "120 Hz", panelType: "Super AMOLED" },
      performance: { processor: "Exynos 1480", ram: "8 GB / 12 GB", storage: "128 GB / 256 GB" },
      camera: { rearMain: "50 MP OIS", ultraWide: "12 MP", macro: "5 MP", front: "32 MP" },
      battery: { capacity: "5000 mAh", charging: "25W" },
      features: { fingerprint: "In-display (Optical)", fiveG: "Yes", nfc: "Yes", ipRating: "IP67", os: "Android 14 (One UI 6.1)" },
    },
    lowestPrice: 27999, avgRating: 4.3, ratingCount: 1245,
  },
  {
    id: "oppo-reno-12",
    name: "OPPO Reno 12 5G",
    brand: "OPPO",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    specs: {
      display: { size: '6.7"', resolution: "1080 x 2412 (FHD+)", refreshRate: "120 Hz", panelType: "AMOLED" },
      performance: { processor: "MediaTek Dimensity 7300", ram: "8 GB / 12 GB", storage: "256 GB / 512 GB" },
      camera: { rearMain: "50 MP OIS", ultraWide: "8 MP", macro: "2 MP", front: "32 MP" },
      battery: { capacity: "5000 mAh", charging: "80W SUPERVOOC" },
      features: { fingerprint: "In-display (Optical)", fiveG: "Yes", nfc: "Yes", ipRating: "IP65", os: "Android 14 (ColorOS 14)" },
    },
    lowestPrice: 29999, avgRating: 4.1, ratingCount: 890,
  },
  {
    id: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    specs: {
      display: { size: '6.8"', resolution: "1440 x 3120 (QHD+)", refreshRate: "120 Hz", panelType: "Dynamic AMOLED 2X" },
      performance: { processor: "Snapdragon 8 Gen 3", ram: "12 GB", storage: "256 GB / 512 GB / 1 TB" },
      camera: { rearMain: "200 MP OIS", ultraWide: "12 MP", macro: "5 MP (Telephoto 50MP)", front: "12 MP" },
      battery: { capacity: "5000 mAh", charging: "45W" },
      features: { fingerprint: "Ultrasonic (In-display)", fiveG: "Yes", nfc: "Yes", ipRating: "IP68", os: "Android 14 (One UI 6.1)" },
    },
    lowestPrice: 129999, avgRating: 4.7, ratingCount: 3420,
  },
  {
    id: "iphone-15-pro-max",
    name: "Apple iPhone 15 Pro Max",
    brand: "Apple",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    specs: {
      display: { size: '6.7"', resolution: "1290 x 2796 (Super Retina XDR)", refreshRate: "120 Hz (ProMotion)", panelType: "OLED" },
      performance: { processor: "Apple A17 Pro", ram: "8 GB", storage: "256 GB / 512 GB / 1 TB" },
      camera: { rearMain: "48 MP OIS", ultraWide: "12 MP", macro: "N/A (Telephoto 12MP 5x)", front: "12 MP TrueDepth" },
      battery: { capacity: "4441 mAh", charging: "27W + MagSafe 15W" },
      features: { fingerprint: "Face ID", fiveG: "Yes", nfc: "Yes", ipRating: "IP68", os: "iOS 17" },
    },
    lowestPrice: 156900, avgRating: 4.8, ratingCount: 5680,
  },
  {
    id: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    specs: {
      display: { size: '6.82"', resolution: "1440 x 3168 (QHD+)", refreshRate: "120 Hz LTPO", panelType: "AMOLED" },
      performance: { processor: "Snapdragon 8 Gen 3", ram: "12 GB / 16 GB", storage: "256 GB / 512 GB" },
      camera: { rearMain: "50 MP OIS (Sony LYT-808)", ultraWide: "48 MP", macro: "64 MP Periscope", front: "32 MP" },
      battery: { capacity: "5400 mAh", charging: "100W SUPERVOOC" },
      features: { fingerprint: "In-display (Optical)", fiveG: "Yes", nfc: "Yes", ipRating: "IP65", os: "Android 14 (OxygenOS 14)" },
    },
    lowestPrice: 64999, avgRating: 4.5, ratingCount: 2100,
  },
  {
    id: "vivo-x100-pro",
    name: "Vivo X100 Pro",
    brand: "Vivo",
    category: "Mobiles",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    specs: {
      display: { size: '6.78"', resolution: "1260 x 2800 (QHD+)", refreshRate: "120 Hz LTPO", panelType: "AMOLED" },
      performance: { processor: "MediaTek Dimensity 9300", ram: "16 GB", storage: "256 GB / 512 GB" },
      camera: { rearMain: "50 MP OIS (ZEISS)", ultraWide: "50 MP", macro: "64 MP Periscope (ZEISS)", front: "32 MP" },
      battery: { capacity: "5400 mAh", charging: "100W FlashCharge" },
      features: { fingerprint: "In-display (Optical)", fiveG: "Yes", nfc: "Yes", ipRating: "IP68", os: "Android 14 (FunTouch OS 14)" },
    },
    lowestPrice: 89999, avgRating: 4.4, ratingCount: 780,
  },

  // ═══ TVs ═══
  {
    id: "samsung-43-crystal-4k",
    name: 'Samsung 43" Crystal 4K TV',
    brand: "Samsung",
    category: "TVs",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    specs: {
      display: { size: '43"', resolution: "3840 x 2160 (4K UHD)", refreshRate: "60 Hz", panelType: "LED" },
      performance: { processor: "Crystal Processor 4K", ram: "2 GB", storage: "8 GB" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A (Mains)", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "Tizen OS" },
      tv: { hdmiPorts: "3", screenToBodyRatio: "95%" },
    },
    lowestPrice: 29990, avgRating: 4.2, ratingCount: 3200,
  },
  {
    id: "lg-55-oled-c3",
    name: 'LG 55" OLED C3',
    brand: "LG",
    category: "TVs",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    specs: {
      display: { size: '55"', resolution: "3840 x 2160 (4K OLED)", refreshRate: "120 Hz", panelType: "OLED evo" },
      performance: { processor: "α9 Gen6 AI", ram: "4 GB", storage: "16 GB" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A (Mains)", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "webOS 23" },
      tv: { hdmiPorts: "4 (HDMI 2.1)", screenToBodyRatio: "97%" },
    },
    lowestPrice: 116990, avgRating: 4.6, ratingCount: 1850,
  },

  // ═══ LAPTOPS ═══
  {
    id: "macbook-air-m3",
    name: 'MacBook Air M3 15"',
    brand: "Apple",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    specs: {
      display: { size: '15.3"', resolution: "2880 x 1864 (Liquid Retina)", refreshRate: "60 Hz", panelType: "IPS" },
      performance: { processor: "Apple M3 (8-core)", ram: "8 GB / 16 GB / 24 GB", storage: "256 GB / 512 GB / 1 TB / 2 TB", storageType: "SSD", graphicsCard: "Integrated (10-core GPU)", weight: "1.51 kg" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "1080p FaceTime HD" },
      battery: { capacity: "66.5 Wh", charging: "70W MagSafe", backupHours: "18 hrs" },
      features: { fingerprint: "Touch ID", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "macOS Sonoma" },
    },
    lowestPrice: 134900, avgRating: 4.7, ratingCount: 4500,
  },
  {
    id: "dell-xps-15",
    name: "Dell XPS 15 (2024)",
    brand: "Dell",
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    specs: {
      display: { size: '15.6"', resolution: "3456 x 2160 (3.5K OLED)", refreshRate: "60 Hz", panelType: "OLED" },
      performance: { processor: "Intel Core Ultra 7 155H", ram: "16 GB / 32 GB / 64 GB", storage: "512 GB / 1 TB / 2 TB", storageType: "SSD (NVMe)", graphicsCard: "NVIDIA RTX 4060 8GB", weight: "1.86 kg" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "1080p IR" },
      battery: { capacity: "86 Wh", charging: "130W USB-C", backupHours: "13 hrs" },
      features: { fingerprint: "Fingerprint Reader", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "Windows 11 Pro" },
    },
    lowestPrice: 149990, avgRating: 4.4, ratingCount: 1200,
  },

  // ═══ ACs ═══
  {
    id: "daikin-1-5ton-5star",
    name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
    brand: "Daikin",
    category: "ACs",
    image: "https://images.unsplash.com/photo-1585338107529-13afc25806f9?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      ac: { tonnage: "1.5 Ton", starRating: "5 Star", inverter: "Yes", coolingCapacity: "5280 W", unitsPerYear: "818 units" },
    },
    lowestPrice: 42990, avgRating: 4.4, ratingCount: 2300,
  },
  {
    id: "lg-1-5ton-4star",
    name: "LG 1.5 Ton 4 Star AI Dual Inverter Split AC",
    brand: "LG",
    category: "ACs",
    image: "https://images.unsplash.com/photo-1585338107529-13afc25806f9?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      ac: { tonnage: "1.5 Ton", starRating: "4 Star", inverter: "Yes", coolingCapacity: "5100 W", unitsPerYear: "956 units" },
    },
    lowestPrice: 37990, avgRating: 4.3, ratingCount: 1800,
  },
  {
    id: "voltas-1ton-3star",
    name: "Voltas 1 Ton 3 Star Split AC",
    brand: "Voltas",
    category: "ACs",
    image: "https://images.unsplash.com/photo-1585338107529-13afc25806f9?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      ac: { tonnage: "1 Ton", starRating: "3 Star", inverter: "No", coolingCapacity: "3500 W", unitsPerYear: "1100 units" },
    },
    lowestPrice: 26990, avgRating: 4.0, ratingCount: 3500,
  },

  // ═══ REFRIGERATORS ═══
  {
    id: "samsung-253l-double",
    name: "Samsung 253L Double Door Refrigerator",
    brand: "Samsung",
    category: "Refrigerators",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      fridge: { capacityL: "253 L", type: "Double Door", starRating: "3 Star", inverter: "Yes (Digital Inverter)", warrantyYears: "1 + 20 years compressor" },
    },
    lowestPrice: 23490, avgRating: 4.3, ratingCount: 4500,
  },
  {
    id: "lg-343l-frost-free",
    name: "LG 343L Frost Free Double Door",
    brand: "LG",
    category: "Refrigerators",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      fridge: { capacityL: "343 L", type: "Double Door", starRating: "4 Star", inverter: "Yes (Smart Inverter)", warrantyYears: "1 + 10 years compressor" },
    },
    lowestPrice: 34990, avgRating: 4.4, ratingCount: 2800,
  },

  // ═══ WASHING MACHINES ═══
  {
    id: "lg-8kg-front-load",
    name: "LG 8 Kg Front Load Washing Machine",
    brand: "LG",
    category: "Washing Machines",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      washer: { capacityKg: "8 kg", type: "Front Load", rpm: "1400 RPM", starRating: "5 Star" },
    },
    lowestPrice: 35990, avgRating: 4.5, ratingCount: 3200,
  },
  {
    id: "samsung-7kg-top-load",
    name: "Samsung 7 Kg Top Load Washing Machine",
    brand: "Samsung",
    category: "Washing Machines",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      washer: { capacityKg: "7 kg", type: "Top Load", rpm: "700 RPM", starRating: "4 Star" },
    },
    lowestPrice: 18990, avgRating: 4.2, ratingCount: 5600,
  },
  {
    id: "ifb-65kg-front-load",
    name: "IFB 6.5 Kg Front Load Washing Machine",
    brand: "IFB",
    category: "Washing Machines",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop",
    specs: {
      display: { size: "N/A", resolution: "N/A", refreshRate: "N/A", panelType: "N/A" },
      performance: { processor: "N/A", ram: "N/A", storage: "N/A" },
      camera: { rearMain: "N/A", ultraWide: "N/A", macro: "N/A", front: "N/A" },
      battery: { capacity: "N/A", charging: "N/A" },
      features: { fingerprint: "N/A", fiveG: "N/A", nfc: "N/A", ipRating: "N/A", os: "N/A" },
      washer: { capacityKg: "6.5 kg", type: "Front Load", rpm: "1000 RPM", starRating: "5 Star" },
    },
    lowestPrice: 24990, avgRating: 4.3, ratingCount: 2100,
  },
];

/* ── Mock sellers per model ── */
export interface ModelSeller {
  name: string;
  type: "local" | "online";
  price: number;
  distance?: number;
  rating: number;
  reviews: number;
  url: string;
  phone?: string;
}

export function getSellersForModel(model: ModelSpec): ModelSeller[] {
  const base: ModelSeller[] = [
    { name: "Amazon", type: "online", price: model.lowestPrice + Math.floor(Math.random() * 2000), rating: 4.3, reviews: 12400, url: "https://amazon.in" },
    { name: "Flipkart", type: "online", price: model.lowestPrice + Math.floor(Math.random() * 1500), rating: 4.2, reviews: 8900, url: "https://flipkart.com" },
    { name: "Croma", type: "online", price: model.lowestPrice + Math.floor(Math.random() * 3000 + 500), rating: 4.0, reviews: 2100, url: "https://croma.com" },
  ];
  if (["Mobiles", "TVs", "Laptops", "Washing Machines", "Refrigerators", "ACs"].includes(model.category)) {
    base.push(
      { name: "Sangeetha Electronics", type: "local", price: model.lowestPrice - 500, distance: 2.4, rating: 4.5, reviews: 340, url: "#", phone: "+91 98765 67890" },
      { name: "Poorvika Mobiles", type: "local", price: model.lowestPrice + 200, distance: 1.2, rating: 4.6, reviews: 520, url: "#", phone: "+91 98765 43210" },
    );
  }
  return base.sort((a, b) => a.price - b.price);
}

export const CATEGORIES = ["Mobiles", "TVs", "Laptops", "ACs", "Refrigerators", "Washing Machines"] as const;
export type CompareCategory = (typeof CATEGORIES)[number];
