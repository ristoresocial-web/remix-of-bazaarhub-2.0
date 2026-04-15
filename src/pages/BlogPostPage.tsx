import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts: Record<string, { title: string; date: string; readTime: string; category: string; image: string; body: string }> = {
  "best-price-tv-locally": {
    title: "5 Tips to Get the Best Price When Buying a TV Locally",
    date: "Apr 10, 2026",
    readTime: "5 min",
    category: "Buying Guide",
    image: "/placeholder.svg",
    body: `Buying a TV from a local store can save you money and give you the advantage of seeing the product before you buy. Here are 5 tips to make sure you're getting the best deal:\n\n**1. Compare on BazaarHub First**\nBefore visiting any shop, check BazaarHub to see which local sellers have the best prices in your city. This gives you a strong negotiation baseline.\n\n**2. Ask About Bundle Deals**\nMany local shops offer free wall mounts, HDMI cables, or extended warranties that online platforms charge extra for.\n\n**3. Check for Festival Offers**\nLocal shops often have deeper discounts during Diwali, Pongal, and other festivals — sometimes better than online sales.\n\n**4. Negotiate — It's Expected**\nUnlike online platforms, local shops expect negotiation. Use the BazaarHub comparison as leverage.\n\n**5. Get a Proper Invoice**\nAlways ask for a GST invoice to ensure warranty coverage and authenticity.`,
  },
  "local-shops-beating-amazon": {
    title: "How Local Shops Are Beating Amazon on Price in Chennai",
    date: "Apr 5, 2026",
    readTime: "8 min",
    category: "Insights",
    image: "/placeholder.svg",
    body: `In a surprising trend across Chennai, local electronics shops are consistently undercutting Amazon and Flipkart on popular smartphones and TVs.\n\n**The Data Speaks**\nAcross 500+ products tracked on BazaarHub, local shops in Chennai offered lower prices on 34% of items compared to Amazon.\n\n**Why Are Locals Cheaper?**\nLocal sellers have lower overhead costs, buy in bulk from distributors, and can adjust prices dynamically based on local competition.\n\n**The Trust Factor**\nBuyers can see, touch, and test products. Returns are instant. And sellers build long-term relationships that keep customers coming back.\n\n**What This Means for Buyers**\nDon't assume online is always cheaper. Use BazaarHub to compare — you might find a better deal right around the corner.`,
  },
  "understanding-gst-electronics": {
    title: "Understanding GST on Electronics",
    date: "Mar 28, 2026",
    readTime: "4 min",
    category: "Education",
    image: "/placeholder.svg",
    body: `GST (Goods and Services Tax) applies to all electronics sold in India. Here's what buyers need to know:\n\n**Standard Rate: 18%**\nMost electronics including smartphones, laptops, TVs, and appliances attract 18% GST.\n\n**What's Included in the Price?**\nAll prices on BazaarHub are MRP (inclusive of GST). The price you see is the price you pay.\n\n**Why GST Matters for Warranty**\nA proper GST invoice is essential for warranty claims. Always ask for one, whether buying online or locally.\n\n**GST for Sellers**\nSellers with turnover above ₹40 lakhs must register for GST. BazaarHub displays GST-registered sellers with a verified badge.`,
  },
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const post = slug ? posts[slug] : undefined;

  if (!post) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} — Bazaar Hub Blog</title>
        <meta name="description" content={post.title} />
      </Helmet>

      <div className="container py-10 max-w-3xl space-y-6">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/blog"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
        </Button>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime} read</span>
            </div>
          </div>

          <div className="aspect-video rounded-lg bg-muted overflow-hidden">
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
          </div>

          <div className="prose prose-sm max-w-none text-foreground">
            {post.body.split("\n\n").map((para, i) => {
              if (para.startsWith("**") && para.endsWith("**")) {
                return <h3 key={i} className="text-lg font-bold mt-6 mb-2">{para.replace(/\*\*/g, "")}</h3>;
              }
              if (para.includes("**")) {
                const parts = para.split(/\*\*(.*?)\*\*/);
                return (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                    {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
                  </p>
                );
              }
              return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>;
            })}
          </div>
        </motion.article>
      </div>
    </>
  );
};

export default BlogPostPage;
