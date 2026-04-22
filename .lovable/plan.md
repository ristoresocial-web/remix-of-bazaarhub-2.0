

## Align seeded mobile prices to your exact case dataset

You've handed me precise price points per (product, seller) pair across the 4 fallback cases. The 5 seeded mobiles already exist with the right seller pool — only the **prices** need to match your numbers exactly.

### What changes

**1 file edit**: `src/data/mockData.ts` — update the `prices[]` arrays for the 5 seeded mobiles (ids 15–19).

| Product | Amazon | Flipkart | Kumar Mobiles (1.2km) | Selvam Stores (2.5km) | Case |
|---|---|---|---|---|---|
| **id 15 — Samsung M34 5G** | ₹15,000 | ₹14,800 | ₹15,200 | ₹15,100 | Case 1: Both available → split view |
| **id 16 — Samsung M34 Variant** | ₹14,900 | ₹14,750 | — | — | Case 2: Online only → same-brand fallback to id 15 |
| **id 17 — Redmi Note 12** | — | — | ₹13,000 | ₹12,800 | Case 3: Offline only → diff-brand fallback |
| **id 18 — Realme Narzo 60** | (kept as-is, both sides) | (kept) | (kept) | (kept) | Demo extra, Case 1 |
| **id 19 — iPhone 14** | ₹70,000 | — | ₹70,500 | — | Case 4: Mixed, no spec siblings (battery 3279mAh differs) |

Note on Case 4: your dataset gives iPhone seller_id 1 (Amazon) + seller_id 3 (Kumar Mobiles offline). I'll honor that exactly — iPhone gets 1 online + 1 offline, no Flipkart, no Selvam.

Lowest-price markers per the existing `ComparisonEngine`:
- id 15 → Flipkart ₹14,800 (Best Online), Selvam ₹15,100 (Best Local)
- id 16 → Flipkart ₹14,750 (only Best Online; fallback panel mounts)
- id 17 → Selvam ₹12,800 (only Best Local; fallback panel mounts)
- id 19 → Amazon ₹70,000 (Best Online), Kumar ₹70,500 (Best Local)

### Files NOT touched

- `ComparisonEngine.tsx`, `InlineComparePanel.tsx`, `SmartFallbackPanel.tsx`, `smartFallback.ts`, `SearchPage.tsx`, `ProductSearchCard.tsx` — already wired.
- All other 14 mock products — untouched.
- No DB, no edge functions, no new components.

### Verify after build

1. `/search` → "Samsung M34 5G" → expand → split view with these exact 4 prices, Flipkart flagged Best Online, Selvam flagged Best Local
2. `/search` → "Samsung M34 Variant" → expand → 2 online sellers + same-brand fallback card pointing to id 15
3. `/search` → "Redmi Note 12" → expand → 2 local sellers + different-brand fallback to Samsung/Realme
4. `/search` → "iPhone 14" → expand → Amazon ₹70k + Kumar ₹70.5k, no fallback siblings (specs don't match)

