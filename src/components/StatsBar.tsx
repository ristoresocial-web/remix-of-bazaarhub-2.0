import React, { useState, useEffect, useRef } from "react";

const stats = [
  { label: "Local Shops", value: 12400, suffix: "+", prefix: "" },
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
    <section ref={ref} className="bg-secondary py-6">
      <div className="container grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-primary md:text-3xl">
              <AnimatedCounter target={s.value} prefix={s.prefix} suffix={s.suffix} active={visible} />
            </p>
            <p className="text-xs text-secondary-foreground/70 md:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
