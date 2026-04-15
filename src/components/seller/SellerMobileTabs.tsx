import React from "react";
import { LayoutDashboard, Package, TrendingUp, Bell, Settings } from "lucide-react";
import type { SellerTab } from "./SellerSidebar";

const tabs: { id: SellerTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "price-intel", label: "Intel", icon: TrendingUp },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

interface Props {
  activeTab: SellerTab;
  onTabChange: (tab: SellerTab) => void;
}

const SellerMobileTabs: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border bg-card shadow-lg md:hidden">
    {tabs.map(({ id, label, icon: Icon }) => {
      const active = activeTab === id;
      return (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-all duration-200 ${
            active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      );
    })}
  </nav>
);

export default SellerMobileTabs;
