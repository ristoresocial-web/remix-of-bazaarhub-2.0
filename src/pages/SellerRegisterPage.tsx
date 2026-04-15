import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import {
  Store, Phone, MapPin, CheckCircle, Loader2, ChevronRight, ChevronLeft, Rocket, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { allCities } from "@/lib/cityUtils";
import { motion, AnimatePresence } from "framer-motion";

/* ─── validation helpers ─── */
const validMobile = (v: string) => /^[6-9][0-9]{9}$/.test(v);
const validGST = (v: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.toUpperCase());
const validName = (v: string) => v.trim().length >= 3;

const CATEGORIES = ["Mobiles", "TVs", "Laptops", "ACs", "Refrigerators", "Audio"];
const PRODUCT_RANGES = ["1–10", "11–50", "51–200", "200+"] as const;
const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "தமிழ்", value: "ta" },
  { label: "हिंदी", value: "hi" },
  { label: "తెలుగు", value: "te" },
  { label: "ಕನ್ನಡ", value: "kn" },
];

const STEPS = ["Shop Details", "Business Details", "Connect WhatsApp"] as const;

interface FormData {
  shopName: string;
  city: string;
  phone: string;
  gst: string;
  categories: string[];
  productRange: string;
  whatsapp: string;
  sameAsPhone: boolean;
  language: string;
  agreed: boolean;
}

const initial: FormData = {
  shopName: "",
  city: "Madurai",
  phone: "",
  gst: "",
  categories: [],
  productRange: "51–200",
  whatsapp: "",
  sameAsPhone: false,
  language: "en",
  agreed: false,
};

const SellerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }, []);

  const validate = (field: string, value: string) => {
    let msg = "";
    if (field === "phone" && value && !validMobile(value)) msg = "Please enter a valid 10-digit mobile number";
    if (field === "gst" && value && !validGST(value)) msg = "Please enter a valid 15-character GST number";
    if (field === "shopName" && value && !validName(value)) msg = "Please add a few more characters (min 3)";
    if (field === "whatsapp" && value && !validMobile(value)) msg = "Please enter a valid 10-digit number";
    setErrors((e) => (msg ? { ...e, [field]: msg } : (() => { const n = { ...e }; delete n[field]; return n; })()));
  };

  const step1Valid = validName(form.shopName) && form.city.length > 0 && validMobile(form.phone);
  const step2Valid = form.gst.length > 0 && validGST(form.gst) && form.categories.length >= 1;
  const whatsappNum = form.sameAsPhone ? form.phone : form.whatsapp;
  const step3Valid = validMobile(whatsappNum) && form.agreed;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  const inputCls = (field: string) =>
    `w-full rounded-input border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-ring ${
      errors[field] ? "border-destructive" : "border-border focus:border-primary"
    }`;

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">{errors[field]}</p> : null;

  /* ─── progress bar ─── */
  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                  done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle className="h-5 w-5" /> : num}
              </div>
              <span className={`text-[10px] font-medium text-center ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > num ? "bg-primary" : "bg-border"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  /* ─── Success Screen ─── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 pb-20 md:pb-0">
        <Helmet>
          <title>Shop Registered — Bazaar Hub</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-md rounded-2xl border bg-card shadow-card p-8 text-center space-y-5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
          >
            <CheckCircle className="h-12 w-12 text-success" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground">🎉 Shop Registered!</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground notranslate">{form.shopName}</span> is being reviewed.
          </p>
          <p className="text-sm text-muted-foreground">
            Our team will approve within 24 hours.<br />
            You'll get an SMS + WhatsApp when live!
          </p>

          <Button onClick={() => navigate("/seller/dashboard")} className="w-full" size="lg">
            Go to Seller Dashboard <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>Register Your Shop — Bazaar Hub</title>
        <meta name="description" content="Join Bazaar Hub as a seller. Register your shop in 3 easy steps." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[hsl(var(--navy-deep))] to-[hsl(var(--navy))] py-10">
        <div className="container text-center">
          <Store className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold text-white">Register Your Shop</h1>
          <p className="mt-1 text-sm text-white/70">Join 5,000+ sellers across India on Bazaar Hub</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="mx-auto max-w-lg">
          <ProgressBar />

          <AnimatePresence mode="wait">
            {/* ══════ STEP 1 — Shop Details ══════ */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Step 1 of 3 — Shop Details</h2>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Shop Name *</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={form.shopName} onChange={(e) => set("shopName", e.target.value)} onBlur={() => validate("shopName", form.shopName)} className={inputCls("shopName")} placeholder="e.g. Poorvika Mobiles" />
                  </div>
                  <FieldError field="shopName" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">City *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full rounded-input border border-border bg-background py-2.5 pl-10 pr-4 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring">
                      {allCities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Your Phone *</label>
                  <div className="flex gap-2">
                    <span className="flex items-center rounded-input border border-border bg-muted px-3 text-sm font-medium text-muted-foreground">+91</span>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => validate("phone", form.phone)} className={inputCls("phone")} placeholder="98765 43210" maxLength={10} inputMode="numeric" />
                    </div>
                  </div>
                  <FieldError field="phone" />
                </div>
              </motion.div>
            )}

            {/* ══════ STEP 2 — Business Details ══════ */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Step 2 of 3 — Business Details</h2>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">GST Number *</label>
                  <input value={form.gst} onChange={(e) => set("gst", e.target.value.toUpperCase().slice(0, 15))} onBlur={() => validate("gst", form.gst)} className="w-full rounded-input border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="33AABCK1234A1Z5" maxLength={15} />
                  <p className="text-xs text-muted-foreground mt-1">15 characters (e.g. 33AABCK1234A1Z5)</p>
                  <FieldError field="gst" />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground">Categories you sell (select all that apply) *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => {
                      const active = form.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => set("categories", active ? form.categories.filter((c) => c !== cat) : [...form.categories, cat])}
                          className={`rounded-card border-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            active ? "border-primary bg-primary-light text-primary" : "border-border bg-card text-foreground hover:border-primary/50"
                          }`}
                        >
                          {active ? "☑" : "☐"} {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground">Approx. products you have</label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => set("productRange", range)}
                        className={`rounded-pill px-4 py-2 text-sm font-medium border-2 transition-all duration-200 ${
                          form.productRange === range ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {form.productRange === range ? "●" : "○"} {range}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════ STEP 3 — Connect WhatsApp ══════ */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">Step 3 of 3 — Connect WhatsApp</h2>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">WhatsApp Number (for buyer inquiries) *</label>
                  <div className="flex gap-2">
                    <span className="flex items-center rounded-input border border-border bg-muted px-3 text-sm font-medium text-muted-foreground">+91</span>
                    <div className="relative flex-1">
                      <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={form.sameAsPhone ? form.phone : form.whatsapp}
                        onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        onBlur={() => validate("whatsapp", form.sameAsPhone ? form.phone : form.whatsapp)}
                        disabled={form.sameAsPhone}
                        className={`${inputCls("whatsapp")} ${form.sameAsPhone ? "opacity-60" : ""}`}
                        placeholder="98765 43210"
                        maxLength={10}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <FieldError field="whatsapp" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={form.sameAsPhone} onCheckedChange={(v) => set("sameAsPhone", !!v)} />
                  <span className="text-sm text-foreground">Same as phone number</span>
                </label>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-muted-foreground">Language Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => set("language", lang.value)}
                        className={`rounded-pill px-4 py-2 text-sm font-medium border-2 transition-all duration-200 ${
                          form.language === lang.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {form.language === lang.value ? "●" : "○"} {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={form.agreed} onCheckedChange={(v) => set("agreed", !!v)} className="mt-0.5" />
                  <span className="text-sm text-foreground">
                    I agree to{" "}
                    <Link to="/seller-terms" className="text-primary underline" target="_blank" rel="noopener noreferrer">
                      BazaarHub Terms & Conditions
                    </Link>
                  </span>
                </label>

                <Button onClick={handleSubmit} disabled={!step3Valid || submitting} className="w-full" size="lg">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Rocket className="h-5 w-5 mr-2" />}
                  {submitting ? "Getting ready..." : "Register My Shop"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═── Navigation ═── */}
          {!success && (
            <div className="mt-6 flex items-center justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              ) : <div />}
              {step < 3 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          )}

          {/* Footer links */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already a seller?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
