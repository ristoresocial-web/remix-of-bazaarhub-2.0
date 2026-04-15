import React from "react";
import { Helmet } from "react-helmet-async";
import BazaarLogo from "@/components/BazaarLogo";

const sections = [
  { id: "platform", title: "1. Platform Nature", content: "BazaarHub is a price comparison platform, not a seller. We aggregate and display product prices from city partners and online platforms to help buyers make informed purchase decisions. BazaarHub does not sell, stock, ship, or deliver any products." },
  { id: "transactions", title: "2. Transactions", content: "All transactions are between buyers and sellers directly. BazaarHub is not a party to any transaction between a buyer and a seller. We do not guarantee the quality, safety, legality, or availability of any product listed on the platform." },
  { id: "seller-responsibilities", title: "3. Seller Responsibilities", content: "Sellers are responsible for the accuracy of their listings, including product names, prices, descriptions, images, and availability. Misrepresentation of product information may lead to listing removal or account suspension." },
  { id: "prohibited", title: "4. Prohibited Products", content: "The following categories of products are banned: illegal drugs, weapons, counterfeit goods, stolen property, products violating intellectual property rights, hazardous materials, wildlife products, tobacco products, and any product prohibited under Indian law." },
  { id: "content-removal", title: "5. Content Removal", content: "BazaarHub reserves the right to remove any listing, seller account, or content without prior notice if it violates Indian law, platform guidelines, or these Terms of Service." },
  { id: "fees", title: "6. Subscription & Fees", content: "Subscription fees, ad slot fees, and banner booking fees are non-refundable once the service period has commenced. Exceptions may be granted at BazaarHub's sole discretion for documented platform issues." },
  { id: "governing-law", title: "7. Governing Law", content: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Madurai, Tamil Nadu." },
];

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
      <div className="flex gap-10 max-w-5xl mx-auto">
        {/* TOC Sidebar */}
        <nav className="hidden md:block w-56 flex-shrink-0 sticky top-20 self-start">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Contents</p>
          <ul className="space-y-2">
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{s.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-8 text-sm leading-relaxed text-muted-foreground">
          {sections.map(s => (
            <section key={s.id} id={s.id}>
              <h2 className="mb-2 text-lg font-bold text-foreground">{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}

          <div className="rounded-card bg-muted/50 p-4 text-center text-xs text-muted-foreground">
            <p>© 2026 Bazaar Hub — Priya Kayal Mart LLP, Madurai, Tamil Nadu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TermsPage;
