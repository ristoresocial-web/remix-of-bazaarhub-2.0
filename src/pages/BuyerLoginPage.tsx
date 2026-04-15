import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminPhone, generateOTP, storeOTP, verifyOTP, saveBuyer, createPartialProfile } from "@/lib/buyerAuth";
import { useToast } from "@/hooks/use-toast";

type Step = "choose" | "email-input" | "email-otp" | "whatsapp-input" | "whatsapp-otp" | "register";

const BuyerLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [regForm, setRegForm] = useState({ name: "", username: "", city: localStorage.getItem("bazaarhub_city") || "Madurai", language: "en", mobile: "", email: "" });

  useEffect(() => {
    if (user && profile?.registration_complete) {
      navigate("/buyer/dashboard");
    } else if (user && profile && !profile.registration_complete) {
      setStep("register");
      setRegForm(f => ({
        ...f,
        name: profile.name || user.user_metadata?.full_name || "",
        email: profile.email || user.email || "",
        username: suggestUsername(profile.name || user.user_metadata?.full_name || ""),
      }));
    }
  }, [user, profile]);

  function suggestUsername(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 100);
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const sendEmailOTP = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      toast({ title: "OTP sent", description: "Check your inbox and spam folder for the verification code." });
      setStep("email-otp");
    }
  };

  const verifyEmailOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the 6-digit code"); return; }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: "email",
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    }
  };

  const sendWhatsAppOTP = async () => {
    const clean = mobile.replace(/\s/g, "");
    if (clean.length < 10) { setError("Enter a valid mobile number"); return; }
    setLoading(true);
    setError("");
    if (isAdminPhone(clean)) {
      const prof = createPartialProfile("whatsapp", clean);
      prof.name = "Admin";
      prof.username = "admin";
      prof.isAdmin = true;
      prof.registrationComplete = true;
      saveBuyer(prof);
      setLoading(false);
      navigate("/buyer/dashboard");
      return;
    }
    const code = generateOTP();
    storeOTP(code);
    console.log("WhatsApp OTP (mock):", code);
    toast({ title: "OTP sent via WhatsApp", description: `OTP will arrive on WhatsApp. (Dev: ${code})` });
    setLoading(false);
    setStep("whatsapp-otp");
  };

  const verifyWhatsAppOTP = () => {
    const code = otp.join("");
    if (code.length !== 6) { setError("Enter the 6-digit code"); return; }
    setLoading(true);
    const result = verifyOTP(code);
    if (!result.valid) {
      setError(result.error || "Invalid OTP");
      setLoading(false);
      return;
    }
    const prof = createPartialProfile("whatsapp", mobile);
    saveBuyer(prof);
    setLoading(false);
    setStep("register");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error: authError } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (authError) {
      setError(authError.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  const completeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name.trim()) { setError("Name is required"); return; }
    if (!regForm.username.trim()) { setError("Username is required"); return; }
    setLoading(true);
    setError("");
    if (user) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: regForm.name.trim(),
          username: regForm.username.trim(),
          city: regForm.city,
          language: regForm.language,
          mobile: regForm.mobile || null,
          email: regForm.email || user.email || null,
          registration_complete: true,
        })
        .eq("user_id", user.id);
      if (updateError) {
        if (updateError.message.includes("username")) {
          setError("Username already taken. Try another.");
        } else {
          setError(updateError.message);
        }
        setLoading(false);
        return;
      }
      await refreshProfile();
    } else {
      const buyer = createPartialProfile("whatsapp", mobile);
      buyer.name = regForm.name;
      buyer.username = regForm.username;
      buyer.city = regForm.city;
      buyer.language = regForm.language;
      buyer.registrationComplete = true;
      saveBuyer(buyer);
    }
    setLoading(false);
    navigate("/buyer/dashboard");
  };

  const otpInput = (
    <div className="mx-auto flex justify-center gap-2">
      {otp.map((d, i) => (
        <input
          key={i}
          ref={el => { otpRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={e => handleOtpChange(i, e.target.value)}
          onKeyDown={e => handleOtpKeyDown(i, e)}
          className="h-12 w-10 rounded-lg border border-input bg-background text-center text-lg font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Login — Bazaar Hub</title>
        <meta name="description" content="Log in to Bazaar Hub to save searches, set price alerts, and contact sellers." />
      </Helmet>
      <div className="container flex min-h-[60vh] items-center justify-center py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-card">
          {step !== "choose" && (
            <button onClick={() => { setStep("choose"); setError(""); setOtp(["","","","","",""]); }} className="mb-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}

          {step === "choose" && (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-xl font-bold text-foreground">Welcome to Bazaar Hub</h1>
                <p className="mt-1 text-sm text-muted-foreground">Log in to save searches, set price alerts & contact sellers</p>
              </div>
              <button onClick={() => setStep("email-input")} className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary hover:bg-accent">
                <Mail className="h-5 w-5 text-primary" /> Continue with Email
              </button>
              <button onClick={() => setStep("whatsapp-input")} className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-[#25D366] hover:bg-[#25D366]/5">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Continue with WhatsApp
              </button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or</span></div>
              </div>
              <button onClick={handleGoogleLogin} disabled={loading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-border px-4 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary hover:bg-accent disabled:opacity-50">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Sign in with Google
              </button>
              {error && <p className="text-center text-xs text-destructive">{error}</p>}
            </div>
          )}

          {step === "email-input" && (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="mx-auto mb-2 h-10 w-10 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Enter your email</h2>
                <p className="text-xs text-muted-foreground">We'll send a 6-digit verification code</p>
              </div>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" autoFocus />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button onClick={sendEmailOTP} disabled={loading} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50">
                {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Send OTP"}
              </button>
            </div>
          )}

          {step === "email-otp" && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground">Verify your email</h2>
                <p className="text-xs text-muted-foreground">OTP sent to <strong className="notranslate">{email}</strong>. Check inbox and spam folder.</p>
              </div>
              {otpInput}
              {error && <p className="text-center text-xs text-destructive">{error}</p>}
              <button onClick={verifyEmailOTP} disabled={loading} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50">
                {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Verify"}
              </button>
              <button onClick={() => { setOtp(["","","","","",""]); sendEmailOTP(); }} className="w-full text-center text-xs text-primary hover:underline">Resend OTP</button>
            </div>
          )}

          {step === "whatsapp-input" && (
            <div className="space-y-4">
              <div className="text-center">
                <svg className="mx-auto mb-2 h-10 w-10" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <h2 className="text-lg font-bold text-foreground">Enter your mobile number</h2>
                <p className="text-xs text-muted-foreground">OTP will arrive on WhatsApp</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="notranslate rounded-lg border border-input bg-muted px-3 py-3 text-sm font-semibold text-muted-foreground">+91</span>
                <input type="tel" value={mobile} onChange={e => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }} placeholder="99434 40384" className="notranslate flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-[#25D366] focus:outline-none focus:ring-2 focus:ring-[#25D366]/20" autoFocus />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button onClick={sendWhatsAppOTP} disabled={loading} className="w-full rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1da851] disabled:opacity-50">
                {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Send OTP via WhatsApp"}
              </button>
            </div>
          )}

          {step === "whatsapp-otp" && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground">Verify WhatsApp OTP</h2>
                <p className="text-xs text-muted-foreground">OTP sent to <strong className="notranslate">+91 {mobile}</strong> via WhatsApp</p>
              </div>
              {otpInput}
              {error && <p className="text-center text-xs text-destructive">{error}</p>}
              <button onClick={verifyWhatsAppOTP} disabled={loading} className="w-full rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1da851] disabled:opacity-50">
                {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Verify"}
              </button>
              <button onClick={() => { setOtp(["","","","","",""]); sendWhatsAppOTP(); }} className="w-full text-center text-xs text-[#25D366] hover:underline">Resend OTP</button>
            </div>
          )}

          {step === "register" && (
            <form onSubmit={completeRegistration} className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-foreground">Complete your profile</h2>
                <p className="text-xs text-muted-foreground">Just a few details to get started</p>
              </div>
              <input type="text" placeholder="Full Name *" value={regForm.name} onChange={e => setRegForm(f => ({ ...f, name: e.target.value, username: suggestUsername(e.target.value) }))} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" required />
              <input type="text" placeholder="Username *" value={regForm.username} onChange={e => setRegForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" required />
              <input type="text" placeholder="City" value={regForm.city} onChange={e => setRegForm(f => ({ ...f, city: e.target.value }))} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              <input type="tel" placeholder="Mobile (optional)" value={regForm.mobile} onChange={e => setRegForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))} className="notranslate w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              <input type="email" placeholder="Email (optional)" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} className="notranslate w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50">
                {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Start Shopping"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyerLoginPage;
