

## Reorder homepage to match your sketch — keep all workflows intact

Your sketch and the current homepage have the **same building blocks**. They're just in a slightly different order, and one section needs a small addition. No new pages, no workflow changes, no breaking edits.

### Sketch vs current order

| # | Your sketch | Current code | Action |
|---|---|---|---|
| 1 | Logo + Home + City Expo + Login + Location + Language | `Navbar.tsx` | ✓ Already matches — keep |
| 2 | Big "Search Product" bar | Hero + `AISmartSearchBar` | ✓ Keep |
| 3 | 4 stat cards (12,000+ City Partners · 8.2L+ Products · 420+ Cities · ₹180Cr Savings) | `StatsBar` | ✓ Keep |
| 4 | **Today's Best Price Differences in Madurai (15 mins ago)** | `BestComparisonCards` | **Move up** (currently 4th, sketch wants it 4th — already correct, but currently it's *after* TopResearched) |
| 5 | **Top Researched Products** (most searched by our users) | `TopResearchedProducts` | **Move down** to slot 5 |
| 6 | "What are you looking for?" — **big search input + category buttons** | `CategoryGrid` (only has tiles, no search input) | **Add a search bar above the category tiles** |
| 7 | Featured Sellers in Madurai | `FeaturedSellers` | ✓ Keep |
| 8 | Footer | `Footer.tsx` | ✓ Keep |

### Concrete changes

**File 1 — `src/pages/Index.tsx`** (reorder only):
- Hero (unchanged)
- `StatsBar` (unchanged)
- `BestComparisonCards` ← moved up to position 4
- `TopResearchedProducts` ← moved down to position 5
- `CategoryGrid` (now with embedded search — see below) ← position 6
- Keep "How It Works" + "Featured Sellers" + "Price Alert banner" + "Become a Seller" below, in current order
- All `RevealSection` wrappers preserved → animations unchanged

**File 2 — `src/components/CategoryGrid.tsx`** (small addition):
- Heading already says "What are you looking for?" ✓
- Add a centered search input directly under the heading that submits to `/search?q=...&city=...` (same target as the hero search). One small form, ~15 lines. Reuses existing `bh-orange` button styling, no new dependencies.
- Category tiles below stay exactly as they are.

### What does NOT change
- Navbar, mobile nav, ticker, city selector, language switcher — untouched
- Hero `AISmartSearchBar` — untouched
- All AI features (suggestions, scores, verdicts) — untouched
- All routes, auth gates, WhatsApp/contact gating — untouched
- All animations and `framer-motion` reveals — preserved
- "How It Works", "Price Alert banner", "Become a Seller", `CityOffersFloatingButton` — kept where they are (sketch doesn't show them but they're harmless and link to existing pages)
- No DB / RLS / edge function changes
- Memory rules respected: cream theme, `notranslate` on prices, positive tone, gated contact

### Result
The first scroll on the homepage will read top-to-bottom exactly like your sketch: Navbar → Hero search → Stats → Today's Best Price Differences → Top Researched → "What are you looking for?" with search + categories → Featured Sellers → Footer. Everything underneath continues to work as today.

Approve this and I'll make the two file edits.

