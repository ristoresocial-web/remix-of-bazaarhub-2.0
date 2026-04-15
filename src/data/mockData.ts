export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  galleryImages?: string[];
  brand: string;
  description: string;
  variants?: { sizes?: string[]; colors?: { name: string; hex: string }[] };
  specs?: [string, string][];
  prices: PriceEntry[];
  localAvailable: boolean;
  localShop?: { name: string; address: string; km: number; phone: string };
}

export interface PriceEntry {
  platform: string;
  price: number;
  url: string;
  isAffiliate: boolean;
  inStock: boolean;
}

export interface Deal {
  id: number;
  productId: number;
  title: string;
  discount: string;
  platform: string;
  originalPrice: number;
  dealPrice: number;
  image: string;
  endsAt: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

export const mockCategories: Category[] = [
  { id: 1, name: "Smartphones", icon: "📱", count: 245 },
  { id: 2, name: "Laptops", icon: "💻", count: 189 },
  { id: 3, name: "TVs", icon: "📺", count: 156 },
  { id: 4, name: "Headphones", icon: "🎧", count: 312 },
  { id: 5, name: "Cameras", icon: "📷", count: 98 },
  { id: 6, name: "Washing Machines", icon: "🧺", count: 134 },
  { id: 7, name: "Air Conditioners", icon: "❄️", count: 87 },
  { id: 8, name: "Refrigerators", icon: "🧊", count: 112 },
  { id: 9, name: "Kitchen Appliances", icon: "🍳", count: 203 },
  { id: 10, name: "Gaming", icon: "🎮", count: 176 },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    category: "Smartphones",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    description: "The Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED display, Snapdragon 8 Gen 3 processor, 200MP camera, and S Pen support.",
    variants: {
      sizes: ["128GB", "256GB", "512GB", "1TB"],
      colors: [
        { name: "Titanium Black", hex: "#2C2C2E" },
        { name: "Titanium Gray", hex: "#8E8E93" },
        { name: "Titanium Violet", hex: "#7B6BA5" },
        { name: "Titanium Yellow", hex: "#D4A84B" },
      ],
    },
    localAvailable: true,
    localShop: { name: "Poorvika Mobiles", address: "123 Main Bazaar, Madurai", km: 1.2, phone: "+91 98765 43210" },
    prices: [
      { platform: "Poorvika (Local)", price: 129990, url: "#", isAffiliate: false, inStock: true },
      { platform: "Amazon", price: 131999, url: "https://amazon.in", isAffiliate: true, inStock: true },
      { platform: "Flipkart", price: 130999, url: "https://flipkart.com", isAffiliate: true, inStock: true },
      { platform: "Croma", price: 134990, url: "https://croma.com", isAffiliate: true, inStock: true },
      { platform: "Reliance Digital", price: 133490, url: "https://reliancedigital.in", isAffiliate: true, inStock: true },
      { platform: "Sangeetha", price: 131490, url: "#", isAffiliate: false, inStock: true },
    ],
  },
  {
    id: 2,
    slug: "apple-iphone-15-pro-max",
    name: "Apple iPhone 15 Pro Max 256GB",
    category: "Smartphones",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop",
    description: "iPhone 15 Pro Max with A17 Pro chip, 48MP camera system, titanium design, and USB-C connectivity.",
    variants: {
      sizes: ["256GB", "512GB", "1TB"],
      colors: [
        { name: "Natural Titanium", hex: "#9A9A9F" },
        { name: "Blue Titanium", hex: "#3D4F5F" },
        { name: "White Titanium", hex: "#F2F1ED" },
        { name: "Black Titanium", hex: "#3C3B37" },
      ],
    },
    localAvailable: true,
    localShop: { name: "iStore Madurai", address: "45 East Masi St, Madurai", km: 2.5, phone: "+91 98765 12345" },
    prices: [
      { platform: "iStore (Local)", price: 159900, url: "#", isAffiliate: false, inStock: true },
      { platform: "Amazon", price: 156900, url: "https://amazon.in", isAffiliate: true, inStock: true },
      { platform: "Flipkart", price: 157999, url: "https://flipkart.com", isAffiliate: true, inStock: true },
      { platform: "Croma", price: 159900, url: "https://croma.com", isAffiliate: true, inStock: true },
      { platform: "Reliance Digital", price: 158490, url: "https://reliancedigital.in", isAffiliate: true, inStock: false },
    ],
  },
  {
    id: 3,
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Headphones",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    description: "Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and multipoint connection.",
    variants: {
      colors: [
        { name: "Black", hex: "#1C1C1E" },
        { name: "Silver", hex: "#C7C7CC" },
        { name: "Midnight Blue", hex: "#191970" },
      ],
    },
    localAvailable: false,
    prices: [
      { platform: "Amazon", price: 26990, url: "https://amazon.in", isAffiliate: true, inStock: true },
      { platform: "Flipkart", price: 27499, url: "https://flipkart.com", isAffiliate: true, inStock: true },
      { platform: "Croma", price: 28990, url: "https://croma.com", isAffiliate: true, inStock: true },
      { platform: "Reliance Digital", price: 27990, url: "https://reliancedigital.in", isAffiliate: true, inStock: true },
    ],
  },
  {
    id: 4,
    slug: "lg-55-oled-c3",
    name: 'LG 55" OLED C3 4K Smart TV',
    category: "TVs",
    brand: "LG",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    description: "LG OLED evo C3 Series 55-Inch Class 4K Processor Smart Flat Screen TV with Dolby Atmos and webOS.",
    localAvailable: true,
    localShop: { name: "Sangeetha Electronics", address: "78 KK Nagar, Madurai", km: 3.1, phone: "+91 98765 67890" },
    prices: [
      { platform: "Sangeetha (Local)", price: 119990, url: "#", isAffiliate: false, inStock: true },
      { platform: "Amazon", price: 116990, url: "https://amazon.in", isAffiliate: true, inStock: true },
      { platform: "Flipkart", price: 117999, url: "https://flipkart.com", isAffiliate: true, inStock: true },
      { platform: "Croma", price: 121990, url: "https://croma.com", isAffiliate: true, inStock: true },
      { platform: "Reliance Digital", price: 118990, url: "https://reliancedigital.in", isAffiliate: true, inStock: true },
      { platform: "Vijay Sales", price: 119490, url: "#", isAffiliate: true, inStock: true },
    ],
  },
  {
    id: 5,
    slug: "macbook-air-m3",
    name: "Apple MacBook Air M3 15-inch 256GB",
    category: "Laptops",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    description: "MacBook Air with M3 chip, 15.3-inch Liquid Retina display, 18-hour battery life, and MagSafe charging.",
    variants: {
      sizes: ["256GB", "512GB", "1TB"],
      colors: [
        { name: "Midnight", hex: "#1E1E2E" },
        { name: "Starlight", hex: "#F5E6D3" },
        { name: "Space Gray", hex: "#7D7D87" },
        { name: "Silver", hex: "#E3E3E8" },
      ],
    },
    localAvailable: false,
    prices: [
      { platform: "Amazon", price: 134990, url: "https://amazon.in", isAffiliate: true, inStock: true },
      { platform: "Flipkart", price: 134900, url: "https://flipkart.com", isAffiliate: true, inStock: true },
      { platform: "Croma", price: 139900, url: "https://croma.com", isAffiliate: true, inStock: true },
      { platform: "Reliance Digital", price: 136990, url: "https://reliancedigital.in", isAffiliate: true, inStock: false },
    ],
  },
  {
    id: 6,
    slug: "samsung-galaxy-buds2-pro",
    name: "Samsung Galaxy Buds2 Pro",
    category: "Headphones",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    description: "Hi-Fi 24bit Audio, Active Noise Cancellation, 360 Audio, IPX7 Water Resistance.",
    variants: {
      colors: [
        { name: "Graphite", hex: "#3A3A3C" },
        { name: "White", hex: "#F5F5F7" },
        { name: "Bora Purple", hex: "#8B7BB5" },
      ],
    },
    localAvailable: true,
    localShop: { name: "Poorvika Mobiles", address: "123 Main Bazaar, Madurai", km: 1.2, phone: "+91 98765 43210" },
    prices: [
      { platform: "Poorvika (Local)", price: 11999, url: "#", isAffiliate: false, inStock: true },
      { platform: "Amazon", price: 11499, url: "https://amazon.in", isAffiliate: true, inStock: true },
      { platform: "Flipkart", price: 11999, url: "https://flipkart.com", isAffiliate: true, inStock: true },
      { platform: "Croma", price: 12990, url: "https://croma.com", isAffiliate: true, inStock: true },
    ],
  },
];

