

# Tech Cleanup & Architecture Plan

## Current State
The app already has solid routing (28 routes in App.tsx), contexts (AuthContext with Supabase, LanguageContext), wishlist/recent utilities in `src/lib/wishlist.ts`, and mock data spread across multiple files. The architecture is functional but needs consolidation and performance improvements.

## What to Do

### 1. Create AppContext for Global State (`src/contexts/AppContext.tsx`)
Unified context combining city selection, wishlist, recently viewed, and price alerts into one provider. Wraps existing AuthContext and LanguageContext. Persists wishlist and recently viewed to localStorage (migrating logic from `src/lib/wishlist.ts`). Keeps `wishlist.ts` exports working by delegating to context internally where possible.

### 2. Clean Up Routes in App.tsx
- Add missing route aliases: `/offers` pointing to CityOffersPage, `/alerts` pointing to PriceAlertsPage (prompt uses these shorter paths)
- Add `React.lazy()` + `Suspense` for heavy pages: AdminPage, SellerDashboardPage, ComparePage, SearchPage
- Hide Navbar/Footer on seller dashboard and admin routes (they have their own sidebars)

### 3. Remove Tamil from 404 Page
The NotFound page has "பக்கம் கிடைக்கவில்லை" — per project memory, no Tamil on homepage/main pages. Replace with just the English text.

### 4. Performance Improvements
- Wrap `ProductCard` with `React.memo()`
- Add `React.lazy()` imports for admin, seller dashboard, compare, and search pages
- Add a `LoadingFallback` component for Suspense boundaries
- Ensure all product images have `loading="lazy"` (already present in ProductCard)

### 5. Consolidate Mock Data
Create `src/data/mockLocalSellers.ts` with 20 local shops across 7 cities (Pune, Chennai, Coimbatore, Madurai, Trichy, Salem, Erode) and `src/data/mockCityOffers.ts` with 10 active offers — complementing existing mock data files. Keep existing `mockData.ts` as the primary product source.

### 6. Add Reusable StatusBadge and TrustBadge Components
Create `src/components/StatusBadge.tsx` (variants: live, pending, draft, review, getting-ready, paused) and `src/components/TrustBadge.tsx` (variants: new, established, trusted, under-review). Both seller and admin tabs currently duplicate badge styling — these components will be shared.

## Files to Create
- `src/contexts/AppContext.tsx` — unified global state (city, wishlist, recent, alerts)
- `src/components/StatusBadge.tsx` — reusable status badge
- `src/components/TrustBadge.tsx` — reusable trust badge
- `src/components/LoadingFallback.tsx` — Suspense loading skeleton

## Files to Modify
- `src/App.tsx` — lazy imports, Suspense, route aliases, hide nav on dashboard routes, wrap with AppProvider
- `src/pages/NotFound.tsx` — remove Tamil text
- `src/components/ProductCard.tsx` — wrap with React.memo()
- `src/components/admin/SellersTab.tsx` — use StatusBadge/TrustBadge
- `src/components/seller/ProductsTab.tsx` — use StatusBadge

## Design
- No visual changes to existing pages
- Loading fallback uses existing skeleton component styles
- Badge components match current color scheme (orange/green/blue/gray)

