import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle, Star, Users, MapPin, IndianRupee,
  Sparkles, MessageCircle, BarChart3, Bot, Target, Globe,
  UserPlus, Package, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/* ── Section data ── */

const heroStats = [
  { icon: Users, value: "12,400+", label: "Sellers" },
  { icon: MapPin, value: "420+", label: "Cities" },
  { icon: IndianRupee, value: "180 Cr", label: "Sales Generated" },
  { icon: Star, value: "4.8★", label: "Seller Rating" },
];

const benefits = [
  { icon: Sparkles, title: "Free Listing", desc: "List unlimited products with zero commission. Keep 100% of every sale." },
  { icon: MessageCircle, title: "WhatsApp Leads", desc: "Buyers contact you directly on WhatsApp. No middleman, no waiting." },
  { icon: BarChart3, title: "Price Intelligence", desc: "Know exactly when Amazon and Flipkart change prices, and stay competitive." },
  { icon: Bot, title: "AI Catalog", desc: "Upload one photo, our AI auto-fills name, specs, brand, and category." },
  { icon: Target, title: "City Targeting", desc: "Reach buyers actively shopping in your city — not random tire-kickers." },
  { icon: Globe, title: "22 Languages", desc: "Sell in Tamil, Hindi, Telugu, Bengali, Kannada — every Indian language." },
];

const steps = [
  { num: 1, icon: UserPlus, title: "Register", desc: "Sign up in 2 minutes with your shop name, city, and mobile." },
  { num: 2, icon: Package, title: "List Products", desc: "Add products one by one or upload via CSV. AI fills specs for you." },
  { num: 3, icon: TrendingUp, title: "Get Buyers", desc: "Local buyers find you, contact via WhatsApp, and walk into your shop." },
];

const testimonials = [
  {
    name: "Ravi Krishnan",
    shop: "Ravi Mobiles",
    city: "Coimbatore",
    quote: "Got 15 new WhatsApp enquiries in my very first week. Walk-ins doubled within a month!",
    earnings: "₹2.4L/mo",
    initial: "R",
  },
  {
    name: "Priya Selvam",
    shop: "Tech World",
    city: "Trichy",
    quote: "Price Intel told me I was ₹500 above Amazon. Adjusted instantly and became #1 in Trichy.",
    earnings: "₹3.8L/mo",
    initial: "P",
  },
  {
    name: "Selvam Murugan",
    shop: "Selvam Electronics",
    city: "Madurai",
    quote: "Finally, a platform that brings real walk-in customers without taking commission. Love it!",
    earnings: "₹1.9L/mo",
    initial: "S",
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const BecomeSellerPage: React.FC = () => (
  <>
    <Helmet>
      <title>Become a Seller — Sell to 8 Lakh+ Buyers | BazaarHub</title>
      <meta
        name="description"
        content="Join 12,400+ sellers on BazaarHub. Free listings, WhatsApp leads, city targeting, 22 Indian languages. Register your shop free in 2 minutes."
      />
    </Helmet>

    <div className="space-y-0">
      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container text-center space-y-6 relative z-10">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Sell to <span className="notranslate underline decoration-primary-foreground/40 decoration-4 underline-offset-4">8 Lakh+ Buyers</span>
            <br />in Your City
          </motion.h1>
          <motion.p
            className="text-base md:text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Join India's fastest-growing local commerce platform. Zero commission, direct WhatsApp leads, and AI-powered tools — completely free.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button asChild size="lg" variant="secondary" className="gap-2 text-base font-bold shadow-lg">
              <Link to="/seller/register">Register Free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 text-base bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm opacity-90 pt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> No commission ever</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> 2-minute signup</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> WhatsApp leads</span>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Stats Bar ── */}
      <section className="bg-background border-b border-border">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {heroStats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center p-4 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-primary notranslate">{s.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Benefits Grid ── */}
      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Why Sellers Choose BazaarHub</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          Everything you need to compete with online giants — free, forever.
        </p>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {benefits.map((b) => (
            <motion.div key={b.title} variants={fadeUp}>
              <Card className="h-full hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 4. How It Works ── */}
      <section id="how-it-works" className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">How It Works</h2>
          <p className="text-muted-foreground text-center mb-10">From signup to first sale in under 24 hours.</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="relative inline-block">
                      <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-extrabold notranslate shadow-md">
                        {s.num}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
                        <s.icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg pt-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ── */}
      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Real Sellers, Real Results</h2>
        <p className="text-muted-foreground text-center mb-10">Hear from shop owners growing with BazaarHub.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow relative">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {t.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm text-foreground notranslate">{t.name}</p>
                        <p className="text-xs text-muted-foreground notranslate">
                          {t.shop} · {t.city}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 italic leading-relaxed">"{t.quote}"</p>
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Monthly earnings</span>
                    <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20 font-bold notranslate">
                      {t.earnings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 6. Final CTA ── */}
      <section className="bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground py-16">
        <div className="container text-center space-y-5">
          <motion.h2
            className="text-2xl md:text-4xl font-extrabold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Join <span className="notranslate">12,400+</span> Sellers Today
          </motion.h2>
          <p className="opacity-90 text-base md:text-lg max-w-xl mx-auto">
            Your shop, your prices, your customers. Register free and start receiving WhatsApp leads in minutes.
          </p>
          <div className="flex justify-center pt-2">
            <Button asChild size="lg" variant="secondary" className="gap-2 text-base font-bold shadow-lg">
              <Link to="/seller/register">
                Register Your Shop <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-xs opacity-80 pt-1">No credit card · No commission · Cancel anytime</p>
        </div>
      </section>
    </div>
  </>
);

export default BecomeSellerPage;
