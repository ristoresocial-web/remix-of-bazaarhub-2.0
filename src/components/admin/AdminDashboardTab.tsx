import React from "react";
import { Users, Package, TrendingUp, ShieldCheck, BarChart3 } from "lucide-react";
import type { AdminTab } from "./AdminSidebar";

const stats = [
  { icon: Users, label: "Total Sellers", value: "5,230" },
  { icon: Package, label: "Products Listed", value: "42,180" },
  { icon: TrendingUp, label: "Searches Today", value: "12,450" },
  { icon: ShieldCheck, label: "Cities Active", value: "52" },
  { icon: BarChart3, label: "Price Comparisons", value: "89,320" },
];

interface Props {
  onTabChange?: (tab: AdminTab) => void;
}

const AdminDashboardTab: React.FC<Props> = ({ onTabChange }) => (
  <div className="space-y-6">
    <h2 className="text-lg font-bold text-foreground">Admin Dashboard</h2>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-card border border-border bg-card p-4 shadow-card">
          <Icon className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground notranslate">{value}</p>
        </div>
      ))}
    </div>
    <div className="rounded-card border border-border bg-card p-5 shadow-card">
      <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onTabChange?.("sellers")} className="rounded-pill bg-primary-light px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-all duration-200 cursor-pointer">
          7 sellers ready to join — approve to grow! →
        </button>
        <button onClick={() => onTabChange?.("platforms")} className="rounded-pill bg-success-light px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20 transition-all duration-200 cursor-pointer">
          All platforms connected →
        </button>
        <button onClick={() => onTabChange?.("phase-settings")} className="rounded-pill bg-primary-light px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-all duration-200 cursor-pointer">
          Phase 1 active →
        </button>
      </div>
    </div>
  </div>
);

export default AdminDashboardTab;
