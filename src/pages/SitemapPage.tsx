import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Map } from "lucide-react";

const sections = [
  {
    title: "Main Pages",
    links: [
      { to: "/", label: "Home" },
      { to: "/search", label: "Search Products" },
      { to: "/product/compare", label: "Compare Products" },
      { to: "/find-sellers", label: "Find Sellers" },
      { to: "/city-offers", label: "City Offers" },
      { to: "/price-alerts", label: "Price Alerts" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "For Sellers",
    links: [
      { to: "/become-seller", label: "Become a Seller" },
      { to: "/seller/register", label: "Seller Registration" },
      { to: "/seller/dashboard", label: "Seller Dashboard" },
      { to: "/seller-terms", label: "Seller Agreement" },
    ],
  },
  {
    title: "For Buyers",
    links: [
      { to: "/buyer/login", label: "Buyer Login" },
      { to: "/buyer/dashboard", label: "Buyer Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact Us" },
      { to: "/faq", label: "FAQ" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/privacy", label: "Privacy Policy" },
    ],
  },
];

const SitemapPage: React.FC = () => (
  <>
    <Helmet>
      <title>Sitemap — Bazaar Hub</title>
      <meta name="description" content="Complete sitemap of Bazaar Hub. Find all pages and sections of the platform." />
    </Helmet>

    <div className="container py-10 max-w-4xl space-y-8">
      <motion.div className="text-center space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Map className="h-10 w-10 text-primary mx-auto" />
        <h1 className="text-3xl font-bold">Sitemap</h1>
        <p className="text-muted-foreground">All pages on Bazaar Hub at a glance</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <h2 className="text-lg font-semibold mb-3 text-primary">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

export default SitemapPage;
