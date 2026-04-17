// Send OTP via Message Central CPaaS v3
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const ADMIN_BYPASS_MOBILE = "9943440384";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mobile = String(body?.mobile ?? "").replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return new Response(
        JSON.stringify({ error: "Invalid mobile number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Admin bypass — skip real SMS, return a sentinel verificationId
    if (mobile === ADMIN_BYPASS_MOBILE) {
      return new Response(
        JSON.stringify({
          success: true,
          verificationId: "ADMIN_BYPASS",
          adminBypass: true,
          message: "Admin bypass — use OTP 999999",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const customerId = Deno.env.get("MESSAGECENTRAL_CUSTOMER_ID");
    const authToken = Deno.env.get("MESSAGECENTRAL_AUTH_TOKEN");

    if (!customerId || !authToken) {
      console.error("Missing Message Central secrets");
      return new Response(
        JSON.stringify({ error: "OTP service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${customerId}&flowType=SMS&mobileNumber=${mobile}`;

    const mcRes = await fetch(url, {
      method: "POST",
      headers: { authToken },
    });

    const text = await mcRes.text();
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    console.log("MessageCentral send response:", mcRes.status, parsed);

    if (!mcRes.ok) {
      return new Response(
        JSON.stringify({
          error: parsed?.message || "Failed to send OTP",
          details: parsed,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const verificationId =
      parsed?.data?.verificationId ||
      parsed?.verificationId ||
      parsed?.data?.transactionId;

    if (!verificationId) {
      return new Response(
        JSON.stringify({ error: "No verificationId returned", details: parsed }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, verificationId: String(verificationId) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-otp error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
