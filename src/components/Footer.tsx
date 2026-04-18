import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-bh-sidebar text-bh-sidebar-text pt-16 pb-8">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Logo + Tagline */}
          <div>
            <div className="font-display flex items-baseline leading-none" style={{ fontWeight: 800, fontSize: "1.5rem" }}>
              <span className="text-bh-orange">Bazaar</span>
              <span className="text-bh-green">Hub</span>
            </div>
            <p className="mt-3 text-sm text-bh-sidebar-muted">Your Town. Your Price.</p>
            <p className="mt-1 text-xs text-bh-sidebar-muted/80">Empowering Your Market Choices</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-bh-sidebar-muted">Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">About Us</Link></li>
              <li><Link to="/blog" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Blog</Link></li>
              <li><Link to="/faq" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">FAQ</Link></li>
              <li><Link to="/contact" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Contact Us</Link></li>
              <li><Link to="/become-seller" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Become a Seller</Link></li>
              <li><Link to="/sitemap" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Sitemap</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-bh-sidebar-muted">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Privacy Policy</Link></li>
              <li><Link to="/seller-terms" className="text-bh-sidebar-text/80 hover:text-bh-orange transition-colors duration-150 block">Seller Agreement</Link></li>
            </ul>
          </div>

          {/* Affiliate Disclosure */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-bh-sidebar-muted">Affiliate Disclosure</h4>
            <p className="text-xs leading-relaxed text-bh-sidebar-muted">
              As an Amazon Associate, we earn from qualifying purchases. BazaarHub also participates in Flipkart and other affiliate programs.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-bh-sidebar-muted">
              Prices shown are fetched via affiliate APIs and may vary.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-bh-sidebar-muted">
          <p>© 2025 BazaarHub. Priya Kayal Mart LLP, Madurai.</p>
          <p>Made with ❤️ for Indian markets.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
