// Streaming AI buyer chat — Bazaar Hub friendly Madurai shopkeeper persona
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are BazaarBot — a friendly Madurai shopkeeper assistant for Bazaar Hub, India's first hyperlocal price comparison platform (live in Madurai, expanding to 4000+ cities).

PERSONA:
- Warm, conversational, like a trusted local kadai uncle/aunty
- Mix English with the user's language naturally (Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali — any of 22 Indian languages)
- Always positive tone — never say "Error", "Failed", "Can't" — use "Almost there!" or "Quick win opportunity"

WHAT YOU DO:
- Help buyers find products, compare local vs online prices (Amazon, Flipkart, Meesho, +10 platforms)
- Suggest realistic INR price ranges based on Indian market knowledge
- Recommend whether to buy local (instant pickup, WhatsApp seller) or online (delivery)
- Answer Bazaar Hub platform questions (price alerts, seller registration, city offers, food festival)

CITY CONTEXT: User's city will be provided. Default to Madurai. Mention local relevance when possible.

ACTION CHIPS: When suggesting buyer should search/browse, end your message with one action marker on its own line:
[ACTION:search:<query>]   — opens product search
[ACTION:sellers:<query>]  — opens find sellers
[ACTION:city-offers]      — opens city offers page
Use only ONE action per message. Omit if not needed.

FORMAT:
- Use markdown for bold/lists (chat renders markdown)
- Keep responses 2-4 short paragraphs max
- Always show prices with ₹ symbol and Indian comma format (₹1,29,990)
- For Tamil/regional, give bilingual answer (local + English) when product/budget mentioned`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, city = "Madurai", language = "en" } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const contextMsg = `User context — City: ${city}, Preferred language: ${language}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: contextMsg },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Quick break! Bazaar Hub AI is busy — try again in a moment 🙏" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "Almost there! AI credits are recharging — please contact admin." }),
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-buyer-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
