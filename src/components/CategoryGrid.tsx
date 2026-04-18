import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, Tv, Laptop, Wind, Refrigerator, Headphones } from "lucide-react";

const categories = [
  { name: "Mobiles", icon: Smartphone, query: "Mobiles" },
  { name: "Televisions", icon: Tv, query: "TVs" },
  { name: "Laptops", icon: Laptop, query: "Laptops" },
  { name: "Air Conditioners", icon: Wind, query: "ACs" },
  { name: "Refrigerators", icon: Refrigerator, query: "Refrigerators" },
  { name: "Audio", icon: Headphones, query: "Electronics" },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="container py-14">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h2 className="text-title text-bh-text">What are you looking for?</h2>
          <p className="mt-1 text-sm text-bh-text-secondary">Browse popular categories near you</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/search?category=${encodeURIComponent(cat.query)}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-bh-border bg-bh-surface p-5 md:p-6 shadow-bh-sm transition-all duration-200 hover:border-bh-orange hover:shadow-price hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bh-orange-light transition-transform duration-200 group-hover:scale-110">
              <cat.icon className="h-7 w-7 text-bh-orange" />
            </div>
            <span className="text-sm font-semibold text-bh-text group-hover:text-bh-orange transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
