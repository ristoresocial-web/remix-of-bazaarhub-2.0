import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  MapPin, Phone, MessageCircle, Star, Shield, Package,
  ChevronRight, Search, Trophy, Navigation, Lock,
  Clock, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import TrustBadge from "@/components/TrustBadge";
import { useAuth } from "@/contexts/AuthContext";

interface SellerProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  onlineBestPrice: number;
  isBestInCity: boolean;
  category: string;
}

interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
}

const mockSeller = {
  id: "s1",
  shopName: "Kumar Electronics",
  city: "Chennai",
  area: "Anna Nagar",
  address: "42, Anna Nagar 2nd Street, Chennai 600040",
  phone: "+91 9942440384",
  whatsapp: "+91 9942440384",
  description: "Your trusted electronics store since 2015. Best prices guaranteed.",
  since: 2015,
  trustLevel: "established" as const,
  rating: 4.5,
  reviewCount: 234,
  isOpen: true,
  categories: ["Smartphones", "TVs", "Laptops", "Audio"],
  products: [
    { id: "p1", name: "Samsung Galaxy S24", price: 129990, onlineBestPrice: 134999, image: "/placeholder.svg", isBestInCity: true, category: "Smartphones" },
    { id: "p2", name: "iPhone 15 Pro Max", price: 158000, onlineBestPrice: 156900, image: "/placeholder.svg", isBestInCity: false, category: "Smartphones" },
    { id: "p3", name: "LG OLED 55\" TV", price: 118500, onlineBestPrice: 125000, image: "/placeholder.svg", isBestInCity: false, category: "TVs" },
    { id: "p4", name: "OnePlus 12", price: 64999, onlineBestPrice: 67999, image: "/placeholder.svg", isBestInCity: false, category: "Smartphones" },
    { id: "p5", name: "Sony WH-1000XM5", price: 21490, onlineBestPrice: 24990, image: "/placeholder.svg", isBestInCity: true, category: "Audio" },
    { id: "p6", name: "MacBook Air M3", price: 114900, onlineBestPrice: 114900, image: "/placeholder.svg", isBestInCity: false, category: "Laptops" },
  ] as SellerProduct[],
  reviews: [
    { id: "r1", buyerName: "Rajesh M.", rating: 5, comment: "Great service! Got the best price on Samsung TV. The staff was very helpful and knowledgeable.", productName: "Samsung 43\" 4K TV", date: "2 days ago" },
    { id: "r2", buyerName: "Priya S.", rating: 4, comment: "Good collection of phones. Slightly better pricing than online. Will visit again.", productName: "iPhone 15 Pro", date: "1 week ago" },
    { id: "r3", buyerName: "Arun K.", rating: 5, comment: "Excellent after-sales support. They helped me set up everything and even gave a free case.", productName: "OnePlus 12", date: "2 weeks ago" },
  ] as Review[],
};

