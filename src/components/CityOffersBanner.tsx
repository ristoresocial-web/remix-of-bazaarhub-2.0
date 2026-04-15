import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Flame, CalendarDays, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockCityOffers, getOfferStatus } from "@/data/cityOffersData";
import { mockFoodStalls, getFoodStallStatus } from "@/data/foodFestivalData";

interface Props {
  city: string;
}

const CityOffersBanner: React.FC<Props> = ({ city }) => {
  const { activeOffers, activeFoodStalls, hasFoodFestival, previewItems } = useMemo(() => {
    const now = new Date();
    const offers = mockCityOffers.filter((o) => {
      const s = getOfferStatus(o);
      return s.key === "live" || s.key === "ending";
    });
    const stalls = mockFoodStalls.filter((s) => {
      const st = getFoodStallStatus(s);
      return st.key === "live" || st.key === "today-only" || st.key === "festival-special";
    });
    const festival = stalls.some((s) => s.festivalName);

    // Build 2 preview items from offers + stalls
    const previews: { name: string; category: string; dates: string }[] = [];
    for (const o of offers.slice(0, 1)) {
      previews.push({
        name: o.shopName,
        category: o.category,
        dates: `${new Date(o.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(o.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      });
    }
    for (const s of stalls.slice(0, 1)) {
      previews.push({
        name: s.stallName,
        category: s.cuisineType,
        dates: `${new Date(s.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(s.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      });
    }

    return {
      activeOffers: offers.length + stalls.length,
      activeFoodStalls: stalls.length,
      hasFoodFestival: festival,
      previewItems: previews,
    };
  }, []);

  if (activeOffers === 0) return null;

  return (
    <Link
      to="/city-offers"
      className="group block"
    >
      <section className="bg-orange-deep py-5 px-4 transition-all duration-300 hover:brightness-110">
        <div className="container">
          {/* Main banner text */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <MapPin className="h-6 w-6 text-white animate-bounce" />
            <h2 className="text-lg font-bold text-white md:text-xl">
              City Offers & Events Near You
            </h2>
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              <Flame className="h-4 w-4" />
              {activeOffers} Active Offers in {city} today
            </span>
          </div>

          {/* Preview cards */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {previewItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-sm transition-all duration-200 group-hover:bg-white/25"
              >
                <div>
                  <p className="notranslate text-sm font-semibold text-white">{item.name}</p>
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="notranslate">{item.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {item.dates}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {hasFoodFestival && (
              <Badge className="border-warning/40 bg-warning/20 text-white gap-1.5 px-3 py-1.5 text-sm">
                <UtensilsCrossed className="h-4 w-4 text-warning" />
                Food Festival On!
              </Badge>
            )}
          </div>
        </div>
      </section>
    </Link>
  );
};

export default CityOffersBanner;
