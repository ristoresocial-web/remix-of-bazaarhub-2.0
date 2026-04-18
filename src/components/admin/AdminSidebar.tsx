import React from "react";
import {
  LayoutDashboard, Users, Package, UserCheck, Tag, CheckSquare, Ticket, Globe, Grid3X3, GitBranch, Image, BarChart3, Search, Settings, CreditCard, Ban, Megaphone, Zap, ShieldAlert, Database, Bell,
} from "lucide-react";

export type AdminTab =
  | "dashboard" | "sellers" | "products" | "buyers" | "city-offers"
  | "approvals" | "promo-codes" | "platforms" | "categories"
  | "model-mapping" | "banners" | "banner-mgmt" | "analytics" | "seo" | "phase-settings"
  | "subscriptions" | "product-blocking" | "ticker" | "ad-slots" | "banned-products" | "master-products";

const menuGroups: { label: string; items: { id: AdminTab; label: string; icon: React.ElementType }[] }[] = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalog",
    items: [
      { id: "sellers", label: "Sellers", icon: Users },
      { id: "products", label: "Products", icon: Package },
      { id: "master-products", label: "Master Products", icon: Database },
      { id: "product-blocking", label: "Blocking", icon: Ban },
      { id: "banned-products", label: "Banned Products", icon: ShieldAlert },
      { id: "buyers", label: "Buyers", icon: UserCheck },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "city-offers", label: "City Offers", icon: Tag },
      { id: "approvals", label: "Approvals", icon: CheckSquare },
      { id: "promo-codes", label: "Promo Codes", icon: Ticket },
      { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
    ],
  },
  {
    label: "Configuration",
    items: [
      { id: "platforms", label: "Platforms", icon: Globe },
      { id: "categories", label: "Categories", icon: Grid3X3 },
      { id: "model-mapping", label: "Model Mapping", icon: GitBranch },
      { id: "banners", label: "Banners", icon: Image },
      { id: "banner-mgmt", label: "City Banners", icon: Image },
      { id: "ticker", label: "Ticker Messages", icon: Megaphone },
      { id: "ad-slots", label: "Ad Slots", icon: Zap },
    ],
  },
  {
    label: "Insights",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "seo", label: "SEO", icon: Search },
      { id: "phase-settings", label: "Phase Settings", icon: Settings },
    ],
  },
];

const allItems = menuGroups.flatMap((g) => g.items);

interface Props {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const AdminSidebar: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <aside className="hidden md:flex md:w-[260px] flex-col bg-white border-r border-bh-border min-h-[calc(100vh-64px)] sticky top-16">
    {/* Logo */}
    <div className="px-6 pt-6 pb-4 border-b border-bh-border">
      <span className="font-display font-extrabold text-xl">
        <span className="text-bh-orange">Bazaar</span>
        <span className="text-bh-green">Hub</span>
      </span>
      <p className="text-[11px] text-bh-text-muted mt-0.5 font-medium">Admin Console</p>
    </div>

    <nav className="flex-1 py-2 overflow-y-auto">
      {menuGroups.map((group) => (
        <div key={group.label} className="mb-1">
          <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-bh-text-muted">
            {group.label}
          </p>
          {group.items.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className={`flex w-full items-center gap-3 px-4 py-2 mx-2 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? "bg-bh-orange-light text-bh-orange font-semibold border border-bh-orange/20"
                    : "text-bh-text-secondary font-medium hover:bg-bh-surface-2 hover:text-bh-text border border-transparent"
                }`}
                style={{ width: "calc(100% - 16px)" }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </nav>

    <div className="border-t border-bh-border px-4 py-3 flex items-center gap-2">
      <div className="relative">
        <Bell className="h-4 w-4 text-bh-text-secondary" />
        <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-bh-orange text-[9px] font-bold text-white flex items-center justify-center">5</span>
      </div>
      <span className="text-sm font-semibold text-bh-text">Admin</span>
    </div>
  </aside>
);

export const AdminMobileNav: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <div className="md:hidden overflow-x-auto border-b border-bh-border bg-white px-4 py-2">
    <div className="flex gap-1">
      {allItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            activeTab === id
              ? "bg-bh-orange text-white shadow-price"
              : "bg-bh-surface-2 text-bh-text-secondary hover:bg-bh-orange-light hover:text-bh-orange"
          }`}
        >
          <Icon className="h-3 w-3" /> {label}
        </button>
      ))}
    </div>
  </div>
);

export default AdminSidebar;
