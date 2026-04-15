import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Store, TrendingUp, MessageCircle, Trophy, BarChart3, ArrowRight, Eye, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Eye, title: "Price Visibility", desc: "Show buyers your price vs E-Commerce Marketplaces — transparency wins trust." },
  { icon: MessageCircle, title: "WhatsApp Leads", desc: "Buyers contact you directly on WhatsApp — no middlemen, no delays." },
  { icon: BarChart3, title: "Free Analytics", desc: "See views, clicks, and enquiries with our real-time analytics dashboard." },
  { icon: Trophy, title: '"Best in City" Badge', desc: "Stand out when you're the cheapest — buyers see it instantly." },
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
      <meta name="description" content="Join Bazaar Hub as a seller. Reach local buyers, boost sales, and grow your business — free forever." />
    </Helmet>

    <div className="container py-10 space-y-16">
      {/* Hero */}
      <motion.section className="text-center space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold">Grow Your Business with <span className="text-primary">BazaarHub</span></h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Reach buyers in your city who are actively comparing prices.</p>
        <Button asChild size="lg" className="rounded-full gap-2 mt-4">
          <Link to="/seller/register"><Store className="h-5 w-5" /> Register Your Shop <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </motion.section>

      {/* Why Join */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Why Join?</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
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

      {/* Pricing */}
      <section className="text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="max-w-md mx-auto border-primary/30">
            <CardContent className="p-8 space-y-3">
              <h2 className="text-2xl font-bold">Free Forever</h2>
              <p className="text-4xl font-bold text-primary">₹0</p>
              <p className="text-sm text-muted-foreground">List up to 50 products — no hidden fees, no credit card needed.</p>
              <Button asChild className="w-full rounded-full mt-4">
                <Link to="/seller/register">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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

      {/* Testimonial */}
      <section className="text-center max-w-2xl mx-auto">
        <Quote className="h-8 w-8 text-primary/30 mx-auto mb-3" />
        <p className="text-lg italic text-foreground">"Got 15 new enquiries in my first week!"</p>
        <p className="text-sm text-muted-foreground mt-2">— Ravi Mobiles, Coimbatore</p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <p className="text-muted-foreground">Join 500+ sellers already growing with BazaarHub.</p>
        <Button asChild size="lg" className="rounded-full gap-2">
          <Link to="/seller/register"><Store className="h-5 w-5" /> Register Your Shop — It's Free</Link>
        </Button>
      </section>
    </div>
  </>
);

export default BecomeSellerPage;
