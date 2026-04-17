// Verify OTP via Message Central + create Supabase user
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const ADMIN_BYPASS_MOBILE = "9943440384";
const ADMIN_BYPASS_OTP = "999999";

interface SignupData {
  role: "buyer" | "seller";
  email: string;
  password: string;
  mobile: string;
  // buyer
  name?: string;
  city?: string;
  // seller
  business_owner_name?: string;
  gst_number?: string;
  pan_number?: string;
  msme_number?: string;
  business_address?: string;
  pin_code?: string;
  shop_category?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mobile = String(body?.mobile ?? "").replace(/\D/g, "");
    const verificationId = String(body?.verificationId ?? "");
    const code = String(body?.code ?? "").replace(/\D/g, "");
    const signupData: SignupData | undefined = body?.signupData;

    if (!/^[6-9]\d{9}$/.test(mobile) || !verificationId || code.length !== 6) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!signupData?.email || !signupData?.password || !signupData?.role) {
      return new Response(
        JSON.stringify({ error: "Missing signup data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const customerId = Deno.env.get("MESSAGECENTRAL_CUSTOMER_ID");
    const authToken = Deno.env.get("MESSAGECENTRAL_AUTH_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Admin bypass
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
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { raw: text };
      }

      console.log("MessageCentral verify response:", mcRes.status, parsed);

      const verificationStatus =
        parsed?.data?.verificationStatus || parsed?.verificationStatus;
      const ok =
        mcRes.ok &&
        (verificationStatus === "VERIFICATION_COMPLETED" ||
          verificationStatus === "SUCCESS" ||
          parsed?.responseCode === 200);

      if (!ok) {
        return new Response(
          JSON.stringify({
            error: parsed?.message || "Invalid OTP",
            details: parsed,
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Create Supabase user with metadata
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userMetadata: Record<string, any> = {
      role: signupData.role,
      mobile,
      mobile_verified: true,
      city: signupData.city || "Madurai",
    };

    if (signupData.role === "buyer") {
      userMetadata.full_name = signupData.name || "";
    } else {
      userMetadata.full_name = signupData.business_owner_name || "";
      userMetadata.business_owner_name = signupData.business_owner_name || "";
      userMetadata.gst_number = signupData.gst_number?.toUpperCase() || null;
      userMetadata.pan_number = signupData.pan_number?.toUpperCase() || null;
      userMetadata.msme_number = signupData.msme_number?.toUpperCase() || null;
      userMetadata.business_address = signupData.business_address || "";
      userMetadata.pin_code = signupData.pin_code || "";
      userMetadata.shop_category = signupData.shop_category || "";
    }

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: signupData.email,
      password: signupData.password,
      email_confirm: true, // mobile verified — skip email confirmation
      user_metadata: userMetadata,
    });

    if (createErr) {
      console.error("createUser error:", createErr);
      const msg = (createErr.message || "").toLowerCase();
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        return new Response(
          JSON.stringify({ error: "An account already exists with this email" }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: createErr.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, userId: created.user?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("verify-otp error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
