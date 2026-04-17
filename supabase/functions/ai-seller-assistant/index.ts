// AI Seller Assistant — auto-fill product listings (text + optional image)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Bazaar Hub's Seller Assistant — an Indian e-commerce expert helping local sellers list products professionally.

For every product you receive (name, optional image, optional category):
- Identify product, brand, model, category, condition (New/Used/Refurbished)
- Generate a catchy English title (max 80 chars)
- Write a 3-sentence benefit-focused English description
- Translate description naturally to Tamil (Madurai conversational tone — not formal literary Tamil)
- Suggest 5 English SEO keywords + 5 Tamil/Tanglish search keywords
- Provide realistic INR pricing based on Indian market (Amazon/Flipkart price awareness)
- Flag duplicates or spam-like listings

Always use the return_listing tool. Never return free-form text.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { product_name, image_base64, category, image_mime } = await req.json();

    if (!product_name && !image_base64) {
      return new Response(
        JSON.stringify({ error: "Provide product_name or image_base64" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userContent: any[] = [];
    const textBits: string[] = [];
    if (product_name) textBits.push(`Product name: ${product_name}`);
    if (category) textBits.push(`Category hint: ${category}`);
    if (textBits.length) userContent.push({ type: "text", text: textBits.join("\n") });
    if (image_base64) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${image_mime || "image/jpeg"};base64,${image_base64}` },
      });
    }

    const tools = [
      {
        type: "function",
        function: {
          name: "return_listing",
          description: "Return the structured product listing for Bazaar Hub.",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Catchy product title (<= 80 chars)" },
              description: { type: "string", description: "3-sentence English description, benefit-focused" },
              tamil_description: { type: "string", description: "Natural Madurai-style Tamil translation" },
              keywords_en: {
                type: "array",
                items: { type: "string" },
                minItems: 5,
                maxItems: 5,
              },
              keywords_ta: {
                type: "array",
                items: { type: "string" },
                minItems: 5,
                maxItems: 5,
              },
              brand: { type: "string" },
              model: { type: "string" },
              condition: { type: "string", enum: ["New", "Used", "Refurbished", "Open Box"] },
              category: { type: "string" },
              suggested_price: { type: "number", description: "Suggested INR selling price" },
              price_range_low: { type: "number" },
              price_range_high: { type: "number" },
              reason: { type: "string", description: "1-line pricing reasoning" },
              duplicate_flag: { type: "boolean" },
              spam_flag: { type: "boolean" },
            },
            required: [
              "title",
              "description",
              "tamil_description",
              "keywords_en",
              "keywords_ta",
              "brand",
              "condition",
              "category",
              "suggested_price",
              "price_range_low",
              "price_range_high",
              "reason",
              "duplicate_flag",
              "spam_flag",
            ],
            additionalProperties: false,
          },
        },
      },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: image_base64 ? "google/gemini-2.5-pro" : "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "return_listing" } },
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
    console.error("ai-seller-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
