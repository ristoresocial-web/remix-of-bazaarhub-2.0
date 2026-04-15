

# Product Detail Page Upgrade

## Current State
The existing `ProductPage.tsx` (535 lines) already has: breadcrumb, image gallery, variants, price comparison table, price history chart, city partner card, reviews, similar products, and specs (TV product only). It uses both `mockProducts` and a hardcoded `tvProduct` object with conditional rendering.

## What Needs to Change

### 1. Add Wishlist & Recently Viewed (localStorage)
- Add `addToWishlist` and `addToRecentlyViewed` helpers in a new `src/lib/wishlist.ts`
- Add heart icon button below image gallery (toggles filled/outline)
- Call `addToRecentlyViewed` on page mount

### 2. Redesign Product Hero Right Column
- Show "Best Price in {city}: ₹X at {seller}" prominently
- Add Online Best vs City Partner Best summary with difference badge ("₹X cheaper via city partner/online")
- Add [Compare All Prices] and [Set Price Alert] buttons inline

### 3. Upgrade Seller Price Table to Split Layout
- Create `src/components/SellerPriceTable.tsx` — replaces current `PriceComparisonTable` usage on product page
- Two sections: "Online Sellers" table (Platform, Price, Delivery, Rating, Buy button) and "{City} City Partners" table (Shop, Price, Distance, Status, WhatsApp/Call)
- "Prices last updated: X hours ago · Report incorrect price" footer
- City partner contact buttons still gated behind auth

### 4. Make Specs Work for All Products
- Add specs data to `mockProducts` in `mockData.ts` (at least for Samsung Galaxy S24 Ultra)
- Remove `isTVProduct` conditional for specs rendering — show specs for any product that has them

### 5. Restructure Layout
- Move specs table and seller price table into the left column below the hero
- Keep right column sticky with: best price summary, price alert button, top city partner card, description
- Similar Products section at bottom with "You may also compare:" title

## Files to Create
- `src/lib/wishlist.ts` — localStorage wishlist + recently viewed helpers
- `src/components/SellerPriceTable.tsx` — split online/city partner table

## Files to Modify
- `src/pages/ProductPage.tsx` — restructure layout, add wishlist button, use new SellerPriceTable, make specs universal
- `src/data/mockData.ts` — add specs and gallery images to existing mock products

## Design
- Follows existing brand tokens (orange primary, green for best price)
- Cards use `rounded-card border-border bg-card shadow-card`
- City partner contact gated behind auth per existing rules
- All affiliate links keep `rel="nofollow sponsored noopener noreferrer"`

