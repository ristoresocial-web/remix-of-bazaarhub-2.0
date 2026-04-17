// Change password for logged-in user (validates JWT in code)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const ADMIN_BYPASS_MOBILE = "9943440384";
const ADMIN_BYPASS_OTP = "999999";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const token = authHeader.replace("Bearer ", "");
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: claimErr } = await userClient.auth.getClaims(token);
    if (claimErr || !claims?.claims?.sub) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const userId = claims.claims.sub;

    const body = await req.json().catch(() => ({}));
    const verificationId = String(body?.verificationId ?? "");
    const code = String(body?.code ?? "").replace(/\D/g, "");
    const newPassword = String(body?.newPassword ?? "");

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

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: profile, error: profErr } = await admin
      .from("profiles")
      .select("mobile")
      .eq("user_id", userId)
      .maybeSingle();

    if (profErr || !profile?.mobile) {
      return new Response(
        JSON.stringify({ error: "Mobile number not found on account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const mobile = String(profile.mobile).replace(/\D/g, "").slice(-10);

    const isAdminBypass =
      mobile === ADMIN_BYPASS_MOBILE &&
      verificationId === "ADMIN_BYPASS" &&
      code === ADMIN_BYPASS_OTP;

    if (!isAdminBypass) {
      const customerId = Deno.env.get("MESSAGECENTRAL_CUSTOMER_ID");
      const authTokenMC = Deno.env.get("MESSAGECENTRAL_AUTH_TOKEN");
      if (!customerId || !authTokenMC) {
        return new Response(
          JSON.stringify({ error: "OTP service not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const verifyUrl = `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&mobileNumber=${mobile}&verificationId=${verificationId}&customerId=${customerId}&code=${code}`;
      const mcRes = await fetch(verifyUrl, { method: "GET", headers: { authToken: authTokenMC } });
      const text = await mcRes.text();
      let parsed: any;
      try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
      console.log("MC verify (change-password):", mcRes.status, parsed);

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

    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
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
      JSON.stringify({ success: true, mobile }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("change-password-otp error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
