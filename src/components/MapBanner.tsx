import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const MapBanner: React.FC = () => (
  <section className="container py-8">
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-accent p-8 text-center md:flex-row md:text-left">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
        <MapPin className="h-7 w-7 text-primary" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-foreground">Find City Partners Near You on Map</h2>
        <p className="text-sm text-muted-foreground">Discover verified city partners, compare prices, and visit the nearest store.</p>
      </div>
      <Link
        to="/find-sellers"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] hover:shadow-lg"
      >
        Explore Map
      </Link>
    </div>
  </section>
);

export default MapBanner;
