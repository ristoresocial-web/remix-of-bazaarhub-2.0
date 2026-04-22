

## Smart Comparison System — build on what already exists

You already have most of this built. Here's the honest mapping so we don't duplicate work:

| Your spec | Already exists | Needs build |
|---|---|---|
| Case A — Online + Offline split, savings pill, "Best Price" badge | ✅ `ComparisonEngine.tsx` (split view, savings pill, Lowest badge) | Just relabel + add "Available Online & Nearby Store" header |
| Case B — Only one source, suggest same brand + specs | ❌ | New |
| Case C — No same-brand match, suggest same-spec different brand with **% match** | ❌ | New |
| Case D — Filters (price/brand/availability) + sort (Low→High default) + "Best Deal" tag | ✅ `FilterPanel.tsx` + `SortBar.tsx` (default sort is `most_compared`) | Change default to `price_asc`, add **Availability** filter (Online/Offline/Both), add "Best Deal" badge to cheapest card |
| Split view UI, "You Save ₹X", store distance, CTAs | ✅ `ComparisonEngine` already does all of this | — |
| No WhatsApp API / No OTP | ✅ Already plain `wa.me` deeplink + no OTP gating on compare | — |

So the work is **~3 focused additions**, not a rewrite.

---

### Build plan

**1. New file: `src/lib/smartFallback.ts`**
Pure helper, no UI. Given a target product:
- `findSameBrandSameSpec(target, allProducts)` → products with same brand + ≥80% spec match (excluding self)
- `findDifferentBrandSameSpec(target, allProducts)` → other brands with ≥70% spec match, returns each with `matchPercent`
- `getAvailability(product)` → `"both" | "online" | "offline"` based on `prices[].isAffiliate` + `localAvailable`
- `specMatchPercent(a, b)` → compares `specs[]` keys/values, returns 0–100

Spec match is simple: count `[key, value]` pairs that match exactly (case-insensitive), divide by total keys in target.

**2. New component: `src/components/compare/SmartFallbackPanel.tsx`**
Renders **only** when target has just one source. Two stacked sections:

- **Section B** (if same-brand alternates exist):
  > 💡 *"Similar product with same brand & specs found. Compare now?"*
  > Horizontal scroll of up-to-4 cards: image, name, brand, lowest price, **Compare** button → routes to `/product/compare?product=<slug>`

- **Section C** (only if Section B is empty):
  > 🔄 *"Alternative brands with similar specifications"*
  > Same card style + a **green pill** showing `92% specs match`

Each card uses existing `Button` + `Badge` from shadcn. Pure client-side, no backend.

**3. Edits to existing files**

- **`src/components/compare/ComparisonEngine.tsx`**:
  - Add a small header strip above the split view: when both `onlineSellers.length>0` AND `cityPartners.length>0` → green badge **"✓ Available Online & Nearby Store — Best Price"**. When only one side → render `<SmartFallbackPanel target={product} />` underneath the existing single-side display.
  - Cheapest card already gets "Lowest in {city}" — rename badge text to **"🏆 Best Deal"** to match your spec.

- **`src/components/search/FilterPanel.tsx`**:
  - Add a new **Availability** radio group: `All` / `Online only` / `Offline only` / `Both sources`. Wire through props.

- **`src/pages/SearchPage.tsx`**:
  - Change default `sortBy` from `"most_compared"` to `"price_asc"` (your "default Low→High" rule).
  - Add `availability` state + filter: uses `getAvailability()` from smartFallback helper.
  - Add **"🏆 Best Deal"** badge to the cheapest card in current results (passed as prop to `ProductSearchCard`).

- **`src/components/search/ProductSearchCard.tsx`**:
  - Accept new `isBestDeal?: boolean` prop, render orange pill when true.

**4. Performance — spec cache**
In `smartFallback.ts`, memoize spec-match results in a `Map<string, number>` keyed by `${productId}-${targetId}`. Lifetime = page session. No localStorage needed — comparisons happen rarely enough.

---

### What does NOT change

- ❌ No WhatsApp API integration (kept as plain `wa.me` link, already correct)
- ❌ No OTP login required for compare/search (already public)
- ❌ Ratings & reviews UI — left disabled (data already in mock; we just don't surface a filter)
- ❌ "AI Best for You" tag — not built (future-ready, marked TODO in code comment)
- ❌ No DB changes, no edge functions, no new routes
- ❌ No changes to `ComparePage` mode tabs, no changes to homepage
- ❌ Existing memory rules respected: `notranslate` on prices/brands, positive tone, gated seller contacts stay gated

---

### Files touched (final list)

**New (2):**
- `src/lib/smartFallback.ts`
- `src/components/compare/SmartFallbackPanel.tsx`

**Edited (4):**
- `src/components/compare/ComparisonEngine.tsx` — header badge + fallback panel mount
- `src/components/search/FilterPanel.tsx` — availability filter
- `src/pages/SearchPage.tsx` — default sort + availability state + best-deal flag
- `src/components/search/ProductSearchCard.tsx` — best-deal badge prop

Lightweight, no new deps, no DB, no breaking changes to existing flows.

