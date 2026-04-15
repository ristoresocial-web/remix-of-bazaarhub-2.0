import React from "react";
import { Home, Search, Bell, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockFoodStalls } from "@/data/foodFestivalData";
import { mockCityOffers } from "@/data/cityOffersData";

const MobileBottomNav: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const totalOffers = mockCityOffers.length + mockFoodStalls.length;

  const items = [
    { icon: Home, label: t("home"), path: "/", badge: 0 },
    { icon: Search, label: "Search", path: "/search", badge: 0 },
    { icon: Bell, label: "Offers", path: "/city-offers", badge: totalOffers },
    { icon: Store, label: t("sellerLogin"), path: "/seller/dashboard", badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map(({ icon: Icon, label, path, badge }) => (
          <Link
            key={path}
            to={path}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-all duration-200 ${
              location.pathname === path || location.pathname.startsWith(path + "/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            {badge > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {badge}
              </span>
            )}
            <span className="max-w-[60px] truncate">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
