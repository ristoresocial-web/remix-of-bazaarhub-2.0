import React from "react";
import { LayoutDashboard, Package, TrendingUp, Tag, BarChart3, Bell, Ticket, Settings, LogOut, Rocket, Megaphone } from "lucide-react";


export type SellerTab = "dashboard" | "products" | "price-intel" | "city-offers" | "boost" | "advertise" | "analytics" | "notifications" | "promo" | "settings";

const menuGroups: { label: string; items: { id: SellerTab; label: string; icon: React.ElementType }[] }[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "products", label: "My Products", icon: Package },
    ],
  },
  {
    label: "Growth",
    items: [
      { id: "price-intel", label: "Price Intel", icon: TrendingUp },
      { id: "city-offers", label: "City Offers", icon: Tag },
      { id: "boost", label: "Boost My Listing", icon: Rocket },
      { id: "advertise", label: "Advertise in My City", icon: Megaphone },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "promo", label: "Promo Code", icon: Ticket },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

interface Props {
  activeTab: SellerTab;
  onTabChange: (tab: SellerTab) => void;
  onLogout: () => void;
}

const SellerSidebar: React.FC<Props> = ({ activeTab, onTabChange, onLogout }) => (
  <aside className="hidden md:flex md:w-[260px] flex-col bg-bh-sidebar text-bh-sidebar-text min-h-[calc(100vh-64px)] sticky top-16 border-r border-white/5">
    {/* Logo block */}
    <div className="px-6 pt-6 pb-4">
      <span className="font-display font-extrabold text-xl">
        <span className="text-bh-orange">Bazaar</span>
        <span className="text-bh-green">Hub</span>
      </span>
      <p className="text-[11px] text-white/40 mt-0.5 font-medium">Seller Console</p>
    </div>

    <nav className="flex-1 py-2 overflow-y-auto">
      {menuGroups.map((group) => (
        <div key={group.label} className="mb-2">
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
            {group.label}
          </p>
          {group.items.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? "bg-bh-orange/10 text-bh-orange font-semibold border-l-2 border-bh-orange -ml-[2px]"
                    : "text-white/70 font-medium hover:bg-white/5 hover:text-white"
                }`}
                style={active ? { width: "calc(100% - 14px)" } : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </nav>

    <div className="border-t border-white/5 px-4 py-4 space-y-3">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bh-orange text-xs font-bold text-white shadow-price">PM</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Poorvika Mobiles</p>
          <p className="text-[10px] text-white/40">{localStorage.getItem("bazaarhub_city") || "Madurai"}</p>
        </div>
        <div className="relative">
          <Bell className="h-4 w-4 text-white/50" />
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bh-orange text-[8px] font-bold text-white">3</span>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  </aside>
);

export default SellerSidebar;
