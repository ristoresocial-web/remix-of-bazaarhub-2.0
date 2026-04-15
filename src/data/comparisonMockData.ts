/* ── Price Comparison Mock Data ── */

export interface ComparisonProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  specs: { key: string; value: string }[];
}

export interface OnlineSeller {
  platform: string;
  price: number;
  delivery: string;
  rating: number;
  reviewCount: number;
  url: string;
  inStock: boolean;
  color: string; // brand HSL
}

export interface LocalSeller {
  id: string;
  shopName: string;
  ownerName: string;
  price: number;
  distanceKm: number;
  city: string;
  inStock: boolean;
  phone: string;
  whatsapp: string;
  address: string;
  trustLevel: "new" | "established" | "trusted";
  rating: number;
  reviewCount: number;
  googleMapsUrl: string;
}

export interface ComparisonResult {
  product: ComparisonProduct;
  onlineSellers: OnlineSeller[];
  localSellers: LocalSeller[];
  lowestOnlinePrice: number;
  lowestLocalPrice: number;
  priceDifference: number; // negative = local cheaper
  lowestOnlinePlatform: string;
  lowestLocalShop: string;
}

function buildResult(
  product: ComparisonProduct,
  onlineSellers: OnlineSeller[],
  localSellers: LocalSeller[],
): ComparisonResult {
  const lowestOnline = Math.min(...onlineSellers.filter((s) => s.inStock).map((s) => s.price));
  const lowestLocal = Math.min(...localSellers.filter((s) => s.inStock).map((s) => s.price));
  return {
    product,
    onlineSellers,
    localSellers,
    lowestOnlinePrice: lowestOnline,
    lowestLocalPrice: lowestLocal,
    priceDifference: lowestOnline - lowestLocal, // positive = local cheaper
    lowestOnlinePlatform: onlineSellers.find((s) => s.price === lowestOnline)?.platform ?? "",
    lowestLocalShop: localSellers.find((s) => s.price === lowestLocal)?.shopName ?? "",
  };
}

