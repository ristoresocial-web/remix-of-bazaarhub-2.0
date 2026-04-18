import React, { useState, useEffect, useRef } from "react";

const stats = [
  { label: "City Partners", value: 12400, suffix: "+", prefix: "" },
  { label: "Products Listed", value: 8.2, suffix: "L+", prefix: "" },
  { label: "Cities Covered", value: 420, suffix: "+", prefix: "" },
  { label: "Savings Generated", value: 180, suffix: " Cr+", prefix: "₹" },
];

const AnimatedCounter: React.FC<{ target: number; prefix: string; suffix: string; active: boolean }> = ({ target, prefix, suffix, active }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Number(current.toFixed(1)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  const display = Number.isInteger(target) ? Math.round(count).toLocaleString("en-IN") : count.toFixed(1);
  return <span>{prefix}{display}{suffix}</span>;
};

const StatsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-bh-border bg-white">
      <div className="container px-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bh-border">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white px-4 py-5 md:px-8 md:py-6 text-center transition-colors duration-200 hover:bg-bh-orange-light"
            >
              <p className="font-mono text-2xl md:text-3xl font-medium text-bh-orange tracking-tight">
                <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} active={visible} />
              </p>
              <p className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] text-bh-text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
