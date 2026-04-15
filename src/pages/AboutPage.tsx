import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BazaarLogo from "@/components/BazaarLogo";
import { Search, Handshake, PiggyBank, ShoppingBag, Store, Globe, Eye, MapPin, Accessibility, ShieldCheck } from "lucide-react";

const platforms = [
  "Amazon", "Flipkart", "Meesho", "Croma", "Reliance Digital", "Vijay Sales",
  "Tata CLiQ", "Poorvika", "Sangeetha", "JioMart", "Myntra", "AJIO",
  "Nykaa", "Pepperfry", "FirstCry", "Snapdeal",
];

const coreValues = [
  { icon: Eye, title: "Transparency", desc: "Every price is visible. No hidden fees, no bias. Buyers see the real picture." },
  { icon: MapPin, title: "Hyperlocal", desc: "Your city, your shops, your language. We bring the neighbourhood online." },
  { icon: Accessibility, title: "Accessibility", desc: "22 Indian languages, 4000+ cities. Built for every Indian buyer." },
  { icon: ShieldCheck, title: "Trust", desc: "Verified sellers, accurate prices, and clear 'Sponsored' labels on every ad." },
];

const AboutPage: React.FC = () => (
  <div className="pb-20 md:pb-0">
    <Helmet>
      <title>About Bazaar Hub — India's Hyperlocal Price Comparison Platform</title>
      <meta name="description" content="BazaarHub empowers Indian buyers with transparent price comparison and city partner discovery across 4000+ cities in 22 languages." />
    </Helmet>

    {/* Hero */}
    <section className="bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy))] py-16">
      <div className="container text-center">
        <BazaarLogo className="mb-4 text-5xl" showTagline={false} />
        <h1 className="text-3xl font-bold text-white">India's Hyperlocal Price Comparison Platform</h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">
          Connecting buyers and city partners across 4000+ Indian cities — transparently, in every language.
        </p>
      </div>
    </section>

    <div className="container py-12 space-y-12">
      {/* Mission & Vision */}
      <div className="mx-auto max-w-3xl rounded-card bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy))] p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-2">Our Mission</h2>
        <p className="text-sm leading-relaxed text-white/80 mb-6">
          To empower every Indian buyer with transparent price comparison and city partner discovery — connecting 4000+ cities, all 22 Indian languages, every product category.
        </p>
        <h2 className="text-xl font-bold mb-2">Our Vision</h2>
        <p className="text-sm leading-relaxed text-white/80">
          A future where every city partner shop in India is as discoverable as the biggest online marketplace.
        </p>
      </div>

      {/* Core Values */}
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold text-foreground text-center mb-6">Core Values</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {coreValues.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-card border border-border bg-card p-6 shadow-card hover-scale">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What We Do */}
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold text-foreground text-center mb-6">What We Do</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Search, title: "Compare", desc: "Compare prices across city partners and 10+ online platforms instantly" },
            { icon: Handshake, title: "Connect", desc: "Connect buyers directly with city partners via WhatsApp" },
            { icon: PiggyBank, title: "Save", desc: "Save money with transparent pricing and price alerts" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-card border border-border bg-card p-6 shadow-card text-center hover-scale">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-light">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* For Buyers & Sellers */}
      <div className="mx-auto max-w-3xl grid gap-6 md:grid-cols-2">
        <div className="rounded-card border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-bold text-foreground">For Buyers</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• See all prices — local + 10+ online — your choice</li>
            <li>• Contact sellers directly via WhatsApp</li>
            <li>• Set price alerts for your favorite products</li>
            <li>• 100% free, no registration needed</li>
          </ul>
        </div>
        <div className="rounded-card border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Store className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-bold text-foreground">For Sellers</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Free listing — always</li>
            <li>• Daily WhatsApp price reports</li>
            <li>• Price intelligence to stay competitive</li>
            <li>• Direct buyer leads via WhatsApp</li>
          </ul>
        </div>
      </div>

      {/* Platforms */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Platforms We Compare</h2>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {platforms.map((p) => (
            <span key={p} className="rounded-pill border border-border px-3 py-1 text-sm text-foreground transition-all duration-200 hover:border-primary hover:bg-primary-light">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Company */}
      <div className="mx-auto max-w-3xl text-center rounded-card bg-muted/50 p-6">
        <p className="font-semibold text-foreground">Priya Kayal Mart LLP</p>
        <p className="text-sm text-muted-foreground">Founded 2026 · Madurai, Tamil Nadu, India</p>
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-3xl text-center rounded-card bg-primary-light p-8">
        <h3 className="text-lg font-bold text-foreground mb-2">Are you a local retailer?</h3>
        <p className="text-sm text-muted-foreground mb-4">Join Bazaar Hub and reach thousands of buyers in your city.</p>
        <Link to="/seller/register" className="inline-block rounded-pill bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-200 hover:bg-primary-dark">
          Register Your Shop — FREE
        </Link>
      </div>
    </div>
  </div>
);

export default AboutPage;
