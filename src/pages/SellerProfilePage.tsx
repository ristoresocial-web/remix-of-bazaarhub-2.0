import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Star, Clock, Shield, Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const mockSeller = {
  id: "s1",
  name: "Sri Lakshmi Mobiles",
  tagline: "Your Trusted Mobile Partner Since 2015",
  city: "Madurai",
  address: "123, Town Hall Road, Madurai - 625001",
  phone: "+91 98765 43210",
  whatsapp: "+91 98765 43210",
  rating: 4.6,
  reviewCount: 234,
  verified: true,
  tier: "Gold",
  joinedDate: "March 2022",
  responseTime: "< 30 mins",
  totalProducts: 48,
  categories: ["Smartphones", "Accessories", "Tablets"],
  openHours: "10:00 AM – 9:00 PM",
  closedDays: "Sundays",
  topProducts: [
    { id: "p1", name: "Samsung Galaxy S24 Ultra", price: "₹1,29,999", image: "/placeholder.svg" },
    { id: "p2", name: "iPhone 15 Pro Max", price: "₹1,59,900", image: "/placeholder.svg" },
    { id: "p3", name: "OnePlus 12", price: "₹64,999", image: "/placeholder.svg" },
    { id: "p4", name: "Pixel 8 Pro", price: "₹83,999", image: "/placeholder.svg" },
  ],
};

const SellerProfilePage: React.FC = () => {
  const { id } = useParams();
  const seller = mockSeller;

  const tierColor = seller.tier === "Gold" ? "bg-accent text-accent-foreground" : seller.tier === "Silver" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary";

  return (
    <>
      <Helmet>
        <title>{seller.name} — Seller on Bazaar Hub</title>
        <meta name="description" content={`${seller.name} in ${seller.city}. ${seller.tagline}. Browse ${seller.totalProducts} products.`} />
      </Helmet>

      <div className="container py-6 space-y-6">
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
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-secondary to-secondary/90 p-6 text-secondary-foreground">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">{seller.name}</h1>
                    {seller.verified && <Shield className="h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-secondary-foreground/70">{seller.tagline}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <Badge className={tierColor}>{seller.tier} Seller</Badge>
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {seller.rating} ({seller.reviewCount} reviews)
                    </span>
                    <span className="flex items-center gap-1 text-sm text-secondary-foreground/70">
                      <MapPin className="h-4 w-4" /> {seller.city}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="default" size="sm" className="gap-1">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 border-primary text-primary hover:bg-primary/10">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{seller.totalProducts}</p>
                  <p className="text-xs text-muted-foreground">Products Listed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{seller.responseTime}</p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{seller.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{seller.joinedDate}</p>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info + Products */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold">Store Info</h3>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{seller.address}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p>{seller.openHours}</p>
                      <p className="text-muted-foreground">Closed: {seller.closedDays}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {seller.categories.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="md:col-span-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">Top Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {seller.topProducts.map(p => (
                    <Link key={p.id} to={`/product/${p.id}/product`} className="group">
                      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden mb-2">
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform" loading="lazy" />
                      </div>
                      <p className="text-xs font-medium line-clamp-2 notranslate">{p.name}</p>
                      <p className="text-sm font-bold text-primary notranslate">{p.price}</p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SellerProfilePage;
