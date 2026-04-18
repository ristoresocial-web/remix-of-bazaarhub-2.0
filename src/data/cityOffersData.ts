export interface CityOffer {
  id: number;
  shopName: string;
  address: string;
  googleMapsUrl: string;
  lat: number;
  lng: number;
  startDate: string; // ISO
  endDate: string;   // ISO
  productDescription: string;
  category: string;
  contactPhone: string;
  contactWhatsapp: string;
  photos: string[];
  distance: number; // km from user
  rating: number;
  reviewCount: number;
  originalPrice: number;
  offerPrice: number;
}

export type OfferStatus = {
  key: "live" | "ending" | "upcoming";
  label: string;
  color: string;
  emoji: string;
};

export const getOfferStatus = (offer: CityOffer): OfferStatus => {
  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);

  if (now < start) {
    return { key: "upcoming", label: "Upcoming", color: "bg-primary/10 text-primary border-primary/20", emoji: "🔵" };
  }

  const hoursLeft = (end.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursLeft <= 24 && hoursLeft > 0) {
    return { key: "ending", label: "Ending Today", color: "bg-warning/10 text-warning-foreground border-warning/20", emoji: "🟡" };
  }

  if (now >= start && now <= end) {
    return { key: "live", label: "Live Now", color: "bg-success/10 text-success border-success/20", emoji: "🟢" };
  }

  return { key: "live", label: "Ended", color: "bg-muted text-muted-foreground border-border", emoji: "⚫" };
};

export const getDaysLeft = (offer: CityOffer): number => {
  const now = new Date();
  const end = new Date(offer.endDate);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
};

export const CATEGORY_OPTIONS = ["All", "Electronics", "Mobiles", "Fashion", "Food", "Home & Living", "Books"];

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString();
};

export const mockCityOffers: CityOffer[] = [
  {
    id: 1,
    shopName: "Sangeetha Electronics Pop-up",
    address: "Anna Nagar, 2nd Cross Street, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9252,78.1198",
    lat: 9.9252, lng: 78.1198,
    startDate: d(-5), endDate: d(3),
    productDescription: "Samsung 43\" Crystal 4K Smart TV — Festival clearance with free wall mount and 2-year warranty.",
    category: "Electronics",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&h=400&fit=crop",
    ],
    distance: 2.4, rating: 4.5, reviewCount: 28,
    originalPrice: 32000, offerPrice: 26990,
  },
  {
    id: 2,
    shopName: "Poorvika Mobiles Expo",
    address: "KK Nagar Main Road, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9312,78.1125",
    lat: 9.9312, lng: 78.1125,
    startDate: d(-2), endDate: d(0), // ending today
    productDescription: "Samsung Galaxy S24 Ultra — Exchange bonus ₹10,000 extra + free Galaxy Buds.",
    category: "Mobiles",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
    ],
    distance: 1.2, rating: 4.8, reviewCount: 64,
    originalPrice: 139990, offerPrice: 119990,
  },
  {
    id: 3,
    shopName: "TechWorld Weekend Bazaar",
    address: "Goripalayam Circle, Near Bus Stand, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9195,78.1270",
    lat: 9.9195, lng: 78.127,
    startDate: d(-1), endDate: d(5),
    productDescription: "LG 55\" OLED C3 TV — Live demo unit, best-in-class contrast. Free soundbar with purchase.",
    category: "Electronics",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    ],
    distance: 3.1, rating: 4.2, reviewCount: 15,
    originalPrice: 132990, offerPrice: 109990,
  },
  {
    id: 4,
    shopName: "iStore Madurai — Pongal Mela",
    address: "Tallakulam, Near Meenakshi Temple, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9202,78.1195",
    lat: 9.9202, lng: 78.1195,
    startDate: d(2), endDate: d(8), // upcoming
    productDescription: "iPhone 15 Pro Max — Pongal special with free AirPods Pro and AppleCare+.",
    category: "Mobiles",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop",
    ],
    distance: 2.5, rating: 4.9, reviewCount: 102,
    originalPrice: 164900, offerPrice: 149900,
  },
  {
    id: 5,
    shopName: "Kumar Audio Clearance",
    address: "Bypass Road, Vilangudi, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9450,78.1050",
    lat: 9.945, lng: 78.105,
    startDate: d(-3), endDate: d(1),
    productDescription: "Sony WH-1000XM5 headphones — Last stock clearance. All colors available. Box-open discount extra.",
    category: "Electronics",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
    ],
    distance: 4.0, rating: 3.9, reviewCount: 8,
    originalPrice: 31990, offerPrice: 24990,
  },
  {
    id: 6,
    shopName: "FashionStreet Pop-up Store",
    address: "Periyar Bus Stand Road, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9180,78.1300",
    lat: 9.918, lng: 78.13,
    startDate: d(-1), endDate: d(4),
    productDescription: "Premium branded kurtas & sarees — Wedding collection 2025. Alteration available on-site.",
    category: "Fashion",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=400&fit=crop",
    ],
    distance: 1.8, rating: 4.6, reviewCount: 42,
    originalPrice: 4999, offerPrice: 2499,
  },
  {
    id: 7,
    shopName: "Madurai Food Fest Stall",
    address: "Tamukkam Grounds, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9230,78.1230",
    lat: 9.923, lng: 78.123,
    startDate: d(1), endDate: d(3), // upcoming
    productDescription: "Authentic Madurai jigardhanda, banana chips & spice hampers — Festival special packs.",
    category: "Food",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    ],
    distance: 2.0, rating: 4.7, reviewCount: 89,
    originalPrice: 999, offerPrice: 649,
  },
  {
    id: 8,
    shopName: "HomeStyle Weekend Market",
    address: "Simmakkal, Near Clock Tower, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9210,78.1180",
    lat: 9.921, lng: 78.118,
    startDate: d(-4), endDate: d(0), // ending today
    productDescription: "Handcrafted wooden furniture & decor — Direct from artisans. Custom orders accepted.",
    category: "Home & Living",
    contactPhone: "+91 99434 40384",
    contactWhatsapp: "9943440384",
    photos: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
    ],
    distance: 0.8, rating: 4.3, reviewCount: 33,
    originalPrice: 15999, offerPrice: 11499,
  },
];
