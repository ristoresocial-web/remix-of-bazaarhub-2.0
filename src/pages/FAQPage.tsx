import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "What is BazaarHub?", a: "BazaarHub is India's hyperlocal price comparison platform. We help you find the best prices by comparing rates from city partners and major online platforms like Amazon, Flipkart, and more." },
  { q: "Is BazaarHub free for buyers?", a: "Yes! BazaarHub is completely free for buyers. You can search, compare prices, set alerts, and contact sellers at no cost." },
  { q: "How do I set a price alert?", a: "On any product page, click 'Set Alert' and enter your target price. We'll notify you via WhatsApp when the price drops to your target." },
  { q: "How does the comparison work?", a: "We aggregate prices from local city partners and 10+ online platforms. Our AI engine ranks them by price, availability, and seller trust — showing you the best deal instantly." },
  { q: "Are local prices accurate?", a: "City partner prices are updated by the sellers themselves through their dashboards. We encourage daily updates and flag stale prices automatically." },
  { q: "How often are prices updated?", a: "Online prices are fetched via affiliate APIs in near real-time. City partner prices are updated by sellers — typically daily or when prices change." },
  { q: "How do I register as a seller?", a: "Visit our 'Become a Seller' page and complete the 3-step registration. List up to 50 products for free. No credit card required to get started." },
  { q: "Is BazaarHub available in my city?", a: "BazaarHub supports 4,000+ Indian cities across all 28 states and 8 Union Territories. We auto-detect your city using GPS or you can select it manually." },
  { q: "How do I get WhatsApp notifications?", a: "Save your WhatsApp number in your profile or when setting a price alert. We send notifications for price drops, deal alerts, and order updates directly to your WhatsApp." },
  { q: "How do I report an incorrect price?", a: "On any product page, click the 'Report' button and select 'Incorrect Price'. Our team reviews reports within 24 hours and corrects any discrepancies." },
];

const FAQPage: React.FC = () => (
  <>
    <Helmet>
      <title>Frequently Asked Questions — Bazaar Hub</title>
      <meta name="description" content="Find answers to common questions about BazaarHub — pricing, sellers, alerts, comparisons, and more." />
    </Helmet>

    <div className="container py-10 max-w-3xl space-y-8">
      <motion.div className="text-center space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <HelpCircle className="h-10 w-10 text-primary mx-auto" />
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about BazaarHub</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-sm">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground mb-3">Still have questions?</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  </>
);

export default FAQPage;
