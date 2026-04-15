import React from "react";
import { Helmet } from "react-helmet-async";
import BazaarLogo from "@/components/BazaarLogo";

const SellerTermsPage: React.FC = () => (
  <div className="pb-20 md:pb-0">
    <Helmet>
      <title>Seller Agreement — Bazaar Hub</title>
      <meta name="description" content="Seller Agreement for BazaarHub. Terms and conditions for sellers listing products on the platform." />
    </Helmet>

    <section className="bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy))] py-12">
      <div className="container text-center">
        <BazaarLogo className="mb-3 text-4xl" showTagline={false} />
        <h1 className="text-2xl font-bold text-white">Seller Agreement</h1>
        <p className="mt-2 text-sm text-white/60">Last updated: March 2026</p>
      </div>
    </section>

    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">1. Accurate Product Information</h2>
          <p>Sellers must provide accurate and up-to-date product information including product names, descriptions, prices, availability, and images. All prices listed must be the actual selling price offered to walk-in or contacting buyers.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">2. Price Honouring</h2>
          <p>Sellers must honour the prices listed on BazaarHub when a buyer contacts them through the platform. If a price has changed, the seller must update it on BazaarHub within 24 hours. Repeatedly failing to honour listed prices may result in account warnings or suspension.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">3. Misrepresentation</h2>
          <p>Any form of misrepresentation — including fake prices to attract buyers, listing products not in stock, or providing false shop information — will lead to immediate account suspension. Repeated violations may result in permanent ban from the platform.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">4. Fees & Refunds</h2>
          <p>BazaarHub subscription fees, ad slot booking fees, banner fees, and boost listing fees are non-refundable once the service period has commenced. This includes:</p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>Monthly subscription plans</li>
            <li>Hero Banner, Category Banner, and Featured Seller slot bookings</li>
            <li>Boost listing purchases</li>
            <li>Any promotional or advertising fees</li>
          </ul>
          <p className="mt-2">Exceptions may be granted at BazaarHub's sole discretion for documented platform errors.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">5. Account Conduct</h2>
          <p>Sellers must not engage in activities that harm the platform or other users, including but not limited to: spamming buyers, manipulating reviews, creating multiple accounts, or circumventing platform rules.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">6. Platform Rights</h2>
          <p>BazaarHub reserves the right to modify, suspend, or terminate any seller account, listing, or feature without prior notice if the seller violates this agreement or applicable Indian law.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">7. Governing Law</h2>
          <p>This agreement is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Madurai, Tamil Nadu.</p>
        </section>

        <div className="rounded-card bg-muted/50 p-4 text-center text-xs text-muted-foreground">
          <p>© 2026 Bazaar Hub — Priya Kayal Mart LLP, Madurai, Tamil Nadu</p>
        </div>
      </div>
    </div>
  </div>
);

export default SellerTermsPage;
