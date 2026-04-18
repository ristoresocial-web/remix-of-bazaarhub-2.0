import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  MapPin, Phone, MessageCircle, Star, ShieldCheck, Package,
  TrendingUp, Clock, Activity, Share2, Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import ProductCard from "@/components/ProductCard";
import ReportModal from "@/components/ReportModal";
import { mockProducts } from "@/data/mockData";

interface Review {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockSeller = {
  id: "s1",
  shopName: "Kumar Electronics",
  city: "Madurai",
  area: "Anna Nagar",
  bannerImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=400&fit=crop",
  logoImage: "",
  rating: 4.3,
  reviewCount: 234,
  yearsOnPlatform: 4,
  verified: true,
  whatsapp: "9943440384",
  phone: "+919943440384",
  stats: {
    totalProducts: 156,
    totalSales: "2.4K+",
    responseRate: 98,
    avgResponseTime: "12 min",
  },
  ratingBreakdown: [
    { stars: 5, pct: 68, count: 159 },
    { stars: 4, pct: 22, count: 51 },
    { stars: 3, pct: 7, count: 16 },
    { stars: 2, pct: 2, count: 5 },
    { stars: 1, pct: 1, count: 3 },
  ],
  reviews: [
    { id: "r1", buyerName: "Rajesh M.", rating: 5, comment: "Great service! Got the best price on Samsung TV. Staff was very helpful.", date: "2 days ago" },
    { id: "r2", buyerName: "Priya S.", rating: 4, comment: "Good collection of phones. Slightly better pricing than online. Will visit again.", date: "1 week ago" },
    { id: "r3", buyerName: "Arun K.", rating: 5, comment: "Excellent after-sales support. They helped me set up everything and even gave a free case.", date: "2 weeks ago" },
    { id: "r4", buyerName: "Divya R.", rating: 4, comment: "Quick delivery and genuine product. Recommended!", date: "3 weeks ago" },
  ] as Review[],
};

// Reuse first 6 mock products as this seller's catalog
const sellerProducts = mockProducts.slice(0, 6);

const SellerProfilePage: React.FC = () => {
  const { id } = useParams();
  const seller = mockSeller;
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: seller.shopName, text: `Check out ${seller.shopName} on BazaarHub`, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share it with your friends." });
    }
  };

  return (
    <>
      <Helmet>
        <title>{seller.shopName} — Verified Seller on BazaarHub</title>
        <meta name="description" content={`${seller.shopName} in ${seller.area}, ${seller.city}. ${seller.rating}★ rated, ${seller.reviewCount} reviews. Browse ${seller.stats.totalProducts} products.`} />
      </Helmet>

      <div className="pb-20 md:pb-12">
        {/* ── Hero: Banner + Logo + Identity ── */}
        <section className="relative">
          <div
            className="h-40 md:h-64 bg-cover bg-center bg-gradient-to-r from-primary to-primary/70"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${seller.bannerImage})` }}
          />
          <div className="container -mt-16 md:-mt-20 relative z-10">
            <Card className="shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <Avatar className="h-20 w-20 md:h-28 md:w-28 border-4 border-background shadow-md ring-2 ring-primary/20 flex-shrink-0">
                    {seller.logoImage && <AvatarImage src={seller.logoImage} alt={seller.shopName} />}
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {seller.shopName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl md:text-2xl font-bold text-foreground notranslate">{seller.shopName}</h1>
                      {seller.verified && (
                        <Badge className="gap-1 bg-success/10 text-success border-success/30 hover:bg-success/15">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified Seller
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {seller.area}, {seller.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-foreground notranslate">{seller.rating}★</span>
                        <span>({seller.reviewCount.toLocaleString("en-IN")} reviews)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {seller.yearsOnPlatform} years on platform
                      </span>
                    </div>

                    {/* Contact buttons */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="gap-2 text-white hover:opacity-90"
                        style={{ backgroundColor: "#25D366" }}
                        asChild
                      >
                        <a
                          href={`https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(`Hi ${seller.shopName}, I found you on BazaarHub.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" /> WhatsApp
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                        asChild
                      >
                        <a href={`tel:${seller.phone}`}>
                          <Phone className="h-4 w-4" /> Call
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2" onClick={handleShare}>
                        <Share2 className="h-4 w-4" /> Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Stats Bar ── */}
        <section className="container mt-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <StatTile icon={<Package className="h-5 w-5" />} label="Total Products" value={seller.stats.totalProducts.toString()} />
            <StatTile icon={<TrendingUp className="h-5 w-5" />} label="Total Sales" value={seller.stats.totalSales} />
            <StatTile icon={<Activity className="h-5 w-5" />} label="Response Rate" value={`${seller.stats.responseRate}%`} />
            <StatTile icon={<Clock className="h-5 w-5" />} label="Avg Response" value={seller.stats.avgResponseTime} />
          </motion.div>
        </section>

        {/* ── Products Grid ── */}
        <section className="container mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Products by <span className="notranslate">{seller.shopName}</span>
            </h2>
            <span className="text-sm text-muted-foreground">{sellerProducts.length} listed</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {sellerProducts.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section className="container mt-10">
          <h2 className="text-xl font-bold mb-4 text-foreground">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Summary + Breakdown */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary notranslate">{seller.rating}</p>
                  <div className="flex justify-center gap-0.5 my-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`h-5 w-5 ${
                          s <= Math.floor(seller.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : s === Math.ceil(seller.rating)
                              ? "fill-yellow-400/50 text-yellow-400"
                              : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {seller.reviewCount.toLocaleString("en-IN")} reviews</p>
                </div>
                <div className="mt-5 space-y-2">
                  {seller.ratingBreakdown.map(r => (
                    <div key={r.stars} className="flex items-center gap-2 text-sm">
                      <span className="w-6 text-right font-medium">{r.stars}★</span>
                      <Progress value={r.pct} className="h-2 flex-1" />
                      <span className="w-10 text-right text-muted-foreground notranslate">{r.pct}%</span>
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
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">{r.buyerName}</span>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm mt-2 text-foreground/90">"{r.comment}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {seller.reviews.length > 3 && !showAllReviews && (
                <Button variant="outline" className="w-full" onClick={() => setShowAllReviews(true)}>
                  Load More Reviews
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer: Report Seller ── */}
        <section className="container mt-12 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>
              Seller ID: <span className="notranslate font-mono text-xs">{id ?? seller.id}</span>
            </p>
            <button
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Flag className="h-4 w-4" /> Report Seller
            </button>
          </div>
        </section>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        productName={seller.shopName}
      />
    </>
  );
};

const StatTile: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Card className="hover:shadow-md hover:border-primary/30 transition-all">
    <CardContent className="p-4 text-center">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mb-2">
        {icon}
      </div>
      <p className="text-xl md:text-2xl font-bold text-foreground notranslate">{value}</p>
      <p className="text-[11px] md:text-xs text-muted-foreground uppercase tracking-wide mt-0.5">{label}</p>
    </CardContent>
  </Card>
);

export default SellerProfilePage;
