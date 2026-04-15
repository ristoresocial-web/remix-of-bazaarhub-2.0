export type CuisineType = "South Indian" | "North Indian" | "Street Food" | "Sweets & Desserts" | "Beverages" | "Multi-cuisine" | "Other";

export const CUISINE_OPTIONS: CuisineType[] = [
  "South Indian", "North Indian", "Street Food", "Sweets & Desserts", "Beverages", "Multi-cuisine", "Other",
];

export type FoodStallStatus = "live" | "today-only" | "starts-tomorrow" | "festival-special" | "upcoming" | "ended";

export interface FoodStall {
  id: number;
  stallName: string;
  ownerName: string;
  cuisineType: CuisineType;
  address: string;
  googleMapsUrl: string;
  lat: number;
  lng: number;
  festivalName?: string;
  startDate: string;
  endDate: string;
  todaysMenu: string;
  menuPhoto?: string;
  whatsappNumber: string;
  photos: string[];
  distance: number;
  rating: number;
  reviewCount: number;
  isCityPick?: boolean;
}

export const getFoodStallStatus = (stall: FoodStall): { key: FoodStallStatus; label: string; color: string; emoji: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(stall.startDate);
  const end = new Date(stall.endDate);
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (now > end) {
    return { key: "ended", label: "Ended", color: "bg-muted text-muted-foreground border-border", emoji: "⚫" };
  }

  if (stall.festivalName) {
    if (now >= start && now <= end) {
      return { key: "festival-special", label: "Festival Special", color: "bg-amber-100 text-amber-800 border-amber-300", emoji: "⭐" };
    }
  }

  if (startDay.getTime() === tomorrow.getTime()) {
    return { key: "starts-tomorrow", label: "Starts Tomorrow", color: "bg-primary/10 text-primary border-primary/20", emoji: "🔵" };
  }

  if (now < start) {
    return { key: "upcoming", label: "Upcoming", color: "bg-primary/10 text-primary border-primary/20", emoji: "🔵" };
  }

  if (startDay.getTime() === endDay.getTime() && startDay.getTime() === today.getTime()) {
    return { key: "today-only", label: "Today Only", color: "bg-warning/10 text-warning-foreground border-warning/20", emoji: "🟠" };
  }

  return { key: "live", label: "Live Now", color: "bg-success/10 text-success border-success/20", emoji: "🟢" };
};

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString();
};

export const mockFoodStalls: FoodStall[] = [
  {
    id: 101,
    stallName: "Madurai Jigarthanda King",
    ownerName: "Rajan",
    cuisineType: "Beverages",
    address: "Vilakku Thoon, Near Meenakshi Temple, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9195,78.1194",
    lat: 9.9195, lng: 78.1194,
    festivalName: "Pongal Food Fest 2025",
    startDate: d(-3), endDate: d(4),
    todaysMenu: "Classic Jigarthanda, Rose Jigarthanda, Badam Milk, Paruthi Paal, Filter Coffee Special",
    menuPhoto: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
    whatsappNumber: "9876501001",
    photos: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&h=400&fit=crop",
    ],
    distance: 0.5, rating: 4.9, reviewCount: 312,
    isCityPick: true,
  },
  {
    id: 102,
    stallName: "Amma's Dosai Kadai",
    ownerName: "Lakshmi",
    cuisineType: "South Indian",
    address: "KK Nagar, Main Road, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9312,78.1125",
    lat: 9.9312, lng: 78.1125,
    startDate: d(-1), endDate: d(5),
    todaysMenu: "Ghee Roast Dosa, Podi Dosa, Uthappam Combo, Idli Sambar Set, Kothu Parotta",
    whatsappNumber: "9876501002",
    photos: [
      "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop",
    ],
    distance: 1.2, rating: 4.7, reviewCount: 189,
  },
  {
    id: 103,
    stallName: "Delhi Chaat Corner",
    ownerName: "Amit Sharma",
    cuisineType: "North Indian",
    address: "Bypass Road, Vilangudi, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9450,78.1050",
    lat: 9.945, lng: 78.105,
    festivalName: "Street Food Carnival",
    startDate: d(0), endDate: d(0), // today only
    todaysMenu: "Pani Puri, Bhel Puri, Aloo Tikki, Chole Bhature, Dahi Vada, Golgappa Special",
    whatsappNumber: "9876501003",
    photos: [
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&h=400&fit=crop",
    ],
    distance: 4.0, rating: 4.3, reviewCount: 56,
  },
  {
    id: 104,
    stallName: "Sweet Heaven",
    ownerName: "Priya",
    cuisineType: "Sweets & Desserts",
    address: "Simmakkal, Near Clock Tower, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9210,78.1180",
    lat: 9.921, lng: 78.118,
    startDate: d(1), endDate: d(6), // starts tomorrow
    todaysMenu: "Mysore Pak, Gulab Jamun, Ras Malai, Jalebi, Custom Cakes, French Pastries",
    menuPhoto: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop",
    whatsappNumber: "9876501004",
    photos: [
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
    ],
    distance: 0.8, rating: 4.6, reviewCount: 94,
    isCityPick: true,
  },
  {
    id: 105,
    stallName: "Biryani Express",
    ownerName: "Mohammed",
    cuisineType: "Multi-cuisine",
    address: "Periyar Bus Stand Road, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9180,78.1300",
    lat: 9.918, lng: 78.13,
    festivalName: "Madurai Food Carnival 2025",
    startDate: d(-2), endDate: d(3),
    todaysMenu: "Chicken Biryani, Mutton Biryani, Egg Biryani, Veg Biryani, Chicken 65, Shawarma Plate",
    whatsappNumber: "9876501005",
    photos: [
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=400&fit=crop",
    ],
    distance: 1.8, rating: 4.5, reviewCount: 220,
  },
  {
    id: 106,
    stallName: "Chai & Snacks Hub",
    ownerName: "Suresh",
    cuisineType: "Street Food",
    address: "Anna Nagar, 2nd Cross, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9252,78.1198",
    lat: 9.9252, lng: 78.1198,
    startDate: d(-5), endDate: d(2),
    todaysMenu: "Masala Chai, Bun Butter, Bajji, Bonda, Egg Puff, Vada Pav, Cutting Chai",
    whatsappNumber: "9876501006",
    photos: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    ],
    distance: 2.4, rating: 4.1, reviewCount: 67,
  },
  {
    id: 107,
    stallName: "Fruit Juice Junction",
    ownerName: "Kannan",
    cuisineType: "Beverages",
    address: "Tamukkam Grounds, Madurai",
    googleMapsUrl: "https://maps.google.com/?q=9.9230,78.1230",
    lat: 9.923, lng: 78.123,
    festivalName: "Summer Fest",
    startDate: d(2), endDate: d(7),
    todaysMenu: "Fresh Mango Juice, Watermelon Cooler, Sugarcane Juice, Tender Coconut, Mixed Fruit Smoothie",
    whatsappNumber: "9876501007",
    photos: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=400&fit=crop",
    ],
    distance: 2.0, rating: 4.4, reviewCount: 45,
  },
];
