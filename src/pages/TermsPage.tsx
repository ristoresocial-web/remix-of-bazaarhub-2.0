import React from "react";
import { Helmet } from "react-helmet-async";
import BazaarLogo from "@/components/BazaarLogo";

const TermsPage: React.FC = () => (
  <div className="pb-20 md:pb-0">
    <Helmet>
      <title>Terms of Service — Bazaar Hub</title>
      <meta name="description" content="Terms of Service for BazaarHub, India's hyperlocal price comparison platform operated by Priya Kayal Mart LLP." />
    </Helmet>

    <section className="bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy))] py-12">
      <div className="container text-center">
        <BazaarLogo className="mb-3 text-4xl" showTagline={false} />
        <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-white/60">Last updated: March 2026</p>
      </div>
    </section>

    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">1. Platform Nature</h2>
          <p>BazaarHub is a price comparison platform, not a seller. We aggregate and display product prices from local sellers and online platforms to help buyers make informed purchase decisions. BazaarHub does not sell, stock, ship, or deliver any products.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">2. Transactions</h2>
          <p>All transactions are between buyers and sellers directly. BazaarHub is not a party to any transaction between a buyer and a seller. We do not guarantee the quality, safety, legality, or availability of any product listed on the platform.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">3. Seller Responsibilities</h2>
          <p>Sellers are responsible for the accuracy of their listings, including product names, prices, descriptions, images, and availability. Misrepresentation of product information may lead to listing removal or account suspension.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">4. Prohibited Products</h2>
          <p>The following categories of products are banned and may not be listed on BazaarHub:</p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li>Illegal drugs, narcotics, and controlled substances</li>
            <li>Weapons, firearms, and ammunition</li>
            <li>Counterfeit or pirated goods</li>
            <li>Stolen property</li>
            <li>Products that violate intellectual property rights</li>
            <li>Hazardous materials and explosives</li>
            <li>Wildlife products and endangered species items</li>
            <li>Tobacco and related products</li>
            <li>Any product prohibited under Indian law</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">5. Content Removal</h2>
          <p>BazaarHub reserves the right to remove any listing, seller account, or content without prior notice if it violates Indian law, platform guidelines, or these Terms of Service.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">6. Subscription & Fees</h2>
          <p>Subscription fees, ad slot fees, and banner booking fees are non-refundable once the service period has commenced. Exceptions may be granted at BazaarHub's sole discretion for documented platform errors that prevented service delivery.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">7. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Madurai, Tamil Nadu.</p>
        </section>

        <div className="rounded-card bg-muted/50 p-4 text-center text-xs text-muted-foreground">
          <p>© 2026 Bazaar Hub — Priya Kayal Mart LLP, Madurai, Tamil Nadu</p>
        </div>
      </div>
    </div>
  </div>
);

export default TermsPage;
