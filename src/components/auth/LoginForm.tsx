import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/lib/authValidation";

const looksLikeMobile = (s: string) => /^[6-9]\d{9}$/.test(s.replace(/\D/g, ""));

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; form?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = loginSchema.safeParse({ identifier: identifier.trim(), password });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        identifier: fieldErrors.identifier?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setLoading(true);
    try {
      let emailToUse = identifier.trim();

      if (looksLikeMobile(emailToUse)) {
        const cleanMobile = emailToUse.replace(/\D/g, "");
        const { data: profile, error: pErr } = await supabase
          .from("profiles")
          .select("email")
          .eq("mobile", cleanMobile)
          .maybeSingle();
        if (pErr || !profile?.email) {
          setErrors({ form: "No account found for this mobile number" });
          setLoading(false);
          return;
        }
        emailToUse = profile.email;
      }

      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (authErr) {
        setErrors({ form: authErr.message || "Invalid email/mobile or password" });
        setLoading(false);
        return;
      }

      // Fetch role for redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, is_admin")
          .eq("user_id", user.id)
          .maybeSingle();

        toast({ title: "Welcome back!", description: "You're now logged in." });

        if (profile?.is_admin || profile?.role === "admin") {
          navigate("/admin");
        } else if (profile?.role === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/buyer/dashboard");
        }
      } else {
        navigate("/buyer/dashboard");
      }
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-foreground">Email or Mobile Number</label>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com or 99434 40384"
          autoComplete="username"
          className="notranslate h-11 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          required
        />
        {errors.identifier && <p className="mt-1 text-xs text-destructive">{errors.identifier}</p>}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">Password</label>
          <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-11 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
          <button
            type="button"
            aria-label={showPwd ? "Hide password" : "Show password"}
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
      </div>

      {errors.form && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {errors.form}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50"
      >
        {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Log In"}
      </button>
    </form>
  );
};

export default LoginForm;
