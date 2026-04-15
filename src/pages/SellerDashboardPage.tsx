import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Bell, Phone, ToggleLeft, ToggleRight, Calendar, Clock, ExternalLink } from "lucide-react";
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
      <div className="sticky top-0 z-20 border-b border-border bg-card shadow-card">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <span className="bazaar-logo-text text-lg">
              <span className="bazaar-logo-navy">Bazaar</span>
              <span className="bazaar-logo-orange">Hub</span>
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-foreground">Seller Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-muted-foreground hover:bg-accent transition-all duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">3</span>
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">Poorvika Mobiles</p>
              <p className="text-[10px] text-muted-foreground">{city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      {!isApproved && (
        <div className="mx-4 mt-4 rounded-card bg-primary p-4 text-primary-foreground md:mx-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Your shop is getting ready to go live!</p>
              <p className="text-sm opacity-90">You are almost there! Our team reviews within 24 hours. SMS + WhatsApp sent on approval.</p>
            </div>
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/20 self-start">
              <Phone className="h-3.5 w-3.5 mr-1" /> Contact Support
            </Button>
          </div>
        </div>
      )}

      {/* Holiday Banner */}
      {holidayMode && (
        <div className="mx-4 mt-4 rounded-card bg-primary-light border border-primary/30 p-3 flex items-center gap-2 md:mx-6">
          <Calendar className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium text-foreground">Holiday Mode is active. Your listings show "On Holiday" and contact buttons are disabled.</p>
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
