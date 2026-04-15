

# Complete "Local Sellers" → "City Partners" Rename — Remaining Files

The previous rename covered comparison engine, search pages, price teaser, map banner, blog, and price winner components. These files still contain "local seller/shop" text that needs updating.

## Files to Update

### 1. `src/pages/ProductPage.tsx`
- Line 64: `localSellers` property key → `cityPartners`
- Line 156: `localSeller` variable → `cityPartner`, `localSellers[0]` → `cityPartners[0]`, `localShop` → `cityPartner`
- Line 313-316: Comment and heading "Other Local Sellers in {city}" → "Other {city} City Partners"
- Line 318: `tvProduct.localSellers` → `tvProduct.cityPartners`
- Line 363: Review text "Bought from local seller" → "Bought from city partner"
- Lines 446-500: All `localSeller.xxx` variable references → `cityPartner.xxx`

### 2. `src/pages/AboutPage.tsx`
- Line 24: meta description "local seller discovery" → "city partner discovery"
- Line 33: "Connecting buyers and local sellers" → "Connecting buyers and city partners"
- Line 43: "local seller discovery" → "city partner discovery"
- Line 47: "every local shop" → "every city partner shop"
- Line 72: "local shops and 10+ online platforms" → "city partners and 10+ online platforms"
- Line 73: "local sellers via WhatsApp" → "city partners via WhatsApp"

### 3. `src/pages/FAQPage.tsx`
- Line 10: "local city sellers" → "city partners"
- Line 12: "How do I find local sellers?" → "How do I find city partners?" + answer text
- Line 13: "Local seller prices" → "City partner prices"

### 4. `src/pages/TermsPage.tsx`
- Line 25: "local sellers and online platforms" → "city partners and online platforms"

### 5. `src/pages/Index.tsx`
- Line 319: "Connect with local sellers via WhatsApp" → "Connect with city partners via WhatsApp"

### 6. `src/pages/FindSellersPage.tsx`
- Line 127: "local shops & online platforms" → "city partners & online platforms"

### 7. `src/components/StatsBar.tsx`
- Line 4: "Local Shops" → "City Partners"

### 8. `src/components/FeaturedSellers.tsx`
- Line 109: "Trusted local shops with great deals" → "Trusted city partners with great deals"

### 9. `src/components/PopularProductsGrid.tsx`
- Lines 5-10: `localPrice` property name stays (internal), but any user-facing labels if present
- No user-facing "local" text in this component — prices display as numbers only. No changes needed.

### 10. `src/components/PriceHistoryChart.tsx`
- Line 50: Chart reference line label `Local ₹${...}` → `City Partner ₹${...}`

### 11. `src/components/AIScoreBadge.tsx`
- Lines 12-13: Props `localSellersCount` → `cityPartnersCount`, `lowestLocalPrice` stays (internal, sent to edge function)
- Line 52: Edge function body key `local_sellers_count` stays (API contract)
- No user-facing text changes needed — props are internal

### 12. `src/contexts/LanguageContext.tsx`
- Line 41: "local shops and online platforms" → "city partners and online platforms"

### 13. `src/data/tickerData.ts`
- Line 64: "local shops and online platforms" → "city partners and online platforms"

### 14. `src/data/sellerData.ts`
- Line 42: Function name `getLocalSellersForProduct` → `getCityPartnersForProduct` (+ update all call sites in FindSellersPage)

## Scope
- ~14 files with user-facing text updates
- Internal variable names (like `localPrice` in PopularProductsGrid) stay unchanged where they don't appear in UI
- Edge function API keys (`local_sellers_count`) stay unchanged to avoid breaking the deployed function
- No database changes needed

