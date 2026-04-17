---
name: AI Engine
description: Bazaar Hub Ultimate AI — buyer chat (streaming), seller auto-fill, admin doc verify, trust score
type: feature
---
# Bazaar Hub AI Engine

Four edge functions powered by Lovable AI Gateway (no user API key needed).

## ai-buyer-chat (streaming SSE)
- Model: `google/gemini-3-flash-preview`, temperature default
- Friendly Madurai shopkeeper persona, multilingual (22 Indian languages)
- Returns markdown + optional `[ACTION:search:<q>]`, `[ACTION:sellers:<q>]`, `[ACTION:city-offers]` markers parsed client-side into chip buttons
- Wired into `src/components/ChatbotWidget.tsx` (streaming with react-markdown, typing dots, city-aware)

## ai-seller-assistant (tool calling)
- Model: `google/gemini-2.5-pro` (vision when image), else `gemini-3-flash-preview`
- Returns: title, EN + Tamil descriptions, 5 EN + 5 TA keywords, brand, condition, suggested_price, price_range, reason, duplicate/spam flags
- Wired into `src/components/seller/AddProductGrid.tsx` step 2 — "Auto-fill with AI" button pre-fills name, brand, price, condition; shows description preview, Tamil, price range, keyword chips

## ai-doc-verify (admin-gated, vision)
- Model: `google/gemini-2.5-pro`, low temperature
- Server-side admin check via profile.is_admin (service role)
- Returns: extracted_name, registration_number, name_match, confidence_score (0-100), risk_level (Low/Medium/High), tamper_notes
- Reusable `src/components/admin/AiDocVerifyDialog.tsx` (file upload, base64, max 5MB)
- Wired into SellersTab "AI Verify" action button + ApprovalsTab pending sellers row (replaces "View Details")

## ai-trust-score
- Deterministic base: profile completeness 40 + doc verification 30 + listing quality 30
- AI generates short bilingual review prompt (gemini-3-flash-preview, tool calling)
- `src/components/seller/TrustScoreCard.tsx` shows score + tier (Trusted/Established/Building) + breakdown + EN/TA review prompt
- Mounted in seller `DashboardTab.tsx`

## Error handling pattern (all functions)
- 429 → "Quick break! AI is busy — try again in a moment 🙏"
- 402 → "AI credits recharging — contact admin"
- Toast surfaced in client + friendly inline message in chat
