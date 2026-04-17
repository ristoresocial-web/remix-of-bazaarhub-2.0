
User wants a comprehensive AI engine with 3 modes. Let me check current AI infrastructure before planning.

Existing:
- `ai-product-score` edge function (BazaarHub Score)
- `ai-search-suggestions` edge function
- `ChatbotWidget.tsx` — currently keyword-matching, NOT AI-powered
- Gemini API key + LOVABLE_API_KEY both configured
- AI components: `AIPricePrediction`, `AIScoreBadge`, `AISmartSearchBar`, `AIVerdictStrip`

Missing:
- Seller AI assistant (auto-fill product listings)
- Admin doc verification (PAN/GST OCR + tamper check)
- Real AI buyer chatbot (currently just FAQ keywords)
- Tamil bilingual output
- Trust scoring AI

Plan: Build 3 new edge functions + wire into existing UI. Use Lovable AI (gemini-3-flash-preview default, gemini-2.5-pro for vision tasks like image/document analysis).

# Bazaar Hub Ultimate AI Engine

## 1. Edge Function: `ai-seller-assistant` (no JWT verify)

**Input:** `{ product_name?, image_base64?, category? }`
**Model:** `google/gemini-2.5-pro` (vision when image), temperature 0.7
**Tool calling** for strict JSON shape (title, description, tamil_description, keywords_en[5], keywords_ta[5], condition, category, suggested_price, price_range, reason, duplicate_flag, spam_flag).

Wired into: new "AI Auto-fill" button in `src/components/seller/AddProductGrid.tsx` step 1 (Category) and step 2 (Details). Click → calls function → pre-fills title, description, Tamil desc, keywords, suggested price.

## 2. Edge Function: `ai-doc-verify` (verify_jwt = true, admin only)

**Input:** `{ doc_type: "pan"|"gst", image_base64, expected_name }`
**Model:** `google/gemini-2.5-pro` (vision), temperature 0.2
**Tool calling** returns: `{ extracted_name, registration_number, confidence_score (0-100), risk_level (Low/Medium/High), tamper_notes }`.
Server-side check: caller must be admin (look up profile.is_admin via service role).

Wired into: new "AI Verify" button in `src/components/admin/SellersTab.tsx` and `ApprovalsTab.tsx` next to PAN/GST upload preview. Shows result card with confidence + risk badge.

## 3. Edge Function: `ai-buyer-chat` (no JWT, streaming SSE)

**Input:** `{ messages: [{role, content}], city, language }`
**Model:** `google/gemini-3-flash-preview`, temperature 0.8, streaming enabled
System prompt: friendly Madurai shopkeeper persona, multilingual (22 Indian languages), responds in user's detected language + bilingual when Tamil context. Suggests products, price ranges, local vs online.

Replaces keyword logic in `src/components/ChatbotWidget.tsx`:
- Drop FAQ array
- Add `react-markdown` rendering
- Stream tokens via fetch + SSE parser
- Keep welcome message + WhatsApp/Search action chips (rendered when AI returns `[ACTION:search:query]` markers — parsed client-side)
- Show typing indicator while streaming
- Handle 429/402 with friendly toasts

## 4. Edge Function: `ai-trust-score` (no JWT)

**Input:** `{ seller_id }`
**Logic:** Fetch profile + listings counts → compute deterministic base score (profile completeness 40 + doc verified 30 + listing quality 30) → AI adds 1-line review prompt EN + TA (gemini-3-flash-preview, temp 0.5, tool calling).
**Output:** `{ seller_score, review_prompt_en, review_prompt_ta }`

Wired into: `SellerProfilePage.tsx` (display badge) and `seller/DashboardTab.tsx` (show score card with refresh button).

## 5. Caching & Rate Limits

New table `ai_seller_assistant_cache` (key: hash of product_name+image, 7-day TTL).
Reuse pattern from existing `ai_scores` table.
All functions catch 429 → return friendly "AI is busy, try again in a moment", 402 → "AI credits exhausted, contact admin".

## 6. UI Integration Summary

| File | Change |
|---|---|
| `src/components/seller/AddProductGrid.tsx` | Add "✨ AI Auto-fill from name/photo" button → calls ai-seller-assistant → pre-fills fields |
| `src/components/admin/SellersTab.tsx` | Add "🛡️ AI Verify Docs" action → modal with confidence + risk |
| `src/components/admin/ApprovalsTab.tsx` | Same AI Verify button on pending applications |
| `src/components/ChatbotWidget.tsx` | Replace keyword FAQ with streaming AI chat + markdown |
| `src/components/seller/DashboardTab.tsx` | Add AI Trust Score card |
| `src/pages/SellerProfilePage.tsx` | Show trust badge + AI review prompt |

## 7. Files

**Created:**
- `supabase/functions/ai-seller-assistant/index.ts`
- `supabase/functions/ai-doc-verify/index.ts`
- `supabase/functions/ai-buyer-chat/index.ts`
- `supabase/functions/ai-trust-score/index.ts`
- New migration: `ai_seller_assistant_cache` table (RLS: service role only)

**Modified:**
- `src/components/ChatbotWidget.tsx` (full rewrite — streaming AI)
- `src/components/seller/AddProductGrid.tsx` (AI Auto-fill button)
- `src/components/admin/SellersTab.tsx` + `ApprovalsTab.tsx` (AI Verify)
- `src/components/seller/DashboardTab.tsx` (Trust Score card)
- `src/pages/SellerProfilePage.tsx` (badge + review prompt)
- `package.json` — add `react-markdown`

## 8. Test Flow
1. Seller registration → Add Product → click "AI Auto-fill" → enter "iPhone 15 128GB" → fields auto-populate with title, EN/TA description, keywords, suggested price
2. Admin → Sellers tab → click AI Verify on a PAN upload → see extracted name, confidence 92, risk Low
3. Buyer → click chatbot → ask "best phone under 20000 in Madurai" → streamed Tamil+English response with product suggestions
4. Seller dashboard → see trust score 78/100 + bilingual review prompt
5. Test rate limit: spam chatbot → see friendly busy toast
