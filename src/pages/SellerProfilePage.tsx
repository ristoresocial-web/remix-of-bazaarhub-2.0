import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Star, Clock, Shield, Package, ChevronRight, Search, Trophy, CheckCircle, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const mockSeller = {
  id: "s1",
  name: "Kumar Electronics",
  tagline: "Your trusted electronics store since 2015. Best prices guaranteed.",
  city: "Chennai",
  area: "Anna Nagar",
  address: "45, 2nd Avenue, Anna Nagar, Chennai - 600040",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  rating: 4.5,
  reviewCount: 234,
  verified: true,
  tier: "Established",
  isOpen: true,
  joinedDate: "March 2022",
  responseTime: "< 30 mins",
  totalProducts: 24,
  categories: ["Smartphones", "TVs", "Laptops", "Accessories"],
  openHours: "10:00 AM – 9:00 PM",
  closedDays: "Sundays",
  products: [
    { id: "p1", name: "Samsung Galaxy S24", price: 129990, amazonPrice: 134999, image: "/placeholder.svg", bestInCity: true },
    { id: "p2", name: "iPhone 15 Pro Max", price: 158000, amazonPrice: 156900, image: "/placeholder.svg", bestInCity: false },
    { id: "p3", name: "LG OLED 55\" TV", price: 118500, amazonPrice: 125000, image: "/placeholder.svg", bestInCity: false },
    { id: "p4", name: "OnePlus 12", price: 64999, amazonPrice: 67999, image: "/placeholder.svg", bestInCity: false },
    { id: "p5", name: "Sony WH-1000XM5", price: 21490, amazonPrice: 24990, image: "/placeholder.svg", bestInCity: true },
    { id: "p6", name: "MacBook Air M3", price: 114900, amazonPrice: 114900, image: "/placeholder.svg", bestInCity: false },
  ],
};

const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

const SellerProfilePage: React.FC = () => {
  const { id } = useParams();
  const seller = mockSeller;
  const [search, setSearch] = useState("");

  const tierColor = seller.tier === "Trusted" ? "bg-green-500/10 text-green-700 border-green-200" : seller.tier === "Established" ? "bg-blue-500/10 text-blue-700 border-blue-200" : "bg-primary/10 text-primary border-primary/20";

  const filtered = seller.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet>
        <title>{seller.name} — Seller on Bazaar Hub</title>
        <meta name="description" content={`${seller.name} in ${seller.area}, ${seller.city}. ${seller.tagline}. Browse ${seller.totalProducts} products.`} />
      </Helmet>

      <div className="space-y-6 pb-20 md:pb-0">
        {/* Orange Gradient Banner */}
        <div className="h-32 md:h-48 bg-gradient-to-r from-primary to-primary/80" />

        <div className="container space-y-6 -mt-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/find-sellers" className="hover:text-primary transition-colors">Find Sellers</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{seller.name}</span>
          </nav>

          {/* Hero Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{seller.name}</h1>
                      {seller.verified && <Shield className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {seller.area}, {seller.city}</span>
                      <span className="flex items-center gap-1">
                        {seller.isOpen ? <span className="h-2 w-2 rounded-full bg-green-500" /> : <span className="h-2 w-2 rounded-full bg-muted-foreground" />}
                        {seller.isOpen ? "Open" : "Closed"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {seller.rating} ({seller.reviewCount} reviews)
                      </span>
                    </div>
                    <Badge variant="outline" className={`mt-3 ${tierColor}`}>{seller.tier}</Badge>
                    <p className="mt-3 text-sm text-muted-foreground italic">"{seller.tagline}"</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" className="gap-1 rounded-full">
                      <Phone className="h-4 w-4" /> Call
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 rounded-full border-green-500 text-green-600 hover:bg-green-50">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 rounded-full">
                      <Navigation className="h-4 w-4" /> Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Products Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold">Products ({seller.totalProducts})</h2>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search in this shop..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-3">
              {filtered.map((p, i) => {
                const isCheaper = p.price < p.amazonPrice;
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center">
                          <img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate notranslate">{p.name}</p>
                          <p className="text-lg font-bold text-primary notranslate">{formatPrice(p.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {p.bestInCity && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                              <Trophy className="h-3 w-3" /> Best in {seller.city}
                            </Badge>
                          )}
                          {isCheaper && !p.bestInCity && (
                            <Badge className="bg-green-500/10 text-green-700 border-green-200 gap-1">
                              <CheckCircle className="h-3 w-3" /> You're cheaper!
                            </Badge>
                          )}
                          <Button variant="outline" size="sm" className="rounded-full" asChild>
                            <Link to={`/product/${p.id}/product`}>Compare</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SellerProfilePage;
