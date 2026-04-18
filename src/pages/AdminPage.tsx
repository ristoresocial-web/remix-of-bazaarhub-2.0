import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bell, ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import BazaarLogo from "@/components/BazaarLogo";
import AdminSidebar, { AdminMobileNav, type AdminTab } from "@/components/admin/AdminSidebar";
import AdminDashboardTab from "@/components/admin/AdminDashboardTab";
import AdminProductsTab from "@/components/admin/AdminProductsTab";
import ApprovalsTab from "@/components/admin/ApprovalsTab";
import SellersTab from "@/components/admin/SellersTab";
import PromoCodesTab from "@/components/admin/PromoCodesTab";
import PlatformsTab from "@/components/admin/PlatformsTab";
import PhaseSettingsTab from "@/components/admin/PhaseSettingsTab";
import SubscriptionPlansTab from "@/components/admin/SubscriptionPlansTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import ProductBlockingTab from "@/components/admin/ProductBlockingTab";
import BannedProductsTab from "@/components/admin/BannedProductsTab";
import MasterProductsTab from "@/components/admin/MasterProductsTab";
import TickerMessagesTab from "@/components/admin/TickerMessagesTab";
import AdSlotsTab from "@/components/admin/AdSlotsTab";
import BannerManagementTab from "@/components/admin/BannerManagementTab";

const COMING_SOON_MAP: Record<string, string> = {
  buyers: "/coming-soon/buyer-management",
  "city-offers": "/coming-soon/city-offer-management",
  "model-mapping": "/coming-soon/model-mapping",
  banners: "/coming-soon/banners-management",
  analytics: "/coming-soon/analytics-management",
  seo: "/coming-soon/seo-management",
};

const ComingSoonPlaceholder: React.FC<{ title: string; path: string }> = ({ title, path }) => (
  <div className="rounded-card border border-border bg-card p-8 shadow-card text-center space-y-4">
    <div className="inline-flex items-center gap-1.5 rounded-pill bg-warning/10 border border-warning/20 px-4 py-1.5">
      <Clock className="h-3.5 w-3.5 text-warning" />
      <span className="text-xs font-bold text-warning uppercase tracking-wide">Coming Soon</span>
    </div>
    <p className="text-foreground font-semibold">{title}</p>
    <Link to={path} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
      View details & get notified <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  </div>
);

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <AdminDashboardTab onTabChange={setActiveTab} />;
      case "sellers": return <SellersTab />;
      case "products": return <AdminProductsTab />;
      case "approvals": return <ApprovalsTab />;
      case "promo-codes": return <PromoCodesTab />;
      case "platforms": return <PlatformsTab />;
      case "phase-settings": return <PhaseSettingsTab />;
      case "subscriptions": return <SubscriptionPlansTab />;
      case "categories": return <CategoriesTab />;
      case "product-blocking": return <ProductBlockingTab />;
      case "banned-products": return <BannedProductsTab />;
      case "master-products": return <MasterProductsTab />;
      case "buyers": return <ComingSoonPlaceholder title="Buyers Management" path={COMING_SOON_MAP.buyers} />;
      case "city-offers": return <ComingSoonPlaceholder title="City Offers Management" path={COMING_SOON_MAP["city-offers"]} />;
      case "model-mapping": return <ComingSoonPlaceholder title="Model Mapping" path={COMING_SOON_MAP["model-mapping"]} />;
      case "banners": return <ComingSoonPlaceholder title="Banners Management" path={COMING_SOON_MAP.banners} />;
      case "ticker": return <TickerMessagesTab />;
      case "banner-mgmt": return <BannerManagementTab />;
      case "ad-slots": return <AdSlotsTab />;
      case "analytics": return <ComingSoonPlaceholder title="Analytics Dashboard" path={COMING_SOON_MAP.analytics} />;
      case "seo": return <ComingSoonPlaceholder title="SEO Settings" path={COMING_SOON_MAP.seo} />;
      default: return null;
    }
  };

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>Admin Panel — Bazaar Hub</title>
        <meta name="description" content="Bazaar Hub Admin Panel — Manage sellers, products, and platform settings." />
      </Helmet>

      <div className="sticky top-0 z-20 border-b border-bh-border bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-bh-orange" />
            <span className="font-display font-extrabold text-xl">
              <span className="text-bh-orange">Bazaar</span>
              <span className="text-bh-green">Hub</span>
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-bh-text-secondary">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-bh-text-secondary hover:bg-bh-surface-2 transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-bh-orange text-[10px] font-bold text-white flex items-center justify-center">5</span>
            </button>
            <span className="text-sm font-semibold text-bh-text hidden sm:inline">Admin</span>
          </div>
        </div>
      </div>

      <AdminMobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          {renderTab()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
