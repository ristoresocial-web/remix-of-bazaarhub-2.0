import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { emailSchema } from "@/lib/authValidation";
import PriceTagLogo from "@/components/auth/PriceTagLogo";

const ForgotPasswordPage: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = emailSchema.safeParse(email.trim());
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Invalid email");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
    toast({ title: "Email sent", description: "Check your inbox for the reset link." });
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password — Bazaar Hub</title>
        <meta name="description" content="Reset your Bazaar Hub password by email." />
      </Helmet>
      <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <PriceTagLogo size={48} />
            <h1 className="mt-3 text-xl font-bold text-foreground">Reset your password</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              We'll email you a link to set a new password
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            {sent ? (
              <div className="space-y-4 text-center">
                <Mail className="mx-auto h-10 w-10 text-primary" />
                <p className="text-sm text-foreground">
                  If an account exists for <strong className="notranslate">{email}</strong>, a reset
                  link is on its way. Check your inbox and spam folder.
                </p>
                <Link
                  to="/auth"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-[hsl(var(--primary-dark))]"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Link
                  to="/auth"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </Link>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-foreground">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
