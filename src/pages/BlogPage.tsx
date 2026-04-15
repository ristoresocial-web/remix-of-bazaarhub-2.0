import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  { id: "1", slug: "5-tips-best-price-tv", title: "5 Tips to Get the Best Price When Buying a TV Locally in India", category: "Buyer Tips", date: "April 10, 2026", readTime: "6 min", excerpt: "Learn how to negotiate with local shops, when to buy online vs in-store, and what questions to ask before any electronics purchase.", image: "/placeholder.svg", featured: true },
  { id: "2", slug: "local-shops-beating-amazon-chennai", title: "How Local Shops Are Beating Amazon on Price in Chennai", category: "Market Data", date: "March 28, 2026", readTime: "4 min", excerpt: "Our data shows local Chennai electronics shops were cheaper than Amazon on 38% of products in March.", image: "/placeholder.svg" },
  { id: "3", slug: "gst-electronics-explained", title: "Understanding GST on Electronics — What Buyers Need to Know", category: "Price Guide", date: "March 15, 2026", readTime: "5 min", excerpt: "GST on mobile phones is 18%. Here's how it affects what you pay online vs local.", image: "/placeholder.svg" },
  { id: "4", slug: "seller-guide-price-intel", title: "How to Use Price Intel to Never Lose a Sale to Amazon", category: "Seller Guide", date: "March 5, 2026", readTime: "7 min", excerpt: "A step-by-step guide to BazaarHub's Price Intel feature for sellers.", image: "/placeholder.svg" },
  { id: "5", slug: "best-phones-under-15000-april-2026", title: "Best Phones Under ₹15,000 in April 2026 — Local vs Online Prices", category: "Buyer Tips", date: "April 1, 2026", readTime: "8 min", excerpt: "We compared 12 budget phones across Amazon, Flipkart, and local Pune shops.", image: "/placeholder.svg" },
  { id: "6", slug: "republic-day-sale-tips", title: "Republic Day Sale: How to Beat the Hype and Find Real Deals", category: "Price Guide", date: "January 20, 2026", readTime: "5 min", excerpt: "Online sales aren't always the cheapest. We explain when local shops actually win.", image: "/placeholder.svg" },
];

const categories = ["All", "Buyer Tips", "Seller Guide", "Price Guide", "Market Data"];

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [waNumber, setWaNumber] = useState("");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return blogPosts;
    return blogPosts.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.id !== featured?.id);

  return (
    <>
      <Helmet>
        <title>Blog — Bazaar Hub</title>
        <meta name="description" content="Tips, guides, and market insights for smarter buying and selling on BazaarHub." />
      </Helmet>

      <div className="container py-8 space-y-8 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <h1 className="text-2xl font-bold">BazaarHub Blog</h1>
          <p className="text-sm text-muted-foreground">Tips, guides, and market insights for smarter buying and selling.</p>
        </motion.div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
            {categories.map(c => (
              <TabsTrigger key={c} value={c} className="text-xs sm:text-sm">{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Featured Post */}
        {featured && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to={`/blog/${featured.slug}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-[16/7] bg-muted flex items-center justify-center">
                  <img src={featured.image} alt={featured.title} className="h-full w-full object-contain p-8" loading="lazy" />
                </div>
                <CardContent className="p-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">{featured.category}</Badge>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {featured.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readTime} read</span>
                  </div>
                  <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{featured.title}</h2>
                  <p className="text-sm text-muted-foreground">{featured.excerpt}</p>
                  <span className="text-sm font-semibold text-primary inline-flex items-center gap-1">Read Article <ArrowRight className="h-3.5 w-3.5" /></span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Article Grid */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Link to={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow group h-full flex flex-col">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <img src={post.image} alt={post.title} className="h-full w-full object-contain p-4" loading="lazy" />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col gap-2">
                      <Badge variant="secondary" className="text-xs w-fit">{post.category}</Badge>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                      <p className="text-xs text-muted-foreground flex-1">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No articles in this category yet.</p>
        )}

        {/* Newsletter Banner */}
        <Card className="bg-accent/50">
          <CardContent className="p-6 text-center space-y-3">
            <h2 className="font-bold text-lg">📬 Get BazaarHub Insights Weekly</h2>
            <p className="text-sm text-muted-foreground">Price trends, buying guides, and market updates — straight to your WhatsApp.</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">+91</span>
              <Input placeholder="WhatsApp number" value={waNumber} onChange={e => setWaNumber(e.target.value)} />
              <Button className="gap-1 flex-shrink-0"><Send className="h-4 w-4" /> Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BlogPage;
