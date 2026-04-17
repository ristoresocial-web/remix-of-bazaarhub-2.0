import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { passwordSchema } from "@/lib/authValidation";
import OtpVerifyStep from "@/components/auth/OtpVerifyStep";

const maskMobile = (m: string) => {
  if (!m) return "";
  const digits = m.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return m;
  return `+91 ${digits.slice(0, 2)}****${digits.slice(-4)}`;
};

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isLoggedIn, loading: authLoading, signOut } = useAuth();

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [step, setStep] = useState<"form" | "otp">("form");
  const [verificationId, setVerificationId] = useState("");
  const [adminBypass, setAdminBypass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mobile = (profile?.mobile || "").replace(/\D/g, "").slice(-10);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) navigate("/auth");
  }, [authLoading, isLoggedIn, navigate]);

  const sendOtp = async () => {
    setErrors({});

    if (!currentPwd) {
      setErrors({ currentPwd: "Enter your current password" });
      return;
    }
    const parsed = passwordSchema.safeParse(newPwd);
    if (!parsed.success) {
      setErrors({ newPwd: parsed.error.issues[0]?.message || "Invalid password" });
      return;
    }
    if (newPwd !== confirmPwd) {
      setErrors({ confirmPwd: "Passwords don't match" });
      return;
    }
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      setErrors({ form: "No verified mobile on your account. Contact support." });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate with current password
      const email = user?.email || profile?.email || "";
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password: currentPwd,
      });
      if (signErr) {
        setErrors({ currentPwd: "Current password is incorrect" });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { mobile },
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
        description: data.adminBypass ? "Admin bypass — use 999999" : `Sent to ${maskMobile(mobile)}`,
      });
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const verifyAndUpdate = async (code: string) => {
    setErrors({});
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("change-password-otp", {
        body: { verificationId, code, newPassword: newPwd },
      });
      if (error || !data?.success) {
        setErrors({ form: data?.error || error?.message || "Could not update password" });
        setLoading(false);
        return;
      }
      toast({
        title: "Password updated",
        description: "Please log in with your new password.",
      });
      await signOut();
      navigate("/auth");
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <>
      <Helmet>
        <title>Change Password — Bazaar Hub</title>
        <meta name="description" content="Update your Bazaar Hub account password securely with mobile OTP." />
      </Helmet>

      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h1 className="mt-3 text-xl font-bold text-foreground">Change Password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll send a 6-digit OTP to your registered mobile
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            {step === "form" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendOtp();
                }}
                className="space-y-4"
              >
                <Link
                  to="/buyer/dashboard"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
                </Link>

                <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Registered mobile:{" "}
                  <strong className="notranslate text-foreground">
                    {mobile ? maskMobile(mobile) : "Not set"}
                  </strong>
                </div>

                <Field label="Current Password" error={errors.currentPwd}>
                  <div className="relative">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPwd}
                      onChange={(e) => setCurrentPwd(e.target.value)}
                      autoComplete="current-password"
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-11 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <PwdToggle show={showCurrent} onToggle={() => setShowCurrent((s) => !s)} />
                  </div>
                </Field>

                <Field label="New Password" error={errors.newPwd} hint="Min 8 chars, 1 letter + 1 number">
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      autoComplete="new-password"
                      className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-11 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                    <PwdToggle show={showNew} onToggle={() => setShowNew((s) => !s)} />
                  </div>
                </Field>

                <Field label="Confirm New Password" error={errors.confirmPwd}>
                  <input
                    type={showNew ? "text" : "password"}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </Field>

                {errors.form && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                    {errors.form}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Send OTP"}
                </button>
              </form>
            ) : (
              <OtpVerifyStep
                mobile={mobile}
                loading={loading}
                error={errors.form || ""}
                onVerify={verifyAndUpdate}
                onResend={sendOtp}
                onBack={() => setStep("form")}
                adminBypass={adminBypass}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const PwdToggle: React.FC<{ show: boolean; onToggle: () => void }> = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={show ? "Hide password" : "Show password"}
    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
  >
    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
);

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

export default ChangePasswordPage;