const COMPARISON_DATA: ComparisonResult[] = [
  buildResult(
    {
      id: "samsung-s24-ultra",
      slug: "samsung-galaxy-s24-ultra",
      name: "Samsung Galaxy S24 Ultra",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
      category: "Mobiles",
      brand: "Samsung",
      specs: [
        { key: "Display", value: '6.8" QHD+ Dynamic AMOLED 2X' },
        { key: "Processor", value: "Snapdragon 8 Gen 3" },
        { key: "RAM", value: "12 GB" },
        { key: "Storage", value: "256 GB" },
        { key: "Camera", value: "200 MP + 12 MP + 50 MP + 10 MP" },
        { key: "Battery", value: "5000 mAh" },
      ],
    },
    [
      { platform: "Amazon", price: 131999, delivery: "2 days", rating: 4.5, reviewCount: 12340, url: "https://amazon.in", inStock: true, color: "36 100% 50%" },
      { platform: "Flipkart", price: 132500, delivery: "2 days", rating: 4.4, reviewCount: 9870, url: "https://flipkart.com", inStock: true, color: "45 95% 55%" },
      { platform: "Croma", price: 133000, delivery: "3 days", rating: 4.3, reviewCount: 2100, url: "https://croma.com", inStock: true, color: "170 70% 40%" },
    ],
    [
      { id: "ls1", shopName: "Kumar Electronics", ownerName: "Rajesh Kumar", price: 129990, distanceKm: 0.8, city: "Pune", inStock: true, phone: "+91 98765 67890", whatsapp: "9876567890", address: "MG Road, Pune", trustLevel: "trusted", rating: 4.6, reviewCount: 342, googleMapsUrl: "https://maps.google.com/?q=Kumar+Electronics+Pune" },
      { id: "ls2", shopName: "Raja Mobiles", ownerName: "Raja S.", price: 130500, distanceKm: 1.5, city: "Pune", inStock: true, phone: "+91 98765 43210", whatsapp: "9876543210", address: "FC Road, Pune", trustLevel: "trusted", rating: 4.4, reviewCount: 528, googleMapsUrl: "https://maps.google.com/?q=Raja+Mobiles+Pune" },
      { id: "ls3", shopName: "Smart Store", ownerName: "Amit P.", price: 131000, distanceKm: 2.3, city: "Pune", inStock: true, phone: "+91 98765 11111", whatsapp: "9876511111", address: "JM Road, Pune", trustLevel: "established", rating: 4.1, reviewCount: 89, googleMapsUrl: "https://maps.google.com/?q=Smart+Store+Pune" },
      { id: "ls4", shopName: "Phone Plaza", ownerName: "Kiran M.", price: 132800, distanceKm: 4.1, city: "Pune", inStock: false, phone: "+91 98765 22222", whatsapp: "9876522222", address: "Kothrud, Pune", trustLevel: "new", rating: 3.9, reviewCount: 18, googleMapsUrl: "https://maps.google.com/?q=Phone+Plaza+Pune" },
    ],
  ),
  buildResult(
    {
      id: "iphone-15-pro-max",
      slug: "iphone-15-pro-max",
      name: "iPhone 15 Pro Max",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
      category: "Mobiles",
      brand: "Apple",
      specs: [
        { key: "Display", value: '6.7" Super Retina XDR OLED' },
        { key: "Processor", value: "A17 Pro" },
        { key: "RAM", value: "8 GB" },
        { key: "Storage", value: "256 GB" },
        { key: "Camera", value: "48 MP + 12 MP + 12 MP" },
        { key: "Battery", value: "4441 mAh" },
      ],
    },
    [
      { platform: "Amazon", price: 156900, delivery: "1 day", rating: 4.6, reviewCount: 18500, url: "https://amazon.in", inStock: true, color: "36 100% 50%" },
      { platform: "Flipkart", price: 157999, delivery: "2 days", rating: 4.5, reviewCount: 14200, url: "https://flipkart.com", inStock: true, color: "45 95% 55%" },
      { platform: "Croma", price: 159900, delivery: "3 days", rating: 4.4, reviewCount: 3200, url: "https://croma.com", inStock: true, color: "170 70% 40%" },
    ],
    [
      { id: "ls5", shopName: "iWorld Pune", ownerName: "Sunil D.", price: 155500, distanceKm: 1.2, city: "Pune", inStock: true, phone: "+91 98765 33333", whatsapp: "9876533333", address: "Camp Area, Pune", trustLevel: "trusted", rating: 4.7, reviewCount: 612, googleMapsUrl: "https://maps.google.com/?q=iWorld+Pune" },
      { id: "ls6", shopName: "Apple Galaxy Store", ownerName: "Pranav R.", price: 156200, distanceKm: 2.8, city: "Pune", inStock: true, phone: "+91 98765 44444", whatsapp: "9876544444", address: "Viman Nagar, Pune", trustLevel: "established", rating: 4.3, reviewCount: 178, googleMapsUrl: "https://maps.google.com/?q=Apple+Galaxy+Pune" },
      { id: "ls7", shopName: "Gadget Zone", ownerName: "Akhil M.", price: 157000, distanceKm: 3.5, city: "Pune", inStock: true, phone: "+91 98765 55555", whatsapp: "9876555555", address: "Hadapsar, Pune", trustLevel: "new", rating: 4.0, reviewCount: 42, googleMapsUrl: "https://maps.google.com/?q=Gadget+Zone+Pune" },
    ],
  ),
  buildResult(
    {
      id: "samsung-43-crystal-4k",
      slug: "samsung-43-crystal-4k-tv",
      name: 'Samsung 43" Crystal 4K TV',
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
      category: "TVs",
      brand: "Samsung",
      specs: [
        { key: "Display", value: '43" Crystal UHD 4K' },
        { key: "Resolution", value: "3840 x 2160" },
        { key: "Smart TV", value: "Tizen OS" },
        { key: "HDR", value: "HDR10+" },
        { key: "Sound", value: "20W, 2 speakers" },
      ],
    },
    [
      { platform: "Amazon", price: 33990, delivery: "3 days", rating: 4.3, reviewCount: 8700, url: "https://amazon.in", inStock: true, color: "36 100% 50%" },
      { platform: "Flipkart", price: 34499, delivery: "3 days", rating: 4.2, reviewCount: 6500, url: "https://flipkart.com", inStock: true, color: "45 95% 55%" },
      { platform: "Croma", price: 35990, delivery: "5 days", rating: 4.1, reviewCount: 1200, url: "https://croma.com", inStock: true, color: "170 70% 40%" },
    ],
    [
      { id: "ls8", shopName: "Vishal Electronics", ownerName: "Vishal K.", price: 32500, distanceKm: 1.0, city: "Pune", inStock: true, phone: "+91 98765 66666", whatsapp: "9876566666", address: "Swargate, Pune", trustLevel: "trusted", rating: 4.5, reviewCount: 290, googleMapsUrl: "https://maps.google.com/?q=Vishal+Electronics+Pune" },
      { id: "ls9", shopName: "TV Mart", ownerName: "Deepak N.", price: 33200, distanceKm: 2.2, city: "Pune", inStock: true, phone: "+91 98765 77777", whatsapp: "9876577777", address: "Deccan, Pune", trustLevel: "established", rating: 4.2, reviewCount: 105, googleMapsUrl: "https://maps.google.com/?q=TV+Mart+Pune" },
      { id: "ls10", shopName: "Home Appliance Hub", ownerName: "Sachin T.", price: 34000, distanceKm: 3.8, city: "Pune", inStock: true, phone: "+91 98765 88888", whatsapp: "9876588888", address: "Aundh, Pune", trustLevel: "new", rating: 3.8, reviewCount: 32, googleMapsUrl: "https://maps.google.com/?q=Home+Appliance+Hub+Pune" },
    ],
  ),
  buildResult(
    {
      id: "hp-pavilion-15",
      slug: "hp-pavilion-laptop-15",
      name: "HP Pavilion Laptop 15",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
      category: "Laptops",
      brand: "HP",
      specs: [
        { key: "Display", value: '15.6" FHD IPS' },
        { key: "Processor", value: "Intel Core i5-1335U" },
        { key: "RAM", value: "16 GB" },
        { key: "Storage", value: "512 GB SSD" },
        { key: "Graphics", value: "Intel Iris Xe" },
        { key: "Battery", value: "Up to 8 hours" },
      ],
    },
    [
      { platform: "Amazon", price: 62990, delivery: "2 days", rating: 4.2, reviewCount: 5600, url: "https://amazon.in", inStock: true, color: "36 100% 50%" },
      { platform: "Flipkart", price: 63499, delivery: "2 days", rating: 4.1, reviewCount: 4200, url: "https://flipkart.com", inStock: true, color: "45 95% 55%" },
      { platform: "Reliance Digital", price: 64990, delivery: "4 days", rating: 4.0, reviewCount: 980, url: "https://reliancedigital.in", inStock: true, color: "210 80% 45%" },
    ],
    [
      { id: "ls11", shopName: "CompuWorld", ownerName: "Manish G.", price: 61500, distanceKm: 1.5, city: "Pune", inStock: true, phone: "+91 98765 99999", whatsapp: "9876599999", address: "Baner, Pune", trustLevel: "trusted", rating: 4.4, reviewCount: 215, googleMapsUrl: "https://maps.google.com/?q=CompuWorld+Pune" },
      { id: "ls12", shopName: "Laptop Corner", ownerName: "Nitin P.", price: 62200, distanceKm: 2.5, city: "Pune", inStock: true, phone: "+91 98765 00001", whatsapp: "9876500001", address: "Shivaji Nagar, Pune", trustLevel: "established", rating: 4.2, reviewCount: 134, googleMapsUrl: "https://maps.google.com/?q=Laptop+Corner+Pune" },
      { id: "ls13", shopName: "TechBuy", ownerName: "Rohit S.", price: 63800, distanceKm: 5.0, city: "Pune", inStock: false, phone: "+91 98765 00002", whatsapp: "9876500002", address: "Hinjewadi, Pune", trustLevel: "new", rating: 3.7, reviewCount: 22, googleMapsUrl: "https://maps.google.com/?q=TechBuy+Pune" },
    ],
  ),
  buildResult(
    {
      id: "lg-oled-c3-55",
      slug: "lg-oled-c3-55-tv",
      name: 'LG OLED C3 55" TV',
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
      category: "TVs",
      brand: "LG",
      specs: [
        { key: "Display", value: '55" OLED evo 4K' },
        { key: "Resolution", value: "3840 x 2160" },
        { key: "Smart TV", value: "webOS 23" },
        { key: "HDR", value: "Dolby Vision / HDR10 / HLG" },
        { key: "Sound", value: "40W, 2.2ch" },
        { key: "Refresh Rate", value: "120 Hz" },
      ],
    },
    [
      { platform: "Amazon", price: 119990, delivery: "3 days", rating: 4.6, reviewCount: 4300, url: "https://amazon.in", inStock: true, color: "36 100% 50%" },
      { platform: "Flipkart", price: 121999, delivery: "3 days", rating: 4.5, reviewCount: 3100, url: "https://flipkart.com", inStock: true, color: "45 95% 55%" },
      { platform: "Croma", price: 124900, delivery: "5 days", rating: 4.4, reviewCount: 1800, url: "https://croma.com", inStock: false, color: "170 70% 40%" },
    ],
    [
      { id: "ls14", shopName: "AV Studio Pune", ownerName: "Sanjay R.", price: 117500, distanceKm: 1.8, city: "Pune", inStock: true, phone: "+91 98765 00003", whatsapp: "9876500003", address: "Koregaon Park, Pune", trustLevel: "trusted", rating: 4.7, reviewCount: 186, googleMapsUrl: "https://maps.google.com/?q=AV+Studio+Pune" },
      { id: "ls15", shopName: "Display Den", ownerName: "Rahul B.", price: 119000, distanceKm: 3.2, city: "Pune", inStock: true, phone: "+91 98765 00004", whatsapp: "9876500004", address: "Wakad, Pune", trustLevel: "established", rating: 4.3, reviewCount: 92, googleMapsUrl: "https://maps.google.com/?q=Display+Den+Pune" },
      { id: "ls16", shopName: "Premium AV", ownerName: "Vikram J.", price: 120500, distanceKm: 4.5, city: "Pune", inStock: true, phone: "+91 98765 00005", whatsapp: "9876500005", address: "Pimpri, Pune", trustLevel: "new", rating: 4.0, reviewCount: 45, googleMapsUrl: "https://maps.google.com/?q=Premium+AV+Pune" },
    ],
  ),
];

export function getComparisonBySlug(slug: string): ComparisonResult | undefined {
  return COMPARISON_DATA.find((d) => d.product.slug === slug);
}

export function getComparisonById(id: string): ComparisonResult | undefined {
  return COMPARISON_DATA.find((d) => d.product.id === id);
}

export function searchComparisonProducts(query: string): ComparisonResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return COMPARISON_DATA;
  return COMPARISON_DATA.filter(
    (d) =>
      d.product.name.toLowerCase().includes(q) ||
      d.product.brand.toLowerCase().includes(q) ||
      d.product.category.toLowerCase().includes(q),
  );
}

export { COMPARISON_DATA };
