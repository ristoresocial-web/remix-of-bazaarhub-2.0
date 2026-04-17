// Admin AI Doc Verification — PAN/GST OCR + tamper detection
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Bazaar Hub's Document Verification AI for Indian PAN and GSTIN documents.

For each uploaded document image:
1. Extract the legal name and registration number (PAN: 10 chars AAAAA9999A; GSTIN: 15 chars)
2. Look for tampering signs: misaligned text, font inconsistencies, edited regions, blur over key fields, copy-paste artifacts
3. Compare extracted name to expected_name (case-insensitive, ignore middle initials)
4. Compute confidence_score (0-100) reflecting OCR clarity AND name match AND tamper-free likelihood
5. Risk level: Low (>=85), Medium (60-84), High (<60) OR any clear tampering

Always use the return_verification tool.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check — must be admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: profile } = await adminClient
      .from("profiles")
      .select("is_admin")
      .eq("user_id", claims.claims.sub)
      .maybeSingle();

    if (!profile?.is_admin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { doc_type, image_base64, image_mime, expected_name } = await req.json();

    if (!doc_type || !image_base64 || !expected_name) {
      return new Response(
        JSON.stringify({ error: "doc_type, image_base64, expected_name required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const tools = [
      {
        type: "function",
        function: {
          name: "return_verification",
          description: "Return document verification result.",
          parameters: {
            type: "object",
            properties: {
              extracted_name: { type: "string" },
              registration_number: { type: "string", description: "PAN or GSTIN" },
              name_match: { type: "boolean" },
              confidence_score: { type: "number", minimum: 0, maximum: 100 },
              risk_level: { type: "string", enum: ["Low", "Medium", "High"] },
              tamper_notes: { type: "string" },
            },
            required: [
              "extracted_name",
              "registration_number",
              "name_match",
              "confidence_score",
              "risk_level",
              "tamper_notes",
            ],
            additionalProperties: false,
          },
        },
      },
    ];

    const userContent = [
      {
        type: "text",
        text: `Document type: ${doc_type.toUpperCase()}\nExpected name on document: "${expected_name}"\nVerify and extract.`,
      },
      {
        type: "image_url",
        image_url: { url: `data:${image_mime || "image/jpeg"};base64,${image_base64}` },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "return_verification" } },
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "AI is busy — try again in a moment 🙏" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits recharging — contact admin." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway issue" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No structured response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-doc-verify error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