export const mockDeals: Deal[] = [
  {
    id: 1, productId: 1, title: "Samsung Galaxy S24 Ultra — Mega Sale", discount: "8% OFF",
    platform: "Flipkart", originalPrice: 141999, dealPrice: 130999,
    image: mockProducts[0].image, endsAt: "2025-01-20",
  },
  {
    id: 2, productId: 3, title: "Sony WH-1000XM5 — Lowest Ever", discount: "15% OFF",
    platform: "Amazon", originalPrice: 31990, dealPrice: 26990,
    image: mockProducts[2].image, endsAt: "2025-01-18",
  },
  {
    id: 3, productId: 4, title: "LG OLED C3 TV — Republic Day Sale", discount: "12% OFF",
    platform: "Amazon", originalPrice: 132990, dealPrice: 116990,
    image: mockProducts[3].image, endsAt: "2025-01-26",
  },
  {
    id: 4, productId: 6, title: "Galaxy Buds2 Pro — Flash Deal", discount: "25% OFF",
    platform: "Amazon", originalPrice: 15999, dealPrice: 11499,
    image: mockProducts[5].image, endsAt: "2025-01-15",
  },
];

export const mockSamsungTV: Product = {
  id: 100,
  slug: "samsung-43-crystal-4k-tv",
  name: "Samsung 43\" Crystal 4K UHD Smart TV (2024)",
  category: "TVs",
  brand: "Samsung",
  image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
  description: "Samsung 43-inch Crystal 4K UHD Smart TV with Dynamic Crystal Color, Crystal Processor 4K, and SmartThings.",
  localAvailable: true,
  localShop: { name: "Sangeetha Electronics", address: "78 KK Nagar, Madurai", km: 2.4, phone: "+91 98765 67890" },
  prices: [
    { platform: "Sangeetha (Local)", price: 29990, url: "#", isAffiliate: false, inStock: true },
    { platform: "Amazon", price: 29999, url: "https://amazon.in", isAffiliate: true, inStock: true },
    { platform: "Flipkart", price: 30499, url: "https://flipkart.com", isAffiliate: true, inStock: true },
    { platform: "Meesho", price: 31200, url: "https://meesho.com", isAffiliate: true, inStock: true },
    { platform: "Croma", price: 31990, url: "https://croma.com", isAffiliate: true, inStock: true },
    { platform: "Reliance Digital", price: 30990, url: "https://reliancedigital.in", isAffiliate: true, inStock: true },
    { platform: "Poorvika", price: 30490, url: "#", isAffiliate: false, inStock: true },
  ],
};

export const mockSellerProducts = [
  { id: 1, name: "Samsung Galaxy S24 Ultra", price: 129990, stock: 5, status: "active" as const, views: 342 },
  { id: 2, name: "iPhone 15 Pro Max", price: 159900, stock: 3, status: "active" as const, views: 289 },
  { id: 3, name: "Sony WH-1000XM5", price: 28990, stock: 0, status: "out_of_stock" as const, views: 156 },
  { id: 4, name: "LG OLED C3 TV", price: 119990, stock: 2, status: "pending" as const, views: 98 },
];
