import React from "react";
import { Helmet } from "react-helmet-async";
import BazaarLogo from "@/components/BazaarLogo";

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
      <div className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">1. Data We Collect</h2>
          <p>We collect the following data when you use BazaarHub:</p>
          <ul className="mt-2 ml-4 list-disc space-y-1">
            <li><strong className="text-foreground">Personal information:</strong> Name, email address, mobile number</li>
            <li><strong className="text-foreground">Location data:</strong> City selected or auto-detected via GPS</li>
            <li><strong className="text-foreground">Usage data:</strong> Search history, product views, price alert preferences</li>
            <li><strong className="text-foreground">Device data:</strong> Browser type, device type, IP address</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">2. How We Use Your Data</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>To provide and improve the price comparison service</li>
            <li>To personalise results based on your city and preferences</li>
            <li>To send price alerts and platform notifications</li>
            <li>For marketing communications (with your consent)</li>
            <li>To analyse platform usage and improve performance</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">3. Data Sharing</h2>
          <p>Your personal data is <strong className="text-foreground">NOT sold to third parties</strong>. We may share anonymised, aggregated data for analytics purposes. Seller contact information is shared with buyers only when the buyer initiates contact via WhatsApp.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">4. Data Deletion</h2>
          <p>Buyers can request complete deletion of their personal data by emailing <strong className="text-foreground">support@bazaarhub.in</strong>. We will process deletion requests within 30 business days in accordance with applicable Indian data protection laws.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">5. Cookies & Tracking</h2>
          <p>BazaarHub uses cookies and local storage to remember your city selection, language preference, and session state. We use analytics tools to understand platform usage patterns. You can clear cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold text-foreground">6. Contact</h2>
          <p>For privacy-related queries, contact us at <strong className="text-foreground">support@bazaarhub.in</strong> or write to Priya Kayal Mart LLP, Madurai, Tamil Nadu, India.</p>
        </section>

        <div className="rounded-card bg-muted/50 p-4 text-center text-xs text-muted-foreground">
          <p>© 2026 Bazaar Hub — Priya Kayal Mart LLP, Madurai, Tamil Nadu</p>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPage;
