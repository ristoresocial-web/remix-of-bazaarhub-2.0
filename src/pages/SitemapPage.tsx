import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const buyerLinks = [
  { to: "/", label: "🏠 Home" },
  { to: "/search", label: "🔍 Search Products" },
  { to: "/product/compare", label: "📦 Compare Products" },
  { to: "/city-offers", label: "🏙️ City Offers" },
  { to: "/price-alerts", label: "🔔 Price Alerts" },
  { to: "/find-sellers", label: "🏪 Find Sellers" },
  { to: "/become-seller", label: "🛒 Become a Seller" },
];

const sellerLinks = [
  { to: "/seller/register", label: "📝 Seller Registration" },
  { to: "/seller/dashboard", label: "📊 Seller Dashboard", sub: [
    { to: "/seller/dashboard", label: "My Products" },
    { to: "/seller/dashboard", label: "Price Intel" },
    { to: "/seller/dashboard", label: "City Offers" },
    { to: "/seller/dashboard", label: "Analytics" },
    { to: "/seller/dashboard", label: "Notifications" },
    { to: "/seller/dashboard", label: "Promo Code" },
    { to: "/seller/dashboard", label: "Settings" },
  ]},
];

const infoLinks = [
  { to: "/about", label: "ℹ️ About Us" },
  { to: "/contact", label: "📞 Contact Us" },
  { to: "/faq", label: "❓ FAQ" },
  { to: "/blog", label: "📝 Blog" },
  { to: "/sitemap", label: "🗺️ Sitemap" },
];

const legalLinks = [
  { to: "/terms", label: "📄 Terms & Conditions" },
  { to: "/privacy", label: "🔒 Privacy Policy" },
  { to: "/seller-terms", label: "📋 Seller Terms" },
];

const cities = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Pune"];
const categories = ["Mobiles", "Televisions", "Laptops", "Air Conditioners", "Refrigerators", "Audio", "Cameras", "Tablets", "Smartwatches", "Gaming"];

const SitemapPage: React.FC = () => (
  <>
    <Helmet>
      <title>Sitemap — Bazaar Hub</title>
      <meta name="description" content="Complete directory of all BazaarHub pages — products, sellers, guides, and more." />
    </Helmet>

    <div className="container py-8 space-y-10 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> Site Map</h1>
        <p className="text-sm text-muted-foreground mt-1">A complete directory of all BazaarHub pages.</p>
      </motion.div>

      {/* 3-Column Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Column 1: Buyers */}
        <div className="space-y-6">
          <Section title="For Buyers" links={buyerLinks} />
        </div>

        {/* Column 2: Sellers & Admin */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">For Sellers</h3>
            <ul className="space-y-1.5">
              {sellerLinks.map(link => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="text-sm hover:text-primary transition-colors">{link.label}</Link>
                  {link.sub && (
                    <ul className="ml-5 mt-1 space-y-1">
                      {link.sub.map(s => (
                        <li key={s.label}><Link to={s.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">→ {s.label}</Link></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Admin</h3>
            <ul><li><Link to="/admin" className="text-sm hover:text-primary transition-colors">🔧 Admin Panel (Login Required)</Link></li></ul>
          </div>
        </div>

        {/* Column 3: Info & Legal */}
        <div className="space-y-6">
          <Section title="About BazaarHub" links={infoLinks} />
          <Section title="Legal" links={legalLinks} />
        </div>
      </div>

      {/* Cities */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Available Cities</h3>
        <div className="flex flex-wrap gap-2">
          {cities.map(c => (
            <Link key={c} to={`/?city=${encodeURIComponent(c)}`}>
              <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">{c}</Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Product Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <Link key={c} to={`/search?category=${encodeURIComponent(c)}`}>
              <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">{c}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </>
);

const Section: React.FC<{ title: string; links: { to: string; label: string }[] }> = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">{title}</h3>
    <ul className="space-y-1.5">
      {links.map(l => (
        <li key={l.to + l.label}><Link to={l.to} className="text-sm hover:text-primary transition-colors">{l.label}</Link></li>
      ))}
    </ul>
  </div>
);

export default SitemapPage;
