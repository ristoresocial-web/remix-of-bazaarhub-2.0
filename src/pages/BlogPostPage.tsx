import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, MessageCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { blogPosts } from "./BlogPage";

const articleBodies: Record<string, string> = {
  "5-tips-best-price-tv": `## 1. Compare Before You Visit

Always check BazaarHub before walking into any shop. You'll know the fair price range and can negotiate confidently.

## 2. Ask About Installation and Delivery

Local shops often include free installation and same-day delivery — worth ₹500–₹1,200 in value that online platforms charge extra.

## 3. Check the "Best in City" Badge

On BazaarHub, the "Best in City" badge means that shop has the lowest price among all local sellers. Start there.

## 4. The Sweet Spot: Demo Pieces

Ask if they have open-box or demo pieces. Same warranty, 5–10% lower price.

## 5. Time It Right

End of month, end of quarter, and festival season are the best times for local discounts. Shops have sales targets to meet.`,

  "local-shops-beating-amazon-chennai": `## The Data Speaks

Our March 2026 analysis across 500+ products revealed that local Chennai electronics shops offered lower prices than Amazon on 38% of products — especially in categories like TVs, washing machines, and air conditioners.

## Why Local Wins on Large Appliances

Shipping costs for large items eat into online margins. Local shops source directly from regional distributors, skipping the warehouse-to-doorstep chain.

## The Service Advantage

Beyond price, local shops offer same-day delivery, free installation, and easy returns — saving buyers ₹1,000–₹3,000 in hidden online costs.`,

  "gst-electronics-explained": `## GST Rates on Electronics

Mobile phones and accessories attract 18% GST. TVs, laptops, and most consumer electronics also fall under the 18% bracket. Some components and parts may attract 12%.

## Why GST Matters for Price Comparison

When comparing local vs online prices, ensure both include GST. A shop without a proper GST invoice may seem cheaper but could void your warranty.

## Always Get a GST Invoice

A proper GST invoice is your proof of purchase for warranty claims. Legitimate sellers always provide one.`,

  "seller-guide-price-intel": `## What is Price Intel?

Price Intel is BazaarHub's competitive pricing tool that automatically monitors online platform prices for your listed products and alerts you when you're priced above the competition.

## How to Use It

1. Go to your Seller Dashboard → Price Intel tab
2. View products where online prices are lower than yours
3. For each product, choose: Adjust Price, Create Bundle Offer, or Keep Price with Service Note

## Real Results

Sellers who actively use Price Intel see 23% more enquiries on average, because their prices stay competitive and visible.`,

  "best-phones-under-15000-april-2026": `## Our Methodology

We compared prices for 12 popular phones under ₹15,000 across Amazon, Flipkart, and 8 local shops in Pune during the first week of April 2026.

## Key Findings

- Local shops were cheaper on 5 out of 12 models
- Amazon had the best price on 4 models
- Flipkart led on 3 models
- Average local savings: ₹400–₹800 per phone

## Top Pick: Redmi Note 14

Best local price: ₹12,999 at Mobile World, Pune. Amazon price: ₹13,499. You save ₹500 buying local.`,

  "republic-day-sale-tips": `## The Hype vs Reality

Online Republic Day sales advertise "up to 80% off" but the best deals are usually on older models or lesser-known brands. Flagship products rarely see more than 5–10% discounts.

## When Local Wins

Local shops often match or beat online sale prices — especially for TVs and large appliances where they save on shipping costs.

## Our Advice

1. Check BazaarHub before and during the sale
2. Compare the "sale price" with local prices — often identical
3. Factor in delivery charges and installation costs for online purchases`,
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Button asChild variant="outline"><Link to="/blog"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog</Link></Button>
      </div>
    );
  }

  const body = articleBodies[post.slug] || "Full article content coming soon.";
  const related = blogPosts.filter(p => p.id !== post.id).slice(0, 3);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + " — " + window.location.href)}`, "_blank", "noopener,noreferrer");
  };

  // Render markdown-like body
  const renderBody = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="text-lg font-bold mt-6 mb-2">{block.replace("## ", "")}</h2>;
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter(l => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            {items.map((item, j) => <li key={j}>{item.replace("- ", "")}</li>)}
          </ul>
        );
      }
      if (block.match(/^\d\./)) {
        const items = block.split("\n").filter(l => l.match(/^\d/));
        return (
          <ol key={i} className="list-decimal list-inside space-y-1 text-sm text-muted-foreground mb-4">
            {items.map((item, j) => <li key={j}>{item.replace(/^\d+\.\s*/, "")}</li>)}
          </ol>
        );
      }
      return <p key={i} className="text-sm text-muted-foreground mb-4 leading-relaxed">{block}</p>;
    });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} — Bazaar Hub Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="container py-8 max-w-3xl space-y-6">
        <Button asChild variant="ghost" size="sm"><Link to="/blog"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog</Link></Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} read</span>
          </div>

          <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">By BazaarHub Team</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={shareWhatsApp} title="Share on WhatsApp"><MessageCircle className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={copyLink} title="Copy link"><Copy className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="aspect-[16/7] bg-muted rounded-lg flex items-center justify-center">
            <img src={post.image} alt={post.title} className="h-full w-full object-contain p-8" loading="lazy" />
          </div>

          <article className="pt-4">
            {renderBody(body)}
          </article>
        </motion.div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-8 border-t space-y-4">
            <h2 className="font-bold text-lg">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} to={`/blog/${r.slug}`}>
                  <Card className="hover:shadow-md transition-shadow group h-full">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <img src={r.image} alt={r.title} className="h-full w-full object-contain p-3" loading="lazy" />
                    </div>
                    <CardContent className="p-3 space-y-1">
                      <Badge variant="secondary" className="text-xs">{r.category}</Badge>
                      <h3 className="text-xs font-semibold group-hover:text-primary transition-colors leading-snug">{r.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogPostPage;
