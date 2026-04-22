

## Inline search → expand-to-compare (no separate page)

You're right that the current `/search` page only shows a grid of cards — to actually compare, the user has to leave the page and go to `/product/compare`. Your spec says **comparison must happen inline on the same page**. That's the only real delta; the comparison logic itself is already built and reusable.

### What I'll build

**Each product card on `/search` becomes expandable.** Click a card → it expands inline (accordion style) and renders the full split online/offline view + fallback suggestions, **right there in the results list**. No navigation, no new page.

```text
[Product Card A]
[Product Card B]   ← click
  ┌─────────────────────────────────────────┐
  │ ✓ Available Online & Nearby Store       │
  │ ┌─────────────┬──────────────┐          │
  │ │ Online      │ City Partner │          │
  │ │ • Amazon ₹X │ • Shop1 ₹Y   │          │
  │ │ • Flipkart  │ • Shop2 ₹Z   │  Save ₹  │
  │ └─────────────┴──────────────┘          │
  │ [If single source] → "Same brand        │
  │  available — Compare?" button           │
  │  ↓ click → renders alternatives inline  │
  └─────────────────────────────────────────┘
[Product Card C]
```

### Files touched

**1 new file**
- `src/components/search/InlineComparePanel.tsx` — wraps `ComparisonEngine` + `SmartFallbackPanel`. Builds a `ComparisonResult` on the fly from the product's existing `prices[]` (online = `isAffiliate`, offline = local). Lazy mounted only when expanded.

**3 edits**
- `src/components/search/ProductSearchCard.tsx`
  - Add `expanded` + `onToggleExpand` props
  - Add a "Compare prices ▾" / "Hide ▴" button at card bottom
  - Default sort already low→high; no change
- `src/pages/SearchPage.tsx`
  - Track `expandedProductId` in state (one open at a time)
  - Render `<InlineComparePanel>` directly under the expanded card (full-width, spans grid row)
  - Pass `expanded` flag to each card
- `src/lib/smartFallback.ts`
  - Already cached. No change. (Spec cache requirement = met.)

### How the 4 cases map (using your existing data)

| Case | Detection | UI shown inline |
|---|---|---|
| 1. Both | `prices` has both affiliate + local in stock | Split view + green banner + Best Deal badge |
| 2. Online only | only affiliate prices | Online column + "Same brand available — Compare?" button → reveals same-brand fallback |
| 3. Different brand | same-brand fallback empty | Auto-falls through to different-brand panel with "Alternative Brand" label + % match |
| 4. None | both fallbacks empty | Shows only the available sellers, sorted low→high |

All four are handled by the existing `ComparisonEngine` + `SmartFallbackPanel` — I'm just mounting them inline on the search page instead of forcing a route change.

### CTAs (already present in ComparisonEngine, no rework)
- Online card → **Buy Now** (orange, opens affiliate link)
- Offline card → **View Nearby Store** (green, opens Google Maps)

### Performance
- Inline panel is **mounted only when expanded** (lazy by default — React doesn't render it until state flips)
- Spec match cache (`matchCache` Map in `smartFallback.ts`) already memoizes per session
- Only one product expanded at a time → no runaway DOM growth
- Existing `ITEMS_PER_PAGE = 12` pagination stays

### Stays out (per your restrictions)
- No OTP anywhere
- No WhatsApp API additions (existing wa.me deeplinks unchanged)
- No new compare route — `/product/compare` still exists for users who land on it directly, but `/search` no longer needs it
- No backend, no edge functions

### Mobile (current 760px viewport and below)
- Expanded panel renders full-width below the card
- Split view already stacks vertically under `md:` — no new responsive work
- "Compare prices" button is 100% width on mobile, inline on desktop

