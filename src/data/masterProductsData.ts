// Master Product Specification Database

export type ProductCategory = "Mobiles" | "TVs" | "Laptops" | "Audio" | "Appliances" | "Cameras" | "Tablets" | "Wearables";

export interface MobileSpecs {
  ram: string;
  storage: string;
  rear_camera: string;
  front_camera: string;
  battery: string;
  processor: string;
  display_size: string;
  refresh_rate: string;
  has_5g: boolean;
  fingerprint_type: string;
  os_version: string;
}

export interface TVSpecs {
  screen_size: string;
  resolution: string;
  panel_type: string;
  refresh_rate: string;
  smart_tv: boolean;
  os: string;
  hdmi_ports: number;
  speaker_output: string;
  hdr_support: string;
}

export interface LaptopSpecs {
  processor: string;
  ram: string;
  storage: string;
  display_size: string;
  resolution: string;
  gpu: string;
  battery_life: string;
  os: string;
  weight: string;
  ports: string;
}

export interface AudioSpecs {
  type: string;
  driver_size: string;
  frequency_response: string;
  battery_life: string;
  noise_cancellation: boolean;
  connectivity: string;
  water_resistance: string;
  weight: string;
}

export interface ApplianceSpecs {
  type: string;
  capacity: string;
  power_rating: string;
  energy_rating: string;
  features: string;
  warranty: string;
}

export type ProductSpecs = MobileSpecs | TVSpecs | LaptopSpecs | AudioSpecs | ApplianceSpecs | Record<string, string | number | boolean>;

export interface MasterProduct {
  id: number;
  brand: string;
  model_name: string;
  category: ProductCategory;
  subcategory: string;
  specs: ProductSpecs;
  mrp: number;
  image_url: string;
  status: "active" | "discontinued" | "pending_verification";
  addedAt: string;
  addedBy: string;
}

export const CATEGORY_SPEC_FIELDS: Record<string, { key: string; label: string; type: "text" | "number" | "boolean" }[]> = {
  Mobiles: [
    { key: "ram", label: "RAM", type: "text" },
    { key: "storage", label: "Storage", type: "text" },
    { key: "rear_camera", label: "Rear Camera", type: "text" },
    { key: "front_camera", label: "Front Camera", type: "text" },
    { key: "battery", label: "Battery", type: "text" },
    { key: "processor", label: "Processor", type: "text" },
    { key: "display_size", label: "Display Size", type: "text" },
    { key: "refresh_rate", label: "Refresh Rate", type: "text" },
    { key: "has_5g", label: "5G Support", type: "boolean" },
    { key: "fingerprint_type", label: "Fingerprint Type", type: "text" },
    { key: "os_version", label: "OS Version", type: "text" },
  ],
  TVs: [
    { key: "screen_size", label: "Screen Size", type: "text" },
    { key: "resolution", label: "Resolution", type: "text" },
    { key: "panel_type", label: "Panel Type", type: "text" },
    { key: "refresh_rate", label: "Refresh Rate", type: "text" },
    { key: "smart_tv", label: "Smart TV", type: "boolean" },
    { key: "os", label: "OS", type: "text" },
    { key: "hdmi_ports", label: "HDMI Ports", type: "number" },
    { key: "speaker_output", label: "Speaker Output", type: "text" },
    { key: "hdr_support", label: "HDR Support", type: "text" },
  ],
  Laptops: [
    { key: "processor", label: "Processor", type: "text" },
    { key: "ram", label: "RAM", type: "text" },
    { key: "storage", label: "Storage", type: "text" },
    { key: "display_size", label: "Display Size", type: "text" },
    { key: "resolution", label: "Resolution", type: "text" },
    { key: "gpu", label: "GPU", type: "text" },
    { key: "battery_life", label: "Battery Life", type: "text" },
    { key: "os", label: "OS", type: "text" },
    { key: "weight", label: "Weight", type: "text" },
    { key: "ports", label: "Ports", type: "text" },
  ],
  Audio: [
    { key: "type", label: "Type", type: "text" },
    { key: "driver_size", label: "Driver Size", type: "text" },
    { key: "frequency_response", label: "Frequency Response", type: "text" },
    { key: "battery_life", label: "Battery Life", type: "text" },
    { key: "noise_cancellation", label: "Noise Cancellation", type: "boolean" },
    { key: "connectivity", label: "Connectivity", type: "text" },
    { key: "water_resistance", label: "Water Resistance", type: "text" },
    { key: "weight", label: "Weight", type: "text" },
  ],
  Appliances: [
    { key: "type", label: "Type", type: "text" },
    { key: "capacity", label: "Capacity", type: "text" },
    { key: "power_rating", label: "Power Rating", type: "text" },
    { key: "energy_rating", label: "Energy Rating", type: "text" },
    { key: "features", label: "Features", type: "text" },
    { key: "warranty", label: "Warranty", type: "text" },
  ],
};

