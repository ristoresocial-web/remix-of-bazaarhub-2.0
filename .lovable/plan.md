

## Seed mock catalog with these 5 mobiles to make fallback comparisons demonstrable

You've handed me a 5-product dataset. The right move is to **add these to the mock catalog** so the inline comparison fallback (same-brand & different-brand-same-specs) actually has data to surface on `/search`.

### Why this is needed

Right now `src/data/mockData.ts` doesn't contain Samsung M34, Redmi Note 12, Realme Narzo 60, or iPhone 14 in a way that lets the spec-matcher demonstrate Cases 3 & 4. Adding them means:

- Search "Samsung M34" → shows 2 same-brand same-spec variants (Case 3 trigger)
- Search any of them with online-only or local-only stock → fallback panel finds the other 3 as different-brand same-specs (Case 4 trigger)
- All 4 share `6GB RAM / 128GB storage` → guaranteed ≥80% spec match in `smartFallback.ts`

### What I'll add

**1 file edit**: `src/data/mockData.ts`

Append 5 new `Product` entries matching the existing schema (id, slug, name, brand, category, image, specs as `[key,value][]`, prices array with mix of online affiliate + local seller, localShop, localAvailable, etc.). I'll mirror the structure of existing mobile entries already in the file.

To showcase all 4 fallback cases, stock distribution will be:
- **id 1 — Samsung M34 5G**: both online + local (Case 1: split view)
- **id 2 — Samsung M34 5G Variant**: online only (Case 2 → triggers same-brand fallback to id 1)
- **id 3 — Redmi Note 12**: local only (Case 2 → no same-brand → Case 3 different-brand fallback to Realme/Samsung)
- **id 4 — Realme Narzo 60**: both
- **id 5 — iPhone 14**: online only, no spec siblings beyond RAM/storage (Case 4 demo: only own sellers shown)

Specs encoded as the existing tuple format:
```ts
specs: [["RAM","6GB"],["Storage","128GB"],["Battery","6000mAh"]]
```

### Files NOT touched

- `InlineComparePanel.tsx`, `ComparisonEngine.tsx`, `SmartFallbackPanel.tsx`, `smartFallback.ts`, `SearchPage.tsx`, `ProductSearchCard.tsx` — already wired correctly. The data drives them.
- No DB, no edge functions, no new routes.

### Verify after build

1. Open `/search`
2. Type "Samsung M34" → see 2 cards → expand variant → fallback shows the other Samsung M34
3. Type "iPhone 14" → expand → fallback shows Redmi/Realme/Samsung as "Alternative Brand" with % match

### Confirm before I code

If you instead want these 5 products to **replace** existing mock mobiles (not append), or to live in a new file, say so. Otherwise I'll append to `mockData.ts` as described.

