import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageCircle, Clock, CheckCircle, Store, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";

const topics = [
  "General Enquiry",
  "Seller Support",
  "Buyer Support",
  "Report Incorrect Price",
  "Partnership / Business",
  "Technical Issue",
  "Other",
];

const ContactPage: React.FC = () => {
  const { selectedCity } = useApp();
  const [form, setForm] = useState({ topic: "", name: "", contact: "", city: selectedCity, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.topic) e.topic = "Please select a topic";
    if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters";
    if (!form.contact.trim()) e.contact = "Email or phone is required";
    else {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact.trim());
      const isPhone = /^[+]?[\d\s-]{7,15}$/.test(form.contact.trim());
      if (!isEmail && !isPhone) e.contact = "Please enter a valid email or phone number";
    }
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ topic: "", name: "", contact: "", city: selectedCity, message: "" });
    setSubmitted(false);
    setErrors({});
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Bazaar Hub</title>
        <meta name="description" content="Get in touch with Bazaar Hub. Reach out for support, partnerships, or general enquiries via WhatsApp or email." />
      </Helmet>

      <div className="container py-8 space-y-8 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground text-sm mt-1">We're here to help. Reach us on WhatsApp for fastest response.</p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left — Form */}
          <motion.div className="md:col-span-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                {submitted ? (
                  <div className="text-center py-8 space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <h2 className="text-lg font-semibold">Message sent!</h2>
                    <p className="text-sm text-muted-foreground">We'll reply within 24 hours via email or WhatsApp.</p>
                    <Button onClick={resetForm} variant="outline">Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="font-semibold text-lg">Send Us a Message</h2>

                    <div>
                      <Label>Topic</Label>
                      <Select value={form.topic} onValueChange={v => setForm(p => ({ ...p, topic: v }))}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select a topic..." /></SelectTrigger>
                        <SelectContent>
                          {topics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.topic && <p className="text-xs text-destructive mt-1">{errors.topic}</p>}
                    </div>

                    <div>
                      <Label>Name</Label>
                      <Input className="mt-1" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} maxLength={100} />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <Label>Email or Phone</Label>
                      <Input className="mt-1" placeholder="you@email.com or +91 98765 43210" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} maxLength={255} />
                      {errors.contact && <p className="text-xs text-destructive mt-1">{errors.contact}</p>}
                    </div>

                    <div>
                      <Label>City</Label>
                      <Input className="mt-1" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} maxLength={100} />
                    </div>

                    <div>
                      <Label>Message</Label>
                      <Textarea className="mt-1 min-h-[100px]" placeholder="How can we help?" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} maxLength={1000} />
                      {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                    </div>

                    <Button type="submit" disabled={loading} className="gap-2">
                      <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right — Direct Contact */}
          <motion.div className="md:col-span-2 space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-semibold text-lg">Fastest Ways to Reach Us</h2>

            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2"><MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp (Recommended)</p>
              <p className="text-sm text-muted-foreground notranslate">+91 99434 40384</p>
              <Button asChild size="sm" className="mt-1 bg-green-600 hover:bg-green-700 text-white gap-1">
                <a href="https://wa.me/919943440384" target="_blank" rel="noopener noreferrer"><MessageCircle className="h-3.5 w-3.5" /> Chat on WhatsApp</a>
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Usually responds within 1 hour</p>
            </div>

            <hr className="border-border" />

            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> Email</p>
              <p className="text-sm text-muted-foreground notranslate">bazaarhubcare@gmail.com</p>
              <Button asChild variant="outline" size="sm" className="mt-1 gap-1">
                <a href="mailto:bazaarhubcare@gmail.com"><Mail className="h-3.5 w-3.5" /> Send Email</a>
              </Button>
            </div>

            <hr className="border-border" />

            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> Support Hours</p>
              <p className="text-sm text-muted-foreground">Mon–Sat: 9 AM – 7 PM IST</p>
              <p className="text-sm text-muted-foreground">Sunday: 10 AM – 4 PM IST</p>
            </div>

            <hr className="border-border" />

            <div className="space-y-1">
              <p className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Registered Office</p>
              <p className="text-sm text-muted-foreground">BazaarHub Technologies Pvt Ltd</p>
              <p className="text-sm text-muted-foreground">Madurai, Tamil Nadu, India</p>
            </div>
          </motion.div>
        </div>

        {/* Seller Support Banner */}
        <Card className="bg-accent/50 border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Store className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">Are you a seller with issues?</h3>
              <p className="text-sm text-muted-foreground">Login to your Seller Dashboard for direct support and faster resolution.</p>
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/seller/dashboard">Go to Seller Dashboard →</Link></Button>
          </CardContent>
        </Card>

        {/* FAQ Teaser */}
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <HelpCircle className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">Looking for quick answers?</h3>
              <p className="text-sm text-muted-foreground">Check our FAQ page — most common questions answered.</p>
            </div>
            <Button asChild variant="outline" size="sm"><Link to="/faq">View FAQ →</Link></Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ContactPage;
