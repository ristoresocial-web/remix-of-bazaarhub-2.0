

## Already shipped — here's where each rule lives

This exact spec was approved and built last turn. Verification map against the current code on `/search`:

| Your rule | Where it lives | Status |
|---|---|---|
| 1. Search online + city partner | `SearchPage.tsx` reads `product.prices[]` (affiliate = online, non-affiliate = local) | Live |
| 2. Both available → split view, low→high | `InlineComparePanel` → `ComparisonEngine` (left online / right city, default sort price) | Live |
| 3. Only one → sellers + "Compare?" suggestion | `ComparisonEngine` detects `isSingleSource` → mounts `SmartFallbackPanel` Section B with same-brand+same-specs prompt | Live |
| 4. Same brand missing → different brand same specs | `SmartFallbackPanel` Section C auto-renders when Section B is empty, labeled "Alternative Brand" with % match | Live |
| 5. No similar → only sellers low→high | Both fallback sections empty → only the available column renders, already sorted price asc | Live |
| No separate compare page | Panel mounts inline under the expanded card on `/search`; old `/product/compare` route still exists but isn't required | Live |
| Inline only | `expandedProductId` state in `SearchPage.tsx`, panel injected as full-width grid row | Live |
| Always show price | Every card (online, local, fallback) renders `₹{price}` in monospace | Live |
| Mobile-first | Split stacks vertically below `md:`, panel is full-width, "Compare prices ▾" button is 100% width on mobile | Live |

**No code changes proposed.** This is the fifth consecutive request for the same comparison spec; it's been built incrementally across the previous turns and is fully live.

---

### How to verify in 10 seconds

1. Go to `/search` (you're currently on `/product/compare` — the old standalone page)
2. Type any query, e.g. "phone"
3. Click **"Compare prices ▾"** at the bottom of any result card
4. The card expands inline with the split view + fallback suggestions

---

### If something's actually wrong, pick one and I'll fix that specifically

- **A.** "Compare prices ▾" button isn't visible on the cards → I'll audit `ProductSearchCard.tsx` rendering
- **B.** Expanded panel is empty / shows wrong data for a specific product → tell me the product name, I'll trace the `prices[]` mapping
- **C.** Fallback prompt ("Same brand available — Compare?") never appears even on single-source products → I'll lower the spec match thresholds in `smartFallback.ts`
- **D.** Want the inline panel to auto-open on first card instead of click-to-expand → trivial state default change
- **E.** Want to remove the standalone `/product/compare` route entirely now that inline works → 1-line route removal in `App.tsx`
- **F.** Something else — describe what you see vs what you expect

Reply with a letter or a concrete observation; otherwise nothing to build.

