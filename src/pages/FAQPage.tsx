import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "What is Bazaar Hub?", a: "Bazaar Hub is India's local price comparison platform. We help you find the best prices for products by comparing rates from local city sellers and major online platforms like Amazon, Flipkart, and more." },
  { q: "Is Bazaar Hub free to use?", a: "Yes! Bazaar Hub is completely free for buyers. You can search, compare prices, set alerts, and contact sellers at no cost." },
  { q: "How do I find local sellers?", a: "Use the 'Find Sellers' feature — enter a product name and your city, and we'll show you nearby sellers with their prices, ratings, and contact details." },
  { q: "How are prices updated?", a: "Online prices are fetched via affiliate APIs from Amazon, Flipkart, and other platforms. Local seller prices are updated by the sellers themselves through their dashboards." },
  { q: "Can I set price drop alerts?", a: "Absolutely! On any product page, click 'Set Alert' and enter your target price. We'll notify you via email or WhatsApp when the price drops." },
  { q: "How do I become a seller?", a: "Visit our 'Become a Seller' page and complete the 5-step registration. You can list your first 10 products for free. No GST required to get started." },
  { q: "Is my data safe?", a: "Yes. We use industry-standard encryption and never share your personal data with third parties. See our Privacy Policy for details." },
  { q: "Does Bazaar Hub sell products directly?", a: "No. Bazaar Hub is a comparison and discovery platform. We connect buyers with sellers — all transactions happen directly between you and the seller." },
  { q: "What cities are supported?", a: "Bazaar Hub supports 4,000+ Indian cities across all 28 states and 8 Union Territories. We auto-detect your city using GPS or you can select it manually." },
  { q: "How do I contact support?", a: "Visit our Contact page or reach us via WhatsApp at +91 99434 40384. We typically respond within 24 hours." },
];

const FAQPage: React.FC = () => (
  <>
    <Helmet>
      <title>Frequently Asked Questions — Bazaar Hub</title>
      <meta name="description" content="Find answers to common questions about Bazaar Hub — pricing, sellers, alerts, and more." />
    </Helmet>

    <div className="container py-10 max-w-3xl space-y-8">
      <motion.div className="text-center space-y-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <HelpCircle className="h-10 w-10 text-primary mx-auto" />
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about Bazaar Hub</p>
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
