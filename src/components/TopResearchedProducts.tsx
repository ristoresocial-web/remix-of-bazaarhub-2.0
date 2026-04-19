import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Flame, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface ResearchedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  searches: number;
  score: number;
}

const PRODUCTS: ResearchedProduct[] = [
  {
    id: "1",
    name: "Samsung Galaxy S24 Ultra",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    price: 119999,
    searches: 9262,
    score: 93,
  },
  {
    id: "2",
    name: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
    price: 22990,
    searches: 8137,
    score: 91,
  },
  {
    id: "3",
    name: "Apple iPhone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop",
    price: 134900,
    searches: 8014,
    score: 95,
  },
  {
    id: "4",
    name: "MacBook Air M3",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    price: 114900,
    searches: 7656,
    score: 92,
  },
  {
    id: "5",
    name: "LG OLED C3 55\" TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    price: 124990,
    searches: 6481,
    score: 89,
  },
  {
    id: "6",
    name: "OnePlus 12",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    price: 64999,
    searches: 5923,
    score: 88,
  },
  {
    id: "7",
    name: "Realme Buds T310",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    price: 1499,
    searches: 5210,
    score: 82,
  },
  {
    id: "8",
    name: "Samsung Galaxy Tab S10 FE",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop",
    price: 36999,
    searches: 4877,
    score: 86,
  },
];

const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const scoreColor = (s: number) =>
  s >= 90
    ? "bg-bh-green-light text-bh-green-dark border-bh-green/30"
    : s >= 80
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-bh-surface-2 text-bh-text-secondary border-bh-border";

const TopResearchedProducts: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section className="container py-12">
      {/* Header — Flash.co style: serif italic centered with thin rules */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-serif italic text-2xl md:text-3xl font-semibold text-bh-text tracking-tight">
            Top Researched Products
          </h2>
          <p className="mt-1 text-sm text-bh-text-secondary">
            Most searched products by our users
          </p>
        </div>
        <button
          onClick={scroll}
          aria-label="Scroll right"
          className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-bh-border bg-bh-surface text-bh-text-secondary transition-all hover:border-bh-orange hover:text-bh-orange hover:shadow-bh-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Horizontal scroll rail */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
      >
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="snap-start shrink-0 w-[200px] md:w-[220px]"
          >
            <Link
              to={`/search?q=${encodeURIComponent(p.name)}`}
              className="group block rounded-2xl border border-bh-border bg-bh-surface shadow-bh-sm transition-all duration-200 hover:shadow-price hover:border-bh-orange/40 hover:-translate-y-1 overflow-hidden"
            >
              {/* Image with searches badge */}
              <div className="relative aspect-square overflow-hidden bg-bh-surface-2 p-3">
                <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2 py-1 text-[10px] font-bold text-bh-text border border-bh-border shadow-bh-sm">
                  <Flame className="h-3 w-3 text-destructive" />
                  <span className="notranslate">{p.searches.toLocaleString("en-IN")}</span>
                  <span className="text-bh-text-muted font-medium">searches</span>
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.05]"
                />
              </div>

              {/* Body */}
              <div className="p-3">
                <h3 className="notranslate text-sm font-semibold text-bh-text line-clamp-2 leading-snug min-h-[2.5rem]">
                  {p.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="notranslate font-mono text-base font-semibold text-bh-price-local">
                    {formatPrice(p.price)}
                  </span>
                  <span
                    className={`notranslate inline-flex h-7 min-w-[32px] items-center justify-center rounded-md border px-1.5 text-xs font-bold ${scoreColor(
                      p.score
                    )}`}
                    title="BazaarHub AI Score"
                  >
                    {p.score}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopResearchedProducts;
