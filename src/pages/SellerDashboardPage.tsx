import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bell, Phone, ToggleLeft, ToggleRight, Calendar, Clock, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SellerSidebar, { type SellerTab } from "@/components/seller/SellerSidebar";
import SellerMobileTabs from "@/components/seller/SellerMobileTabs";
import DashboardTab from "@/components/seller/DashboardTab";
import ProductsTab from "@/components/seller/ProductsTab";
import PriceIntelTab from "@/components/seller/PriceIntelTab";
import NotificationsTab from "@/components/seller/NotificationsTab";
import SettingsTab from "@/components/seller/SettingsTab";
import PromoCodeTab from "@/components/seller/PromoCodeTab";
import BoostListingTab from "@/components/seller/BoostListingTab";
import AdvertiseTab from "@/components/seller/AdvertiseTab";
import { formatPrice } from "@/lib/cityUtils";

const SellerDashboardPage: React.FC = () => {
  const city = localStorage.getItem("bazaarhub_city") || "Madurai";
  const [isApproved, setIsApproved] = useState(false);
  const [activeTab, setActiveTab] = useState<SellerTab>("dashboard");
  const [whatsappSetup, setWhatsappSetup] = useState(false);
  const [holidayMode, setHolidayMode] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab whatsappSetup={whatsappSetup} setWhatsappSetup={setWhatsappSetup} />;
      case "products":
        return <ProductsTab isApproved={isApproved} />;
      case "price-intel":
        return <PriceIntelTab city={city} />;
      case "city-offers":
        return (
          <div className="rounded-card border border-border bg-card p-6 shadow-card text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-pill bg-warning/10 border border-warning/20 px-4 py-1.5">
              <Clock className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs font-bold text-warning uppercase tracking-wide">Coming Soon</span>
            </div>
            <p className="text-foreground font-semibold">City Offers Management</p>
            <Link to="/coming-soon/city-offer-management" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              View details & get notified <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        );
      case "boost":
        return <BoostListingTab city={city} />;
      case "advertise":
        return <AdvertiseTab city={city} />;
      case "analytics":
        return (
          <div className="rounded-card border border-border bg-card p-6 shadow-card text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-pill bg-warning/10 border border-warning/20 px-4 py-1.5">
              <Clock className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs font-bold text-warning uppercase tracking-wide">Coming Soon</span>
            </div>
            <p className="text-foreground font-semibold">Seller Analytics Dashboard</p>
            <Link to="/coming-soon/analytics-management" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              View details & get notified <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        );
      case "notifications":
        return <NotificationsTab />;
      case "promo":
        return <PromoCodeTab />;
      case "settings":
        return <SettingsTab holidayMode={holidayMode} setHolidayMode={setHolidayMode} />;
      default:
        return null;
    }
  };

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>Seller Dashboard — Bazaar Hub</title>
        <meta name="description" content="Manage your products, prices, and shop settings on Bazaar Hub Seller Dashboard." />
      </Helmet>

      {/* Top Bar */}
      <div className="sticky top-0 z-20 border-b border-bh-border bg-white/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <span className="font-display font-extrabold text-xl">
              <span className="text-bh-orange">Bazaar</span>
              <span className="text-bh-green">Hub</span>
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-bh-text-secondary">Seller Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-bh-text-secondary hover:bg-bh-surface-2 transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-bh-orange text-[10px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-bh-text">Poorvika Mobiles</p>
              <p className="text-[10px] text-bh-text-muted notranslate">{city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Banner — orange gradient with progress dots */}
      {!isApproved && !bannerDismissed && (
        <div className="mx-4 mt-4 md:mx-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-bh-orange to-[#FB923C] text-white px-6 py-4 shadow-price">
          {/* Decorative glow */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-20 bottom-0 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="font-display font-bold text-base">Your shop is getting ready to go live!</p>
              <p className="text-sm opacity-90 mt-0.5">You are almost there! Our team reviews within 24 hours. SMS + WhatsApp sent on approval.</p>

              {/* Progress dots */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-white" />
                  <span className="text-[11px] font-semibold opacity-90">Submitted</span>
                </div>
                <div className="h-px w-6 bg-white/30" />
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[11px] font-semibold opacity-90">Under review</span>
                </div>
                <div className="h-px w-6 bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="text-[11px] font-medium opacity-60">Live</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start">
              <button className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/80 text-white hover:bg-white/15 px-4 py-1.5 text-xs font-semibold transition-all duration-200">
                <Phone className="h-3.5 w-3.5" /> Contact Support
              </button>
              <button onClick={() => setBannerDismissed(true)} className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holiday Banner */}
      {holidayMode && (
        <div className="mx-4 mt-4 rounded-2xl bg-bh-orange-light border border-bh-orange/20 p-3 flex items-center gap-2 md:mx-6">
          <Calendar className="h-5 w-5 text-bh-orange" />
          <p className="text-sm font-medium text-bh-text">Holiday Mode is active. Your listings show "On Holiday" and contact buttons are disabled.</p>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex">
        <SellerSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => window.location.href = "/"} />
        <main className="flex-1 p-4 md:p-6">
          {renderTab()}

          {/* Dev Toggle */}
          <div className="mt-8 border-t border-border pt-4">
            <button
              onClick={() => setIsApproved(!isApproved)}
              className="inline-flex items-center gap-2 rounded-pill border border-border px-3 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:bg-accent"
            >
              {isApproved ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
              Toggle Approval State ({isApproved ? "Approved" : "Pending"})
            </button>
          </div>
        </main>
      </div>

      <SellerMobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default SellerDashboardPage;
