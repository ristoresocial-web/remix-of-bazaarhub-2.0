import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Store, TrendingUp, Users, Shield, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Users, title: "Reach Local Buyers", desc: "Connect with thousands of buyers actively searching for products in your city." },
  { icon: TrendingUp, title: "Boost Your Sales", desc: "Get discovered through our AI-powered search and smart recommendation engine." },
  { icon: Shield, title: "Verified Trust Badge", desc: "Build credibility with our trust tier system — Bronze, Silver, and Gold badges." },
  { icon: BarChart3, title: "Price Intelligence", desc: "Track competitor pricing and market trends with our real-time analytics dashboard." },
  { icon: Zap, title: "Instant WhatsApp Leads", desc: "Receive buyer inquiries directly on WhatsApp — no middlemen, no delays." },
  { icon: Store, title: "Free to Start", desc: "List your first 10 products absolutely free. Upgrade anytime for premium features." },
];

const steps = [
  { step: "1", title: "Register Your Store", desc: "Fill in your business details, GST (optional), and store location." },
  { step: "2", title: "Add Your Products", desc: "Use our quick product wizard to list items from our master catalog." },
  { step: "3", title: "Start Selling", desc: "Go live instantly. Buyers in your city will start discovering your products." },
];

const BecomeSellerPage: React.FC = () => (
  <>
    <Helmet>
      <title>Become a Seller — Bazaar Hub</title>
      <meta name="description" content="Join Bazaar Hub as a seller. Reach local buyers, boost sales, and grow your business with our free listing platform." />
    </Helmet>

    <div className="container py-10 space-y-16">
      {/* Hero */}
      <motion.section className="text-center space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold">Grow Your Business with <span className="text-primary">Bazaar Hub</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Join India's fastest-growing local marketplace. List your products, reach nearby buyers, and increase footfall — all for free.</p>
        <Button asChild size="lg" className="rounded-full gap-2 mt-4">
          <Link to="/seller/register"><Store className="h-5 w-5" /> Register Now — It's Free <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </motion.section>

      {/* Benefits */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Why Sellers Love Bazaar Hub</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-accent/50 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div key={s.step} className="text-center space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">{s.step}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <p className="text-muted-foreground">Join 500+ sellers already growing with Bazaar Hub.</p>
        <Button asChild size="lg" className="rounded-full gap-2">
          <Link to="/seller/register"><Store className="h-5 w-5" /> Start Selling Today</Link>
        </Button>
      </section>
    </div>
  </>
);

export default BecomeSellerPage;
