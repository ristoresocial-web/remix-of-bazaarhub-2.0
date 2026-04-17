import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Eye, EyeOff, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mobileSchema, passwordSchema } from "@/lib/authValidation";
import PriceTagLogo from "@/components/auth/PriceTagLogo";
import OtpVerifyStep from "@/components/auth/OtpVerifyStep";

type MobileStep = "enterMobile" | "otpAndPwd";

const ForgotPasswordPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mobile flow
  const [mobile, setMobile] = useState("");
  const [mobileStep, setMobileStep] = useState<MobileStep>("enterMobile");
  const [verificationId, setVerificationId] = useState("");
  const [adminBypass, setAdminBypass] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileErrors, setMobileErrors] = useState<Record<string, string>>({});

  const sendMobileOtp = async () => {
    setMobileErrors({});
    const parsed = mobileSchema.safeParse(mobile);
    if (!parsed.success) {
      setMobileErrors({ mobile: parsed.error.issues[0]?.message || "Invalid mobile" });
      return;
    }
    setMobileLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { mobile },
      });
      if (error || !data?.success) {
        setMobileErrors({ mobile: data?.error || error?.message || "Failed to send OTP" });
        setMobileLoading(false);
        return;
      }
      setVerificationId(data.verificationId);
      setAdminBypass(!!data.adminBypass);
      setMobileStep("otpAndPwd");
      toast({
        title: "OTP sent",
        description: data.adminBypass ? "Admin bypass — use 999999" : "Check your SMS.",
      });
    } catch (err) {
      setMobileErrors({ mobile: (err as Error).message });
    } finally {
      setMobileLoading(false);
    }
  };

  const handleResetWithOtp = async (code: string) => {
    setMobileErrors({});

    const pwdCheck = passwordSchema.safeParse(newPwd);
    if (!pwdCheck.success) {
      setMobileErrors({ form: pwdCheck.error.issues[0]?.message || "Invalid password" });
      return;
    }
    if (newPwd !== confirmPwd) {
      setMobileErrors({ form: "Passwords don't match" });
      return;
    }

    setMobileLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("reset-password-otp", {
        body: { mobile, verificationId, code, newPassword: newPwd },
      });
      if (error || !data?.success) {
        setMobileErrors({ form: data?.error || error?.message || "Could not reset password" });
        setMobileLoading(false);
        return;
      }
      toast({
        title: "Password updated",
        description: "Log in with your new password.",
      });
      navigate("/auth");
    } catch (err) {
      setMobileErrors({ form: (err as Error).message });
    } finally {
      setMobileLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password — Bazaar Hub</title>
        <meta name="description" content="Reset your Bazaar Hub password using a mobile OTP." />
      </Helmet>
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <PriceTagLogo size={48} />
            <h1 className="mt-3 text-xl font-bold text-foreground">Reset via Mobile OTP</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll send a 6-digit code to your registered mobile number
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs font-semibold text-primary">
              <Smartphone className="h-3.5 w-3.5" /> Mobile OTP
            </div>

            {mobileStep === "enterMobile" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMobileOtp();
                }}
                className="space-y-4"
              >
                <Link
                  to="/auth"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </Link>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Registered Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="notranslate flex h-11 items-center rounded-lg border border-input bg-muted px-3 text-sm font-semibold text-muted-foreground">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="99434 40384"
                      className="notranslate h-11 flex-1 rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  {mobileErrors.mobile && (
                    <p className="mt-1 text-xs text-destructive">{mobileErrors.mobile}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={mobileLoading}
                  className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50"
                >
                  {mobileLoading ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

            {mobileStep === "otpAndPwd" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
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
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Min 8 chars, 1 letter + 1 number
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">
                    Confirm New Password
                  </label>
                  <input
                    type={showPwd ? "text" : "password"}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <OtpVerifyStep
                    mobile={mobile}
                    loading={mobileLoading}
                    error={mobileErrors.form || ""}
                    onVerify={handleResetWithOtp}
                    onResend={sendMobileOtp}
                    onBack={() => setMobileStep("enterMobile")}
                    adminBypass={adminBypass}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
