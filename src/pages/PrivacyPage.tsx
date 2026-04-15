import React from "react";
import { Helmet } from "react-helmet-async";
import BazaarLogo from "@/components/BazaarLogo";

const sections = [
  { id: "data-collect", title: "1. Data We Collect", content: "We collect personal information (name, email, mobile number), location data (city selected or auto-detected via GPS), usage data (search history, product views, price alert preferences), and device data (browser type, device type, IP address)." },
  { id: "data-use", title: "2. How We Use Your Data", content: "To provide and improve the price comparison service, personalise results based on your city, send price alerts and platform notifications, for marketing communications (with your consent), and to analyse platform usage." },
  { id: "data-sharing", title: "3. Data Sharing", content: "Your personal data is NOT sold to third parties. We may share anonymised, aggregated data for analytics purposes. Seller contact information is shared with buyers only when the buyer initiates contact via WhatsApp." },
  { id: "data-deletion", title: "4. Data Deletion", content: "Buyers can request complete deletion of their personal data by emailing bazaarhubcare@gmail.com. We will process deletion requests within 30 business days in accordance with applicable Indian data protection laws." },
  { id: "cookies", title: "5. Cookies & Tracking", content: "BazaarHub uses cookies and local storage to remember your city selection, language preference, and session state. We use analytics tools to understand platform usage patterns. You can clear cookies through your browser settings." },
  { id: "contact", title: "6. Contact", content: "For privacy-related queries, contact us at bazaarhubcare@gmail.com or write to Priya Kayal Mart LLP, Madurai, Tamil Nadu, India." },
];

const PrivacyPage: React.FC = () => (
  <div className="pb-20 md:pb-0">
    <Helmet>
      <title>Privacy Policy — Bazaar Hub</title>
      <meta name="description" content="Privacy Policy for BazaarHub. Learn how we collect, use, and protect your data." />
    </Helmet>

    <section className="bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy))] py-12">
      <div className="container text-center">
        <BazaarLogo className="mb-3 text-4xl" showTagline={false} />
        <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
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

export default PrivacyPage;
