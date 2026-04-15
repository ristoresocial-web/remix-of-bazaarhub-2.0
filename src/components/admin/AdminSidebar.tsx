import React from "react";
import {
  LayoutDashboard, Users, Package, UserCheck, Tag, CheckSquare, Ticket, Globe, Grid3X3, GitBranch, Image, BarChart3, Search, Settings, CreditCard, Ban, Megaphone, Zap, ShieldAlert, Database, Bell,
} from "lucide-react";

export type AdminTab =
  | "dashboard" | "sellers" | "products" | "buyers" | "city-offers"
  | "approvals" | "promo-codes" | "platforms" | "categories"
  | "model-mapping" | "banners" | "banner-mgmt" | "analytics" | "seo" | "phase-settings"
  | "subscriptions" | "product-blocking" | "ticker" | "ad-slots" | "banned-products" | "master-products";

const menuItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "sellers", label: "Sellers", icon: Users },
  { id: "products", label: "Products", icon: Package },
  { id: "master-products", label: "Master Products", icon: Database },
  { id: "product-blocking", label: "Blocking", icon: Ban },
  { id: "banned-products", label: "Banned Products", icon: ShieldAlert },
  { id: "buyers", label: "Buyers", icon: UserCheck },
  { id: "city-offers", label: "City Offers", icon: Tag },
  { id: "approvals", label: "Approvals", icon: CheckSquare },
  { id: "promo-codes", label: "Promo Codes", icon: Ticket },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "platforms", label: "Platforms", icon: Globe },
  { id: "categories", label: "Categories", icon: Grid3X3 },
  { id: "model-mapping", label: "Model Mapping", icon: GitBranch },
  { id: "banners", label: "Banners", icon: Image },
  { id: "banner-mgmt", label: "City Banners", icon: Image },
  { id: "ticker", label: "Ticker Messages", icon: Megaphone },
  { id: "ad-slots", label: "Ad Slots", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "seo", label: "SEO", icon: Search },
  { id: "phase-settings", label: "Phase Settings", icon: Settings },
];

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const AdminSidebar: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <aside className="hidden md:flex md:w-56 flex-col border-r border-border bg-card min-h-[calc(100vh-64px)] sticky top-16">
    <nav className="flex-1 py-3 overflow-y-auto">
      {menuItems.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? "border-l-4 border-primary bg-primary-light text-primary"
                : "border-l-4 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </nav>
    <div className="border-t border-border px-4 py-3 flex items-center gap-2">
      <div className="relative">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">5</span>
      </div>
      <span className="text-sm font-semibold text-foreground">Admin</span>
    </div>
  </aside>
);

export const AdminMobileNav: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <div className="md:hidden overflow-x-auto border-b border-border bg-card px-4 py-2">
    <div className="flex gap-1">
      {menuItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activeTab === id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-3 w-3" /> {label}
        </button>
      ))}
    </div>
  </div>
);

export default AdminSidebar;
