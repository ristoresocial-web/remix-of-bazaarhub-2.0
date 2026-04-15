

# Rename "Local Sellers" → "{City} City Partner"

Replace all user-facing instances of "Local Sellers" / "local sellers" with "{City} City Partner(s)" across the comparison engine and related pages.

## Changes

### 1. `src/components/compare/ComparisonEngine.tsx`
- Line 143: `Local Sellers in {city}` → `{city} City Partners`
- Line 235 comment: update for clarity
- Badge text "Best Local" → "Best City Partner"

### 2. `src/pages/FindSellersPage.tsx`
- Line 244: `Local Sellers in {city}` → `{city} City Partners`
- Line 346: "No local sellers found" → "No city partners found"

### 3. `src/pages/SearchPage.tsx`
- Line 187: `local seller` count text → `city partner`
- Line 256: "No local sellers in {city}" → "No {city} City Partners"

### 4. `src/components/PriceTeaser.tsx`
- Any "local" label text → "city partner" or just keep price labels as-is (they show price values, not "local seller" text)

### 5. `src/data/comparisonMockData.ts`
- Rename the `LocalSeller` interface → `CityPartner`
- Update `localSellers` field → `cityPartners` in `ComparisonResult`
- Update `lowestLocalShop` → `lowestCityPartner`

### 6. Other pages (cosmetic text updates)
- `MapBanner.tsx` line 13: "local sellers" → "city partners"
- `BlogPage.tsx` post titles/excerpts mentioning "local sellers"
- `AboutPage.tsx`, `TermsPage.tsx` — update descriptive text

### Scope
- Interface/field renames cascade through `ComparisonEngine.tsx`, `ComparePage.tsx`, `PriceTeaser.tsx`
- No database changes needed — mock data only

