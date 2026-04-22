

## Seed local + online sellers so the inline split view has data to render

You've handed me a 4-seller dataset (2 online, 2 offline with distances). To make this show up under the comparison fallback panel for the 5 mobiles seeded last turn, I'll wire these as the default seller pool for those products.

### What I'll add

**1 file edit**: `src/data/mockData.ts`

For each of the 5 mobiles seeded last turn (ids 15–19), replace/extend the `prices[]` array so it contains exactly these 4 sellers (where applicable per the stock distribution agreed earlier):

- **Amazon** — `isAffiliate: true`, online
- **Flipkart** — `isAffiliate: true`, online
- **Kumar Mobiles** — `isAffiliate: false`, local, `distance: 1.2`, address in current city
- **Selvam Stores** — `isAffiliate: false`, local, `distance: 2.5`, address in current city

Prices stay sorted low→high by the existing `ComparisonEngine` logic. Each seller keeps the existing `Product.prices[]` schema (platform, price, isAffiliate, inStock, url, shopName, distance).

### Stock distribution per product (preserves the 4 fallback cases)

| Product | Amazon | Flipkart | Kumar Mobiles | Selvam Stores |
|---|---|---|---|---|
| Samsung M34 5G | ✓ | ✓ | ✓ | ✓ |
| Samsung M34 Variant | ✓ | ✓ | — | — |
| Redmi Note 12 | — | — | ✓ | ✓ |
| Realme Narzo 60 | ✓ | ✓ | ✓ | ✓ |
| iPhone 14 | ✓ | ✓ | — | — |

### Files NOT touched

- `ComparisonEngine.tsx`, `InlineComparePanel.tsx`, `SellerPriceTable.tsx`, `SearchPage.tsx` — already render `prices[]` correctly with distance, online/offline split, and "Best Deal" badge.
- `platformsData.ts` — Amazon and Flipkart are already registered there.
- No DB, no edge functions, no new components.

### Verify after build

1. Open `/search`, type "Samsung M34 5G", click **Compare prices ▾**
2. See split view: left column = Amazon + Flipkart (sorted low→high), right column = Kumar Mobiles (1.2km) + Selvam Stores (2.5km)
3. Lowest price across both sides shows the **Best Deal** badge

### Note on "Kumar Mobiles" & "Selvam Stores"

These will be hardcoded local-shop entries inside `mockData.ts` (no admin UI, no DB row). The current local-seller pipeline (`getCityPartnersForProduct` in `sellerData.ts`) generates random sellers per city — that stays untouched for other products. Only the 5 seeded mobiles get this fixed 4-seller pool so the demo is deterministic.

