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
      <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
        What are you looking for?
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/search?category=${encodeURIComponent(cat.query)}`}
            className="group flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card p-6 shadow-card transition-all duration-200 hover:border-primary hover:shadow-card-hover hover:-translate-y-1"
          >
            <cat.icon className="h-10 w-10 text-primary transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-semibold text-foreground">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
