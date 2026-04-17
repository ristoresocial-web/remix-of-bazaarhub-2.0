import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  sellerRegisterSchema,
  SHOP_CATEGORIES,
  type SellerRegisterInput,
} from "@/lib/authValidation";
import OtpVerifyStep from "./OtpVerifyStep";

const SellerRegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<SellerRegisterInput>({
    business_owner_name: "",
    email: "",
    mobile: "",
    password: "",
    gst_number: "",
    pan_number: "",
    msme_number: "",
    business_address: "",
    pin_code: "",
    shop_category: "",
    acceptedTerms: false as unknown as true,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "otp">("form");
  const [verificationId, setVerificationId] = useState("");
  const [adminBypass, setAdminBypass] = useState(false);

  const update = <K extends keyof SellerRegisterInput>(key: K, val: SellerRegisterInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const sendOtp = async () => {
    setErrors({});
    const parsed = sellerRegisterSchema.safeParse(form);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] || ""])));
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { mobile: form.mobile },
      });
      if (error || !data?.success) {
        setErrors({ form: data?.error || error?.message || "Failed to send OTP" });
        setLoading(false);
        return;
      }
      setVerificationId(data.verificationId);
      setAdminBypass(!!data.adminBypass);
      setStep("otp");
      toast({
        title: "OTP sent",
        description: data.adminBypass ? "Admin bypass — use 999999" : "Check your SMS.",
      });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const verifyAndCreate = async (code: string) => {
    setErrors({});
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: {
          mobile: form.mobile,
          verificationId,
          code,
          signupData: {
            role: "seller",
            email: form.email,
            password: form.password,
            mobile: form.mobile,
            business_owner_name: form.business_owner_name,
            gst_number: form.gst_number || "",
            pan_number: form.pan_number || "",
            msme_number: form.msme_number || "",
            business_address: form.business_address,
            pin_code: form.pin_code,
            shop_category: form.shop_category,
          },
        },
      });
      if (error || !data?.success) {
        setErrors({ form: data?.error || error?.message || "Verification failed" });
        setLoading(false);
        return;
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (signInErr) {
        setErrors({ form: "Account created. Please log in." });
        setTimeout(() => navigate("/auth"), 1500);
        return;
      }

      toast({ title: "Welcome, Seller!", description: "Your shop is ready to go." });
      navigate("/seller/dashboard");
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <OtpVerifyStep
        mobile={form.mobile}
        loading={loading}
        error={errors.form || ""}
        onVerify={verifyAndCreate}
        onResend={sendOtp}
        onBack={() => setStep("form")}
        adminBypass={adminBypass}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendOtp();
      }}
      className="space-y-3"
    >
      <Field label="Business Owner Name" error={errors.business_owner_name}>
        <input
          type="text"
          value={form.business_owner_name}
          onChange={(e) => update("business_owner_name", e.target.value)}
          className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
          className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        />
      </Field>

      <Field label="Mobile Number" error={errors.mobile}>
        <div className="flex items-center gap-2">
          <span className="notranslate flex h-11 items-center rounded-lg border border-input bg-muted px-3 text-sm font-semibold text-muted-foreground">
            +91
          </span>
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="99434 40384"
            className="notranslate h-11 flex-1 rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>
      </Field>

      <Field label="Password" error={errors.password} hint="Min 8 chars, 1 letter + 1 number">
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-11 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            aria-label={showPwd ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3">
        <p className="mb-2 text-xs font-semibold text-foreground">
          Business ID — provide <span className="text-primary">at least one</span>
        </p>
        <div className="space-y-2">
          <Field label="GST Number" error={errors.gst_number}>
            <input
              type="text"
              value={form.gst_number || ""}
              onChange={(e) => update("gst_number", e.target.value.toUpperCase())}
              placeholder="22AAAAA0000A1Z5"
              className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              maxLength={15}
            />
          </Field>
          <Field label="PAN Number" error={errors.pan_number}>
            <input
              type="text"
              value={form.pan_number || ""}
              onChange={(e) => update("pan_number", e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              maxLength={10}
            />
          </Field>
          <Field label="MSME / Udyam Number" error={errors.msme_number}>
            <input
              type="text"
              value={form.msme_number || ""}
              onChange={(e) => update("msme_number", e.target.value.toUpperCase())}
              placeholder="UDYAM-TN-12-1234567"
              className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base uppercase focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Field>
        </div>
      </div>

      <Field label="Full Business Address" error={errors.business_address}>
        <textarea
          value={form.business_address}
          onChange={(e) => update("business_address", e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        />
      </Field>

      <Field label="PIN Code" error={errors.pin_code}>
        <input
          type="text"
          value={form.pin_code}
          onChange={(e) => update("pin_code", e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="625001"
          className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        />
      </Field>

      <Field label="Shop Category" error={errors.shop_category}>
        <select
          value={form.shop_category}
          onChange={(e) => update("shop_category", e.target.value)}
          className="h-11 w-full rounded-xl border border-input bg-background px-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        >
          <option value="">Select category…</option>
          {SHOP_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={!!form.acceptedTerms}
            onChange={(e) => update("acceptedTerms", e.target.checked as unknown as true)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[hsl(var(--primary))]"
          />
          <span className="leading-snug">
            I agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
              Terms of Service
            </a>
            ,{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
              Privacy Policy
            </a>
            , and{" "}
            <a href="/seller-terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
              Seller Terms
            </a>
          </span>
        </label>
        {errors.acceptedTerms && (
          <p className="mt-1 text-xs text-destructive">{errors.acceptedTerms}</p>
        )}
      </div>

      {errors.form && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {errors.form}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !form.acceptedTerms}
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Send OTP"}
      </button>
    </form>
  );
};

const Field: React.FC<{ label: string; error?: string; hint?: string; children: React.ReactNode }> = ({
  label,
  error,
  hint,
  children,
}) => (
  <div>
    <label className="mb-1 block text-xs font-semibold text-foreground">{label}</label>
    {children}
    {hint && !error && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

export default SellerRegisterForm;
