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
  <aside className="hidden md:flex md:w-60 flex-col bg-[#0F172A] text-white min-h-[calc(100vh-64px)] sticky top-16">
    <nav className="flex-1 py-4">
      {menuItems.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex w-full items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 ${
              active
                ? "border-l-4 border-primary bg-white/10 text-white"
                : "border-l-4 border-transparent text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </nav>
    <div className="border-t border-white/10 px-5 py-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">PM</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Poorvika Mobiles</p>
          <p className="text-[10px] text-white/50">{localStorage.getItem("bazaarhub_city") || "Madurai"}</p>
        </div>
        <div className="relative">
          <Bell className="h-4 w-4 text-white/60" />
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">3</span>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-pill px-4 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  </aside>
);

export default SellerSidebar;
