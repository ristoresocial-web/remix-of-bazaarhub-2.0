import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const posts = [
  { id: "1", slug: "best-price-tv-locally", title: "5 Tips to Get the Best Price When Buying a TV Locally", excerpt: "Learn tips and tricks to compare prices across local sellers and online platforms before buying your next TV.", category: "Buying Guide", date: "Apr 10, 2026", readTime: "5 min", image: "/placeholder.svg" },
  { id: "2", slug: "local-shops-beating-amazon", title: "How Local Shops Are Beating Amazon on Price in Chennai", excerpt: "Discover how city-based electronics shops often offer better deals, instant delivery, and personal service.", category: "Insights", date: "Apr 5, 2026", readTime: "8 min", image: "/placeholder.svg" },
  { id: "3", slug: "understanding-gst-electronics", title: "Understanding GST on Electronics", excerpt: "Full breakdown of GST rates on electronics and why a proper invoice matters for warranty.", category: "Education", date: "Mar 28, 2026", readTime: "4 min", image: "/placeholder.svg" },
  { id: "4", slug: "price-alerts-guide", title: "Setting Up Price Alerts: A Step-by-Step Guide", excerpt: "Never miss a price drop again. Here's how to use BazaarHub's price alert feature to save money.", category: "How-To", date: "Mar 20, 2026", readTime: "3 min", image: "/placeholder.svg" },
  { id: "5", slug: "seller-success-madurai", title: "Seller Success Story: Sri Lakshmi Mobiles, Madurai", excerpt: "How a small mobile shop in Madurai tripled its customer base by listing on BazaarHub.", category: "Success Story", date: "Mar 15, 2026", readTime: "6 min", image: "/placeholder.svg" },
  { id: "6", slug: "affiliate-links-transparency", title: "Understanding Affiliate Links and Pricing on BazaarHub", excerpt: "Full transparency on how we earn and how affiliate pricing works — no hidden markups.", category: "Transparency", date: "Mar 8, 2026", readTime: "4 min", image: "/placeholder.svg" },
];

const BlogPage: React.FC = () => (
  <>
    <Helmet>
      <title>Blog — Bazaar Hub</title>
      <meta name="description" content="Read buying guides, top picks, seller stories, and tips on getting the best deals across India on the BazaarHub blog." />
    </Helmet>

    <div className="container py-10 space-y-8">
      <motion.div className="text-center space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">BazaarHub Blog</h1>
        <p className="text-muted-foreground">Buying guides, tips, and stories from the local marketplace</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link to={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <CardContent className="p-5 space-y-3">
                  <Badge variant="outline" className="text-xs">{post.category}</Badge>
                  <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  </div>
                  <span className="text-xs font-medium text-primary flex items-center gap-1">Read More <ArrowRight className="h-3 w-3" /></span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

export default BlogPage;
