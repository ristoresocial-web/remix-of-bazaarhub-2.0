import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { product_name, category, price, specs, city, local_sellers_count, lowest_local_price, online_lowest_price } = await req.json();

    if (!product_name || !city) {
      return new Response(JSON.stringify({ error: "product_name and city required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check cache first
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: cached } = await supabase
      .from("ai_scores")
      .select("*")
      .eq("product_name", product_name)
      .eq("city", city)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      return new Response(JSON.stringify({
        score: cached.score,
        reasons: cached.reasons,
        verdict: cached.verdict,
        cached: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Call AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const userMessage = `Product: ${product_name}
Category: ${category || "Electronics"}
Price: Rs.${price || "N/A"}
Key specs: ${specs || "Standard specifications"}
Local sellers in ${city}: ${local_sellers_count || 0}
Lowest local price: Rs.${lowest_local_price || "N/A"}
Online lowest price: Rs.${online_lowest_price || "N/A"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: `You are BazaarHub's AI product analyst for Indian buyers in ${city}. Analyze this product and give a BazaarHub Score from 0-100. Score is based on: value for money (40%), specs quality (30%), local availability in ${city} (20%), buyer reviews sentiment (10%).`,
          },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "product_score",
              description: "Return the AI product score analysis",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", description: "Score from 0-100" },
                  reasons: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 short reasons (6 words max each)",
                  },
                  verdict: { type: "string", description: "10 words max verdict" },
                },
                required: ["score", "reasons", "verdict"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "product_score" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result = { score: 75, reasons: ["Good value product", "Decent specifications overall", "Available in local market"], verdict: "Solid choice for buyers" };

    if (toolCall?.function?.arguments) {
      result = JSON.parse(toolCall.function.arguments);
    }

    // Cache the result
    await supabase.from("ai_scores").insert({
      product_name,
      city,
      score: result.score,
      reasons: result.reasons,
      verdict: result.verdict,
    });

    return new Response(JSON.stringify({ ...result, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-product-score error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
