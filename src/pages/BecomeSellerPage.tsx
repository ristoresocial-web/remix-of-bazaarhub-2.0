import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Store, MessageCircle, Trophy, BarChart3, ArrowRight,
  Eye, Quote, Bell, Globe, CheckCircle, ChevronDown, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import StatsBar from "@/components/StatsBar";

const benefits = [
  { icon: Eye, title: "Price Visibility", desc: "Show buyers your price vs Amazon/Flipkart. Win on value, not just price." },
  { icon: MessageCircle, title: "WhatsApp Leads", desc: "Buyers contact you directly on WhatsApp. No middleman, no commission." },
  { icon: BarChart3, title: "Free Analytics", desc: "See views, clicks, and enquiries. Know which products buyers want." },
  { icon: Trophy, title: '"Best in City" Badge', desc: "Stand out when you have the lowest price in your city." },
  { icon: Bell, title: "Price Intel Alerts", desc: "Get notified when online prices change. Stay competitive." },
  { icon: Globe, title: "Multi-Language", desc: "Reach buyers in Tamil, Hindi, Telugu, Kannada and more." },
];

const steps = [
  { step: "1", title: "Register Your Shop", desc: "Share your shop name, city, and GST number. Takes 2 minutes." },
  { step: "2", title: "Add Your Products", desc: "List products with prices. Upload via CSV or add one by one." },
  { step: "3", title: "Start Getting Leads", desc: "Buyers find you. They contact you via WhatsApp instantly." },
];

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/mo",
    highlight: false,
    features: ["2 months free trial", "Up to 2 products", "Basic analytics", "WhatsApp leads"],
    cta: "Get Started",
    ctaLink: "/seller/register",
  },
  {
    name: "Business Premium",
    price: "Coming Soon",
    period: "",
    highlight: true,
    features: ["Unlimited time", "Up to 50 products", "Full analytics", "WhatsApp + SMS leads", "Price Intel alerts"],
    cta: "Choose Plan",
    ctaLink: "/seller/register",
  },
  {
    name: "Premium Elite",
    price: "Coming Soon",
    period: "",
    highlight: false,
    features: ["Unlimited time", "Unlimited products", "Priority listing", "Featured badge", "Dedicated support"],
    cta: "Contact Us",
    ctaLink: "/contact",
  },
];

const testimonials = [
  {
    quote: "Got 15 new WhatsApp enquiries in my first week!",
    name: "Ravi Mobiles",
    city: "Coimbatore",
    tier: "Established Seller",
  },
  {
    quote: "The Price Intel feature told me I was ₹500 above Amazon. I adjusted and became #1 in Trichy!",
    name: "Tech World",
    city: "Trichy",
    tier: "Trusted Seller",
  },
  {
    quote: "Finally a platform that brings walk-in customers instead of taking commissions. Love it!",
    name: "Selvam Electronics",
    city: "Madurai",
    tier: "Established Seller",
  },
];

const faqs = [
  {
    q: "Is BazaarHub free for sellers?",
    a: "Yes! BazaarHub is free to join. You can list products, receive WhatsApp leads, and access basic analytics at no cost. Premium plans with additional features are coming soon.",
  },
  {
    q: "Do I need a GST number to register?",
    a: "GST is optional but recommended. Having a GST number helps build trust with buyers and may qualify you for premium badges.",
  },
  {
    q: "How do buyers contact me?",
    a: "Buyers contact you directly via WhatsApp or phone call. We never act as a middleman — you deal with customers directly, just like in your shop.",
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const BecomeSellerPage: React.FC = () => (
  <>
    <Helmet>
      <title>Become a Seller — BazaarHub</title>
      <meta name="description" content="Join BazaarHub as a seller. Reach local buyers, boost sales, and grow your business — free forever. No commissions, direct WhatsApp leads." />
    </Helmet>

    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container text-center space-y-6">
          <motion.h1
            className="text-3xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Grow Your Business with BazaarHub
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Reach buyers who are actively comparing prices in your city — right now.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button asChild size="lg" variant="secondary" className="rounded-full gap-2 text-base font-semibold">
              <Link to="/seller/register">Start Selling Free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full gap-2 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <a href="#how-it-works">Watch How It Works</a>
            </Button>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm opacity-80 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Free forever</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> No commissions</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> WhatsApp leads</span>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <StatsBar />

      {/* Benefits */}
      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Why Sellers Choose BazaarHub</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Everything you need to compete with online giants — for free.</p>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {benefits.map((b) => (
            <motion.div key={b.title} variants={fadeUp}>
              <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-bold">
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="container py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground text-center mb-10">Start free. Upgrade when you're ready.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full relative ${plan.highlight ? "border-primary shadow-lg ring-2 ring-primary/20" : ""}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 space-y-4 text-center">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <div>
                    <span className="text-3xl font-bold text-primary">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-left">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full rounded-full ${plan.highlight ? "" : ""}`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <Link to={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Sellers Say</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic">"{t.quote}"</p>
                    <div className="pt-2 border-t border-border">
                      <p className="font-semibold text-sm">{t.name}, {t.city}</p>
                      <p className="text-xs text-muted-foreground">{t.tier}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-14">
        <div className="container text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to grow your shop?</h2>
          <p className="opacity-90">Register in 2 minutes. Start getting leads today.</p>
          <Button asChild size="lg" variant="secondary" className="rounded-full gap-2 text-base font-semibold">
            <Link to="/seller/register">Register Your Shop Now <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  </>
);

export default BecomeSellerPage;
