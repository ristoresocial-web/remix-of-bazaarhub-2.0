import React from "react";
import { Link } from "react-router-dom";
import BazaarLogo from "./BazaarLogo";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo + Tagline */}
          <div>
            <BazaarLogo showTagline={false} />
            <p className="text-sm text-secondary-foreground/70">Empowering Your Market Choices.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-bold">Links</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/about" className="transition-all duration-200 hover:text-primary">About Us</Link></li>
              <li><Link to="/blog" className="transition-all duration-200 hover:text-primary">Blog</Link></li>
              <li><Link to="/faq" className="transition-all duration-200 hover:text-primary">FAQ</Link></li>
              <li><Link to="/contact" className="transition-all duration-200 hover:text-primary">Contact Us</Link></li>
              <li><Link to="/become-seller" className="transition-all duration-200 hover:text-primary">Become a Seller</Link></li>
              <li><Link to="/sitemap" className="transition-all duration-200 hover:text-primary">Sitemap</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-bold">Legal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/terms" className="transition-all duration-200 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="transition-all duration-200 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/seller-terms" className="transition-all duration-200 hover:text-primary">Seller Agreement</Link></li>
            </ul>
          </div>

          {/* Affiliate Disclosure */}
          <div>
            <h4 className="mb-3 text-sm font-bold">Affiliate Disclosure</h4>
            <p className="text-xs leading-relaxed text-secondary-foreground/50">
              As an Amazon Associate, I earn from qualifying purchases.
              Bazaar Hub also participates in Flipkart and other affiliate programs.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-secondary-foreground/50">
              Prices shown are fetched via affiliate APIs and may vary.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-secondary-foreground/10 pt-6 text-center text-xs text-secondary-foreground/50">
          <p>© 2025 BazaarHub. Your Town. Your Price.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
