import React from "react";
import { LayoutDashboard, Package, TrendingUp, Tag, BarChart3, Bell, Ticket, Settings, LogOut, Rocket, Megaphone } from "lucide-react";

export type SellerTab = "dashboard" | "products" | "price-intel" | "city-offers" | "boost" | "advertise" | "analytics" | "notifications" | "promo" | "settings";

const menuItems: { id: SellerTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "My Products", icon: Package },
  { id: "price-intel", label: "Price Intel", icon: TrendingUp },
  { id: "city-offers", label: "City Offers", icon: Tag },
  { id: "boost", label: "Boost My Listing", icon: Rocket },
  { id: "advertise", label: "Advertise in My City", icon: Megaphone },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "promo", label: "Promo Code", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings },
];

interface Props {
  activeTab: SellerTab;
  onTabChange: (tab: SellerTab) => void;
  onLogout: () => void;
}

const SellerSidebar: React.FC<Props> = ({ activeTab, onTabChange, onLogout }) => (
  <aside className="hidden md:flex md:w-60 flex-col bg-secondary text-secondary-foreground min-h-[calc(100vh-64px)] sticky top-16">
    <nav className="flex-1 py-4">
      {menuItems.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex w-full items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "border-l-4 border-primary bg-primary/10 text-primary-foreground"
                : "border-l-4 border-transparent text-secondary-foreground/70 hover:bg-white/5 hover:text-secondary-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </nav>
    <div className="border-t border-white/10 p-4">
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-pill px-4 py-2 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  </aside>
);

export default SellerSidebar;
