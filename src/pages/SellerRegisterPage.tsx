import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  Store, User, Phone, MapPin, Camera, Upload, CheckCircle, Loader2, MessageSquare, Navigation, ChevronRight, ChevronLeft, Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { allCities } from "@/lib/cityUtils";

/* ─── validation helpers ─── */
const validMobile = (v: string) => /^[6-9][0-9]{9}$/.test(v);
const validGST = (v: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.toUpperCase());
const validPAN = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v.toUpperCase());
const validName = (v: string) => v.trim().length >= 3;

const CATEGORIES = ["Electronics", "Appliances", "Fashion", "Beauty", "Furniture", "Baby", "Sports", "Books"];

/* ─── step labels ─── */
const STEPS = ["Info", "Location", "Shop", "WhatsApp", "Review"] as const;

interface FormData {
  shopName: string; ownerName: string; mobile: string; otp: string;
  gst: string; pan: string;
  city: string; address: string; detectingLocation: boolean;
  categories: string[]; shopPhoto: File | null; profilePhoto: File | null;
  shopPhotoPreview: string; profilePhotoPreview: string;
  whatsappDone: boolean; promoCode: string; promoApplied: boolean;
  agreed: boolean;
}

const initial: FormData = {
  shopName: "", ownerName: "", mobile: "", otp: "",
  gst: "", pan: "",
  city: "Madurai", address: "", detectingLocation: false,
  categories: [], shopPhoto: null, profilePhoto: null,
  shopPhotoPreview: "", profilePhotoPreview: "",
  whatsappDone: false, promoCode: "", promoApplied: false,
  agreed: false,
};

const SellerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initial);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  /* countdown timer */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const set = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }, []);

  const validate = (field: string, value: string) => {
    let msg = "";
    if (field === "mobile" && value && !validMobile(value)) msg = "Please enter a valid 10-digit mobile number";
    if (field === "gst" && value && !validGST(value)) msg = "Please enter a valid 15-character GST number";
    if (field === "pan" && value && !validPAN(value)) msg = "Please enter valid PAN (e.g. ABCDE1234F)";
    if ((field === "shopName" || field === "ownerName") && value && !validName(value)) msg = "Please add a few more characters (min 3)";
    setErrors((e) => (msg ? { ...e, [field]: msg } : (() => { const n = { ...e }; delete n[field]; return n; })()));
  };

  const sendOTP = () => {
    if (attempts >= 3) return;
    setAttempts((a) => a + 1);
    setOtpSent(true);
    setCountdown(30);
  };

  const handleImage = (field: "shopPhoto" | "profilePhoto", file: File | null) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrors((e) => ({ ...e, [field]: "Only JPG, PNG, WEBP formats allowed" }));
      return;
    }
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > 5) {
      setErrors((e) => ({ ...e, [field]: `Almost there! Image is ${sizeMB.toFixed(1)}MB — max 5MB allowed. Please compress and retry.` }));
      return;
    }
    if (sizeMB > 2) {
      setErrors((e) => ({ ...e, [field]: `Image is ${sizeMB.toFixed(1)}MB. Compress free at squoosh.app` }));
    }
    const preview = URL.createObjectURL(file);
    set(field, file);
    set(field === "shopPhoto" ? "shopPhotoPreview" : "profilePhotoPreview", preview);
  };

  const detectLocation = () => {
    set("detectingLocation", true);
    setTimeout(() => {
      set("city", "Madurai");
      set("address", "78, KK Nagar Main Road, Madurai - 625020");
      set("detectingLocation", false);
    }, 1500);
  };

  const step1Valid = validName(form.shopName) && validName(form.ownerName) && validMobile(form.mobile) && form.otp.length === 4 && !errors.gst && !errors.pan;
  const step2Valid = form.city.length > 0;
  const step3Valid = form.categories.length > 0;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => navigate("/seller/dashboard"), 1500);
  };

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
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > num ? "bg-primary" : "bg-border"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">{errors[field]}</p> : null;

  const inputCls = (field: string) =>
    `w-full rounded-input border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-ring ${
      errors[field] ? "border-destructive" : "border-border focus:border-primary"
    }`;

  return (
    <div className="pb-20 md:pb-0">
      <Helmet>
        <title>Register Your Shop — Bazaar Hub</title>
        <meta name="description" content="Join Bazaar Hub as a seller. Register your shop in 5 easy steps." />
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

          {/* ══════ STEP 1 — Basic Info ══════ */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Basic Information</h2>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Shop Name *</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input value={form.shopName} onChange={(e) => set("shopName", e.target.value)} onBlur={() => validate("shopName", form.shopName)} className={inputCls("shopName")} placeholder="e.g. Poorvika Mobiles" />
                </div>
                <FieldError field="shopName" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Owner Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} onBlur={() => validate("ownerName", form.ownerName)} className={inputCls("ownerName")} placeholder="Your full name" />
                </div>
                <FieldError field="ownerName" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Mobile Number *</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => validate("mobile", form.mobile)} className={inputCls("mobile")} placeholder="9876543210" maxLength={10} />
                  </div>
                  {!otpSent ? (
                    <Button onClick={sendOTP} disabled={!validMobile(form.mobile) || attempts >= 3} className="shrink-0">
                      Send OTP
                    </Button>
                  ) : countdown > 0 ? (
                    <Button disabled className="shrink-0 opacity-60">
                      Resend 0:{countdown.toString().padStart(2, "0")}
                    </Button>
                  ) : (
                    <Button onClick={sendOTP} disabled={attempts >= 3} className="shrink-0">
                      Resend OTP
                    </Button>
                  )}
                </div>
                <FieldError field="mobile" />
                {attempts >= 3 && <p className="text-destructive text-xs mt-1">Almost there! Let's try another way. <button className="underline text-primary">Contact Support</button></p>}
              </div>
              {otpSent && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Enter OTP *</label>
                  <input value={form.otp} onChange={(e) => set("otp", e.target.value.replace(/\D/g, "").slice(0, 4))} className="w-32 rounded-input border border-border bg-background px-3 py-2.5 text-center text-lg tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-ring" placeholder="····" maxLength={4} />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">GST Number</label>
                <input value={form.gst} onChange={(e) => set("gst", e.target.value.toUpperCase().slice(0, 15))} onBlur={() => validate("gst", form.gst)} className="w-full rounded-input border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="22AAAAA0000A1Z5" maxLength={15} />
                <FieldError field="gst" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">PAN Number</label>
                <input value={form.pan} onChange={(e) => set("pan", e.target.value.toUpperCase().slice(0, 10))} onBlur={() => validate("pan", form.pan)} className="w-full rounded-input border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="ABCDE1234F" maxLength={10} />
                <FieldError field="pan" />
              </div>
            </div>
          )}

          {/* ══════ STEP 2 — Location ══════ */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Shop Location</h2>
              <Button onClick={detectLocation} disabled={form.detectingLocation} className="w-full gap-2" size="lg">
                {form.detectingLocation ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
                {form.detectingLocation ? "Detecting location..." : "Detect My Location"}
              </Button>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">City *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full rounded-input border border-border bg-background py-2.5 pl-10 pr-4 text-sm appearance-none">
                    {allCities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Full Address</label>
                <textarea value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full rounded-input border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={3} placeholder="Full shop address" />
              </div>
              <div className="flex h-48 items-center justify-center rounded-card bg-muted text-4xl">
                📍 <span className="ml-2 text-base text-muted-foreground">Shop location on map</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Can't detect? <button className="text-primary underline">Enter manually</button>
              </p>
            </div>
          )}

          {/* ══════ STEP 3 — Shop Details ══════ */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Shop Details</h2>
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Categories (select all that apply) *</label>
                <div className="grid grid-cols-2 gap-2">
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
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shop Photo */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Shop Photo</label>
                {form.shopPhotoPreview ? (
                  <div className="relative">
                    <img src={form.shopPhotoPreview} alt="Shop" className="h-40 w-full rounded-card object-cover" />
                    <button onClick={() => { set("shopPhoto", null); set("shopPhotoPreview", ""); }} className="absolute top-2 right-2 rounded-full bg-card p-1 shadow">✕</button>
                  </div>
                ) : (
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-primary/50 bg-primary-light/30 transition-all duration-200 hover:bg-primary-light">
                    <Upload className="h-6 w-6 text-primary" />
                    <span className="text-sm text-primary font-medium">Upload Shop Photo</span>
                    <span className="text-[10px] text-muted-foreground">JPG, PNG, WEBP · Max 5MB</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImage("shopPhoto", e.target.files?.[0] ?? null)} />
                  </label>
                )}
                <FieldError field="shopPhoto" />
              </div>

              {/* Profile Photo */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Profile Photo</label>
                {form.profilePhotoPreview ? (
                  <div className="relative w-24">
                    <img src={form.profilePhotoPreview} alt="Profile" className="h-24 w-24 rounded-full object-cover" />
                    <button onClick={() => { set("profilePhoto", null); set("profilePhotoPreview", ""); }} className="absolute top-0 right-0 rounded-full bg-card p-1 shadow">✕</button>
                  </div>
                ) : (
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary-light/30 transition-all duration-200 hover:bg-primary-light">
                    <Camera className="h-5 w-5 text-primary" />
                    <span className="text-[9px] text-primary font-medium mt-1">Photo</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImage("profilePhoto", e.target.files?.[0] ?? null)} />
                  </label>
                )}
                <FieldError field="profilePhoto" />
              </div>
            </div>
          )}

          {/* ══════ STEP 4 — WhatsApp Setup ══════ */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-card bg-gradient-to-br from-success to-success/80 p-6 text-success-foreground">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" /> FREE Daily Price Reports on WhatsApp!
                </h2>
                <p className="mt-1 text-sm opacity-90">Get daily competitive pricing updates directly on WhatsApp</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-card border border-border bg-card p-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-sm font-bold text-success-foreground">1</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Save Bazaar Hub Number</p>
                    <p className="text-xs text-muted-foreground">+91 98765 00000</p>
                  </div>
                  <Button variant="outline" size="sm">Save to Contacts</Button>
                </div>

                <div className="rounded-card border border-border bg-card p-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-sm font-bold text-success-foreground">2</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Send "Hi" on WhatsApp</p>
                  </div>
                  <a
                    href={`https://wa.me/919876500000?text=${encodeURIComponent("Hi! I'm registering as a seller on Bazaar Hub.")}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-pill bg-success px-4 py-1.5 text-xs font-semibold text-success-foreground transition-all duration-200 hover:bg-success/90"
                  >
                    Open WhatsApp
                  </a>
                </div>

                <div className="rounded-card border border-border bg-card p-4 flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${form.whatsappDone ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                    {form.whatsappDone ? <CheckCircle className="h-5 w-5" /> : "3"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{form.whatsappDone ? "WhatsApp is ready!" : "Confirm WhatsApp setup"}</p>
                  </div>
                  {!form.whatsappDone && (
                    <Button size="sm" onClick={() => set("whatsappDone", true)}>Confirm</Button>
                  )}
                </div>
              </div>

              <div className="rounded-card border border-border bg-card p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Have a promo code?</span>
                </div>
                <div className="flex gap-2">
                  <input value={form.promoCode} onChange={(e) => set("promoCode", e.target.value)} placeholder="BAZAAR2025" className="flex-1 rounded-input border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <Button size="sm" variant="outline" onClick={() => set("promoApplied", true)} disabled={!form.promoCode.trim()}>Apply</Button>
                </div>
                {form.promoApplied && <p className="text-xs text-success font-medium">FREE subscription activated! 🎉</p>}
              </div>
            </div>
          )}

          {/* ══════ STEP 5 — Review ══════ */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground">Review & Submit</h2>
              <div className="rounded-card border border-border bg-card shadow-card divide-y divide-border">
                {[
                  { label: "Shop Name", value: form.shopName, editStep: 1 },
                  { label: "Owner", value: form.ownerName, editStep: 1 },
                  { label: "Mobile", value: form.mobile, editStep: 1 },
                  { label: "GST", value: form.gst || "—", editStep: 1 },
                  { label: "PAN", value: form.pan || "—", editStep: 1 },
                  { label: "City", value: form.city, editStep: 2 },
                  { label: "Address", value: form.address || "—", editStep: 2 },
                  { label: "Categories", value: form.categories.join(", ") || "—", editStep: 3 },
                  { label: "WhatsApp", value: form.whatsappDone ? "Connected ✓" : "Not set up", editStep: 4 },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className="text-sm font-medium text-foreground">{r.value}</p>
                    </div>
                    <button onClick={() => setStep(r.editStep)} className="text-xs text-primary font-medium hover:underline">Edit</button>
                  </div>
                ))}
              </div>

              <div className="rounded-card bg-primary-light border border-primary/20 p-4">
                <p className="text-sm font-medium text-foreground">
                  Your shop gets ready to go live within 24 hours! You'll receive SMS + WhatsApp on approval.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={form.agreed} onCheckedChange={(v) => set("agreed", !!v)} className="mt-0.5" />
                <span className="text-sm text-foreground">I agree to Bazaar Hub seller terms and conditions</span>
              </label>

              <Button onClick={handleSubmit} disabled={!form.agreed || submitting} className="w-full" size="lg">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                {submitting ? "Getting ready..." : "Confirm and Register"}
              </Button>
            </div>
          )}

          {/* ═── Navigation ═── */}
          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : <div />}
            {step < 5 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
