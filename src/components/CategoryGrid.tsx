import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import electronics from "@/assets/categories/electronics.png";
import mobiles from "@/assets/categories/mobiles.png";
import laptops from "@/assets/categories/laptops.png";
import tvs from "@/assets/categories/tvs.png";
import homeKitchen from "@/assets/categories/home-kitchen.png";
import beauty from "@/assets/categories/beauty.png";
import fashion from "@/assets/categories/fashion.png";
import books from "@/assets/categories/books.png";
import toys from "@/assets/categories/toys.png";
import pets from "@/assets/categories/pets.png";
import grocery from "@/assets/categories/grocery.png";
import sports from "@/assets/categories/sports.png";

type Category = { name: string; icon: string; query: string };

const categories: Category[] = [
  { name: "Mobiles", icon: mobiles, query: "Mobiles" },
  { name: "Electronics", icon: electronics, query: "Electronics" },
  { name: "Laptops", icon: laptops, query: "Laptops" },
  { name: "TVs", icon: tvs, query: "TVs" },
  { name: "Home & Kitchen", icon: homeKitchen, query: "Home & Kitchen" },
  { name: "Beauty", icon: beauty, query: "Beauty" },
  { name: "Fashion", icon: fashion, query: "Fashion" },
  { name: "Books", icon: books, query: "Books" },
  { name: "Toys & Games", icon: toys, query: "Toys" },
  { name: "Pet Supplies", icon: pets, query: "Pets" },
  { name: "Grocery", icon: grocery, query: "Grocery" },
  { name: "Sports", icon: sports, query: "Sports" },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="container py-14">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h2 className="text-title text-bh-text font-display">What are you looking for?</h2>
          <p className="mt-1 text-sm text-bh-text-secondary">Browse popular categories near you</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-6">
        {categories.map((cat, idx) => (
          <Link
            key={cat.name}
            to={`/search?category=${encodeURIComponent(cat.query)}`}
            className="group relative flex flex-col items-center gap-2 rounded-3xl border border-bh-border bg-gradient-to-br from-bh-surface to-bh-orange-light/40 p-3 sm:p-4 shadow-bh-sm transition-all duration-300 hover:shadow-price hover:-translate-y-2 hover:border-bh-orange/40"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-white/60 backdrop-blur-sm shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]">
              <img
                src={cat.icon}
                alt={cat.name}
                loading="lazy"
                width={96}
                height={96}
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-md"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-bh-text text-center group-hover:text-bh-orange transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
