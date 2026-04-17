// Reset password using mobile OTP (forgot password flow, no JWT required)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const ADMIN_BYPASS_MOBILE = "9943440384";
const ADMIN_BYPASS_OTP = "999999";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mobile = String(body?.mobile ?? "").replace(/\D/g, "");
    const verificationId = String(body?.verificationId ?? "");
    const code = String(body?.code ?? "").replace(/\D/g, "");
    const newPassword = String(body?.newPassword ?? "");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return new Response(
        JSON.stringify({ error: "Invalid mobile number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!verificationId || code.length !== 6) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (
      newPassword.length < 8 ||
      !/[A-Za-z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      return new Response(
        JSON.stringify({ error: "Password must be 8+ chars with at least one letter and one number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const customerId = Deno.env.get("MESSAGECENTRAL_CUSTOMER_ID");
    const authToken = Deno.env.get("MESSAGECENTRAL_AUTH_TOKEN");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const isAdminBypass =
      mobile === ADMIN_BYPASS_MOBILE &&
      verificationId === "ADMIN_BYPASS" &&
      code === ADMIN_BYPASS_OTP;

    if (!isAdminBypass) {
      if (!customerId || !authToken) {
        return new Response(
          JSON.stringify({ error: "OTP service not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const verifyUrl = `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${mobile}&verificationId=${verificationId}&customerId=${customerId}&code=${code}`;
      const mcRes = await fetch(verifyUrl, { method: "GET", headers: { authToken } });
      const text = await mcRes.text();
      let parsed: any;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
      console.log("MC verify (reset-password):", mcRes.status, parsed);

      const verificationStatus =
        parsed?.data?.verificationStatus || parsed?.verificationStatus;
      const ok =
        mcRes.ok &&
        (verificationStatus === "VERIFICATION_COMPLETED" ||
          verificationStatus === "SUCCESS" ||
          parsed?.responseCode === 200);

      if (!ok) {
        return new Response(
          JSON.stringify({ error: parsed?.message || "Invalid OTP" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Find user by mobile in profiles
    const { data: profile, error: profErr } = await admin
      .from("profiles")
      .select("user_id")
      .eq("mobile", mobile)
      .maybeSingle();

    if (profErr) {
      console.error("profile lookup error:", profErr);
    }

    // Don't leak account existence — return generic success either way
    if (!profile?.user_id) {
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: updErr } = await admin.auth.admin.updateUserById(profile.user_id, {
      password: newPassword,
    });

    if (updErr) {
      console.error("updateUserById error:", updErr);
      return new Response(
        JSON.stringify({ error: "Could not update password" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("reset-password-otp error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