const ratingBreakdown = [
  { stars: 5, pct: 68 },
  { stars: 4, pct: 22 },
  { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

const SellerProfilePage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const seller = mockSeller;
  const isLocked = !user;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("price-asc");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - seller.since;

  let filtered = seller.products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => category === "all" || p.category === category);

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const trustMap: Record<string, "new" | "established" | "trusted"> = {
    new: "new", established: "established", trusted: "trusted",
  };

  const ContactButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => {
    if (isLocked) {
      return (
        <Button variant="outline" size="sm" className="gap-1 rounded-full opacity-60 cursor-not-allowed" disabled>
          <Lock className="h-3 w-3" /> Login to contact
        </Button>
      );
    }
    return <Button size="sm" className={`gap-1 rounded-full ${className ?? ""}`} {...props}>{children}</Button>;
  };

  return (
    <>
      <Helmet>
        <title>{seller.shopName} — Seller on BazaarHub</title>
        <meta name="description" content={`${seller.shopName} in ${seller.area}, ${seller.city}. ${seller.description} Browse ${seller.products.length} products.`} />
      </Helmet>

      <div className="space-y-0 pb-20 md:pb-0">
        {/* Banner */}
        <div className="h-36 md:h-52 bg-gradient-to-r from-primary to-primary/70" />

        <div className="container space-y-6 -mt-16 md:-mt-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/find-sellers" className="hover:text-primary transition-colors">Find Sellers</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{seller.shopName}</span>
          </nav>

          {/* Hero Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {seller.shopName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 className="text-2xl font-bold">{seller.shopName}</h1>
                        <Shield className="h-5 w-5 text-primary" />
                        <TrustBadge variant={trustMap[seller.trustLevel]} />
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {seller.area}, {seller.city}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {seller.rating} ({seller.reviewCount} reviews)
                        </span>
                        <span className="flex items-center gap-1">
                          {seller.isOpen
                            ? <><span className="h-2 w-2 rounded-full bg-success" /> Open Now</>
                            : <><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Closed</>}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground italic">"{seller.description}"</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap">
                    <ContactButton>
                      <Phone className="h-4 w-4" /> Call
                    </ContactButton>
                    <ContactButton className="border-success text-success hover:bg-success/10" variant="outline">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </ContactButton>
                    <ContactButton variant="outline">
                      <Navigation className="h-4 w-4" /> Directions
                    </ContactButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Bar */}
          <div className="bg-muted rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary"><Package className="h-5 w-5 inline mr-1" />{seller.products.length}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary"><Star className="h-5 w-5 inline mr-1 fill-yellow-400 text-yellow-400" />{seller.rating}</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{seller.reviewCount}</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary"><Clock className="h-5 w-5 inline mr-1" />{yearsActive}+</p>
                <p className="text-xs text-muted-foreground">Years Active</p>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-bold mb-4">Products at {seller.shopName}</h2>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search in this shop..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {seller.categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full md:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all">
                    <CardContent className="p-4">
                      <div className="aspect-square rounded-lg bg-background mb-3 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" loading="lazy" />
                      </div>
                      <p className="font-semibold text-sm truncate notranslate">{p.name}</p>
                      <p className="text-lg font-bold text-success notranslate mt-1">{formatPrice(p.price)}</p>
                      {p.isBestInCity && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 mt-1 text-[10px]">
                          <Trophy className="h-3 w-3" /> Best in {seller.city}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm" className="w-full mt-3 rounded-full" asChild>
                        <Link to={`/product/${p.id}/product`}>Compare Prices</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No products found matching your search.</p>
            )}
          </motion.section>

          {/* Reviews Section */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Rating Summary */}
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-4xl font-bold text-primary">{seller.rating}</p>
                  <div className="flex justify-center gap-0.5 my-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-5 w-5 ${s <= Math.floor(seller.rating) ? "fill-yellow-400 text-yellow-400" : s === Math.ceil(seller.rating) ? "fill-yellow-400/50 text-yellow-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Based on {seller.reviewCount} reviews</p>
                  <div className="space-y-2">
                    {ratingBreakdown.map(r => (
                      <div key={r.stars} className="flex items-center gap-2 text-sm">
                        <span className="w-4 text-right">{r.stars}★</span>
                        <Progress value={r.pct} className="h-2 flex-1" />
                        <span className="w-10 text-right text-muted-foreground">{r.pct}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Cards */}
              <div className="md:col-span-2 space-y-3">
                {(showAllReviews ? seller.reviews : seller.reviews.slice(0, 3)).map(r => (
                  <Card key={r.id}>
                    <CardContent className="p-4 flex gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {r.buyerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{r.buyerName}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mt-1">"{r.comment}"</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Purchased: <span className="notranslate">{r.productName}</span> • {r.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {seller.reviews.length > 3 && !showAllReviews && (
                  <Button variant="outline" className="w-full rounded-full" onClick={() => setShowAllReviews(true)}>
                    Load More Reviews
                  </Button>
                )}
              </div>
            </div>
          </motion.section>

          {/* Location Card */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-bold mb-4">Shop Location</h2>
            <Card>
              <CardContent className="p-6">
                <div className="rounded-xl bg-muted h-48 flex items-center justify-center mb-4">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Map preview</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{seller.address}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1 rounded-full flex-shrink-0" asChild>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(seller.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" /> Open in Google Maps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default SellerProfilePage;
