import React from "react";
import { Link } from "react-router-dom";
import { Store, TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: TrendingUp, text: "Reach thousands of local buyers" },
  { icon: Users, text: "Get WhatsApp enquiries directly" },
  { icon: Shield, text: "Free listing — no commission" },
  { icon: Store, text: "Compete with online giants locally" },
];

const BecomeSeller: React.FC = () => {
  return (
    <section className="container py-14">
      <div className="grid gap-8 rounded-2xl border border-border bg-card p-8 shadow-card md:grid-cols-2 md:items-center">
        <div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Sell More with BazaarHub
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            List your products and reach buyers searching in your city.
          </p>
          <ul className="space-y-3">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-foreground">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <Store className="h-16 w-16 text-primary" />
          <p className="text-lg font-semibold text-foreground">
            Join 500+ city partners across India
          </p>
          <Link to="/become-seller">
            <Button variant="hero" size="lg" className="gap-2">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BecomeSeller;
