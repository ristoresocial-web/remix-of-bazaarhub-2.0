

## Comparison UI is already built — proposing only the deltas you actually asked for

Re-checked `ComparisonEngine.tsx`, `SmartFallbackPanel.tsx`, `FilterPanel.tsx`, `SearchPage.tsx`, `ProductSearchCard.tsx`. 7 of your 8 sections are live. Here's the honest gap-only plan.

### What's already done — no changes

| Your section | Where | Notes |
|---|---|---|
| 1. Product header (image, name, specs, best deal) | `ComparisonEngine` header card | Live |
| 2. Split online/offline + Best Deal badge + savings pill | `ComparisonEngine` | Live, mobile stacks vertically already |
| 3. Conditional fallback when one source missing | `ComparisonEngine` → `SmartFallbackPanel` | Live |
| 4. Same-brand-same-specs → different-brand-same-specs with % match + Compare CTA | `SmartFallbackPanel` | Live |
| 5. Filters (price, brand, availability) + default Low→High sort | `FilterPanel` + `SearchPage` | Live |
| 7. Distance for offline, clean cards, mobile responsive | `CityPartnerCard` shows km | Live |
| 8. Spec cache | `smartFallback.ts` `matchCache` Map | Live |

No OTP, no WhatsApp API — already compliant.

---

### Gaps to close (the only real work)

**Gap 1 — "Best price highlighted in green" (your §7)**
Today the cheapest card uses **orange** (Best Deal badge + orange ring). Your spec says **green**. Two clean options:

- **1a (recommended):** Keep orange "🏆 Best Deal" badge (brand-consistent, already eye-catching) and add a small **green "Lowest Price"** sub-pill under the price number on the cheapest card. Best of both: brand identity + your green-cue rule.
- **1b:** Swap the entire winner ring + badge to green. Loses brand orange accent but matches your spec literally.

**Gap 2 — Explicit action buttons (your §6)**
- Online cards today have a "Visit" affiliate link. I'll **rename to "Buy Now"** and restyle as a filled orange button (clearer CTA, same affiliate attrs).
- Offline cards have Call / WhatsApp / Directions. I'll **add a primary "View Nearby Store"** button at the top of the action row that opens Google Maps directions (same target as Directions, just promoted to primary CTA per your spec).

**Gap 3 — Lazy load sellers (your §8)**
Today all online + offline cards render at once. For products with many sellers this is wasted paint on mobile.
- Render the **first 3 cards per side** immediately.
- Show a **"Show all N sellers"** button to reveal the rest. Pure client-side, no network.

**Gap 4 — Mobile polish at 760px viewport (current view)**
Quick audit at your current 760×455 viewport:
- The savings pill currently sits between the two columns on `md:` and above; at narrow widths it becomes a horizontal strip — already fine.
- Sort `<select>` and headers can wrap awkwardly under 380px; I'll tighten the header row with `flex-wrap` and smaller text on `xs`.

---

### Files touched (all edits, no new files)

1. **`src/components/compare/ComparisonEngine.tsx`**
   - Add green "Lowest Price" sub-pill on absolute-lowest card (Gap 1a)
   - Rename online "Visit" → "Buy Now" filled button (Gap 2)
   - Add primary "View Nearby Store" button on offline cards (Gap 2)
   - Add `showAllOnline` / `showAllLocal` state + "Show all N" toggle (Gap 3)
   - Tighten header row responsiveness (Gap 4)

That's it. **One file edit.** No new components, no DB, no edge functions, no route changes.

### What stays disabled / out of scope (per your rules)
- No OTP anywhere
- No WhatsApp API — keep existing `wa.me` deeplink as-is on offline cards
- No ratings/reviews UI changes
- No "AI Best for You" tag
- No homepage changes

---

### Decision needed before I code

Pick **1a** (orange Best Deal badge + green Lowest Price sub-pill — recommended) or **1b** (swap winner styling fully to green). I'll proceed with **1a** by default if you just say "go".

