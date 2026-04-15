import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { mockCityOffers, getOfferStatus } from "@/data/cityOffersData";
import { mockFoodStalls, getFoodStallStatus } from "@/data/foodFestivalData";

const CityOffersFloatingButton: React.FC = () => {
  const navigate = useNavigate();

  const count = useMemo(() => {
    const offers = mockCityOffers.filter((o) => {
      const s = getOfferStatus(o);
      return s.key === "live" || s.key === "ending";
    }).length;
    const stalls = mockFoodStalls.filter((s) => {
      const st = getFoodStallStatus(s);
      return st.key === "live" || st.key === "today-only" || st.key === "festival-special";
    }).length;
    return offers + stalls;
  }, []);

  if (count === 0) return null;

  return (
    <button
      onClick={() => navigate("/city-offers")}
      className="fixed bottom-36 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-deep text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl md:hidden"
      aria-label="City Offers"
    >
      <Flame className="h-6 w-6" />
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-orange-deep">
        {count}
      </span>
    </button>
  );
};

export default CityOffersFloatingButton;
