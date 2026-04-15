import React from "react";
import { getHeroBanner } from "@/data/bannerSlotsData";

interface Props {
  city: string;
}

const CityHeroBanner: React.FC<Props> = ({ city }) => {
  const banner = getHeroBanner(city);
  if (!banner || !banner.bannerImage) return null;

  return (
    <div className="relative w-full overflow-hidden bg-muted">
      <img
        src={banner.bannerImage}
        alt={`${banner.shopName} — Sponsored banner in ${city}`}
        className="w-full h-auto max-h-[200px] md:max-h-[300px] object-cover"
        loading="lazy"
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <span className="rounded-pill bg-secondary/80 px-2.5 py-0.5 text-[10px] font-semibold text-secondary-foreground backdrop-blur-sm">
          Sponsored · {banner.shopName}
        </span>
      </div>
    </div>
  );
};

export default CityHeroBanner;
