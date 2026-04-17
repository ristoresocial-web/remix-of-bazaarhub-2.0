// AI Trust Score — deterministic base + AI-generated bilingual review prompt
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { seller_id } = await req.json();
    if (!seller_id) {
      return new Response(JSON.stringify({ error: "seller_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: profile } = await admin
      .from("profiles")
      .select("name, business_owner_name, gst_number, pan_number, business_address, pin_code, shop_category, mobile_verified, registration_complete, city")
      .eq("user_id", seller_id)
      .maybeSingle();

    // Profile completeness 40
    let completeness = 0;
    if (profile) {
      const fields = [
        profile.name,
        profile.business_owner_name,
        profile.business_address,
        profile.pin_code,
        profile.shop_category,
        profile.city,
      ];
      const filled = fields.filter((f) => f && String(f).trim().length > 0).length;
      completeness = Math.round((filled / fields.length) * 40);
    }

    // Doc verification 30
    let docScore = 0;
    if (profile?.gst_number) docScore += 15;
    if (profile?.pan_number) docScore += 10;
    if (profile?.mobile_verified) docScore += 5;

    // Listing quality 30 (count active products by name match — no FK yet)
    let listingScore = 0;
    if (profile?.name) {
      const { count } = await admin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      const c = count || 0;
      listingScore = Math.min(30, Math.round((c / 10) * 30));
    }

    const seller_score = Math.min(100, completeness + docScore + listingScore);

    // AI-generated bilingual review prompt
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let review_prompt_en = "Loved your purchase? Drop a quick review and help fellow shoppers!";
    let review_prompt_ta = "உங்கள் வாங்குதல் நல்லாயிருந்ததா? ஒரு சிறு review போடுங்க, மற்றவர்களுக்கு உதவும்!";

    if (LOVABLE_API_KEY) {
      try {
        const tools = [
          {
            type: "function",
            function: {
              name: "return_prompt",
              description: "Return short bilingual review request",
              parameters: {
                type: "object",
                properties: {
                  review_prompt_en: { type: "string", description: "Friendly English review request, max 20 words" },
                  review_prompt_ta: { type: "string", description: "Tamil version, conversational Madurai tone, max 20 words" },
                },
                required: ["review_prompt_en", "review_prompt_ta"],
                additionalProperties: false,
              },
            },
          },
        ];
        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  "Generate a short bilingual review request for a Bazaar Hub buyer. Use the return_prompt tool.",
              },
              {
                role: "user",
                content: `Seller: ${profile?.name || "Bazaar Hub seller"} in ${profile?.city || "Madurai"}.`,
              },
            ],
            tools,
            tool_choice: { type: "function", function: { name: "return_prompt" } },
          }),
        });
        if (aiResp.ok) {
          const data = await aiResp.json();
          const tc = data.choices?.[0]?.message?.tool_calls?.[0];
          if (tc) {
            const a = JSON.parse(tc.function.arguments);
            review_prompt_en = a.review_prompt_en || review_prompt_en;
            review_prompt_ta = a.review_prompt_ta || review_prompt_ta;
          }
        }
      } catch (e) {
        console.warn("AI prompt fallback:", e);
      }
    }

    const breakdown = { completeness, doc_score: docScore, listing_score: listingScore };

    return new Response(
      JSON.stringify({ seller_score, breakdown, review_prompt_en, review_prompt_ta }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("ai-trust-score error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