const STORAGE_KEY = "bazaarhub_master_products";

const DEFAULT_PRODUCTS: MasterProduct[] = [
  {
    id: 1, brand: "Samsung", model_name: "Galaxy S24 Ultra 256GB", category: "Mobiles", subcategory: "Flagship",
    specs: { ram: "12GB", storage: "256GB", rear_camera: "200MP + 12MP + 50MP + 10MP", front_camera: "12MP", battery: "5000mAh", processor: "Snapdragon 8 Gen 3", display_size: "6.8\"", refresh_rate: "120Hz", has_5g: true, fingerprint_type: "Ultrasonic In-Display", os_version: "Android 14 (One UI 6.1)" },
    mrp: 131999, image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-15", addedBy: "System",
  },
  {
    id: 2, brand: "Apple", model_name: "iPhone 15 Pro Max 256GB", category: "Mobiles", subcategory: "Flagship",
    specs: { ram: "8GB", storage: "256GB", rear_camera: "48MP + 12MP + 12MP", front_camera: "12MP TrueDepth", battery: "4441mAh", processor: "A17 Pro", display_size: "6.7\"", refresh_rate: "120Hz ProMotion", has_5g: true, fingerprint_type: "Face ID", os_version: "iOS 17" },
    mrp: 159900, image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-15", addedBy: "System",
  },
  {
    id: 3, brand: "Samsung", model_name: "Galaxy S24 FE 128GB", category: "Mobiles", subcategory: "Mid-Range",
    specs: { ram: "8GB", storage: "128GB", rear_camera: "50MP + 12MP + 8MP", front_camera: "10MP", battery: "4700mAh", processor: "Exynos 2400e", display_size: "6.7\"", refresh_rate: "120Hz", has_5g: true, fingerprint_type: "Optical In-Display", os_version: "Android 14 (One UI 6.1)" },
    mrp: 59999, image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-10-01", addedBy: "System",
  },
  {
    id: 4, brand: "OnePlus", model_name: "12R 256GB", category: "Mobiles", subcategory: "Mid-Range",
    specs: { ram: "16GB", storage: "256GB", rear_camera: "50MP + 8MP + 2MP", front_camera: "16MP", battery: "5500mAh", processor: "Snapdragon 8 Gen 2", display_size: "6.78\"", refresh_rate: "120Hz", has_5g: true, fingerprint_type: "Optical In-Display", os_version: "Android 14 (OxygenOS 14)" },
    mrp: 43999, image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-23", addedBy: "System",
  },
  {
    id: 5, brand: "Sony", model_name: "WH-1000XM5", category: "Audio", subcategory: "Over-Ear Headphones",
    specs: { type: "Over-Ear Wireless", driver_size: "30mm", frequency_response: "4Hz-40kHz", battery_life: "30 hours", noise_cancellation: true, connectivity: "Bluetooth 5.3, 3.5mm", water_resistance: "None", weight: "250g" },
    mrp: 29990, image_url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-15", addedBy: "System",
  },
  {
    id: 6, brand: "LG", model_name: "OLED C3 55\" 4K Smart TV", category: "TVs", subcategory: "OLED TV",
    specs: { screen_size: "55\"", resolution: "4K (3840x2160)", panel_type: "OLED evo", refresh_rate: "120Hz", smart_tv: true, os: "webOS 23", hdmi_ports: 4, speaker_output: "40W", hdr_support: "Dolby Vision, HDR10, HLG" },
    mrp: 129990, image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-15", addedBy: "System",
  },
  {
    id: 7, brand: "Samsung", model_name: "Crystal 4K 43\" UHD TV (2024)", category: "TVs", subcategory: "LED TV",
    specs: { screen_size: "43\"", resolution: "4K (3840x2160)", panel_type: "VA", refresh_rate: "60Hz", smart_tv: true, os: "Tizen 7.0", hdmi_ports: 3, speaker_output: "20W", hdr_support: "HDR10+" },
    mrp: 32990, image_url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-03-10", addedBy: "System",
  },
  {
    id: 8, brand: "Apple", model_name: "MacBook Air M3 15\" 256GB", category: "Laptops", subcategory: "Ultrabook",
    specs: { processor: "Apple M3", ram: "8GB Unified", storage: "256GB SSD", display_size: "15.3\"", resolution: "2880x1864 Liquid Retina", gpu: "10-core GPU", battery_life: "18 hours", os: "macOS Sonoma", weight: "1.51kg", ports: "2x Thunderbolt/USB 4, MagSafe 3, 3.5mm" },
    mrp: 134900, image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-03-08", addedBy: "System",
  },
  {
    id: 9, brand: "HP", model_name: "Pavilion 15 (2024)", category: "Laptops", subcategory: "Mainstream",
    specs: { processor: "Intel Core i5-1335U", ram: "16GB DDR4", storage: "512GB SSD", display_size: "15.6\"", resolution: "1920x1080 IPS", gpu: "Intel Iris Xe", battery_life: "8.5 hours", os: "Windows 11 Home", weight: "1.75kg", ports: "USB-C, 2x USB-A, HDMI, 3.5mm" },
    mrp: 67999, image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-02-20", addedBy: "System",
  },
  {
    id: 10, brand: "Samsung", model_name: "Galaxy Buds2 Pro", category: "Audio", subcategory: "TWS Earbuds",
    specs: { type: "TWS In-Ear", driver_size: "10mm", frequency_response: "20Hz-20kHz", battery_life: "5h (29h with case)", noise_cancellation: true, connectivity: "Bluetooth 5.3", water_resistance: "IPX7", weight: "5.5g per bud" },
    mrp: 17999, image_url: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-15", addedBy: "System",
  },
  {
    id: 11, brand: "LG", model_name: "8kg Front Load Washing Machine", category: "Appliances", subcategory: "Washing Machine",
    specs: { type: "Front Load", capacity: "8kg", power_rating: "2100W", energy_rating: "5 Star", features: "AI Direct Drive, Steam Wash, WiFi", warranty: "2 Years + 10 Years Motor" },
    mrp: 42990, image_url: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-04-15", addedBy: "System",
  },
  {
    id: 12, brand: "Xiaomi", model_name: "Redmi Note 13 Pro+ 5G 256GB", category: "Mobiles", subcategory: "Mid-Range",
    specs: { ram: "12GB", storage: "256GB", rear_camera: "200MP + 8MP + 2MP", front_camera: "16MP", battery: "5000mAh", processor: "MediaTek Dimensity 7200 Ultra", display_size: "6.67\"", refresh_rate: "120Hz", has_5g: true, fingerprint_type: "Optical In-Display", os_version: "Android 13 (MIUI 14)" },
    mrp: 32999, image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&h=80&fit=crop",
    status: "active", addedAt: "2024-01-10", addedBy: "System",
  },
];

export function getMasterProducts(): MasterProduct[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function saveMasterProducts(data: MasterProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function searchMasterProducts(query: string, category?: string): MasterProduct[] {
  const products = getMasterProducts().filter(p => p.status !== "discontinued" || true);
  const q = query.toLowerCase();
  return products.filter(p => {
    const matchesQuery = q.length < 2 ? false :
      p.model_name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      `${p.brand} ${p.model_name}`.toLowerCase().includes(q);
    const matchesCategory = !category || category === "All" || p.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function getEmptySpecs(category: string): Record<string, string | number | boolean> {
  const fields = CATEGORY_SPEC_FIELDS[category] || [];
  const specs: Record<string, string | number | boolean> = {};
  for (const f of fields) {
    specs[f.key] = f.type === "boolean" ? false : f.type === "number" ? 0 : "";
  }
  return specs;
}
