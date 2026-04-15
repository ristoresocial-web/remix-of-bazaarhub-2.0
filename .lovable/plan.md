

# Search Results Page Upgrade

## Current State
The existing `SearchPage.tsx` (486 lines) has: search bar, filter chips (All/Local/Under30k/4Stars+), sort pills, product card grid, zero-results state with online platform links, and a compare bar. It's a single-column layout with no sidebar filters, no price range slider, no brand/category checkboxes, no grid/list toggle, and no pagination.

## What to Build

### 1. Add More Mock Products (`src/data/mockData.ts`)
Add 6-8 more Samsung products across categories (TVs, Laptops, Audio) to reach ~12 searchable items. This enables meaningful filtering by category and brand.

### 2. Create `src/components/search/FilterPanel.tsx`
Left sidebar (260px, collapsible on mobile via sheet/drawer):
- **Category** checkboxes with counts (Mobiles, Televisions, Laptops, Audio)
- **Brand** checkboxes with counts (Samsung, Apple, Sony, LG)
- **Price Range** dual-thumb slider (₹10,000–₹2,00,000) using shadcn Slider
- **City Partners Only** toggle switch
- **Sort By** radio group: Price Low→High, Price High→Low, Best Price Difference, Most Compared
- [Apply Filters] and [Reset] buttons
- On mobile: trigger via floating filter button, render in a Sheet

### 3. Create `src/components/search/ProductSearchCard.tsx`
Enhanced product card showing:
- Product image + name + brand + rating stars
- **LOCAL** price vs **ONLINE** price side by side
- "₹X cheaper locally/online" green badge
- [Compare] checkbox + [♥] wishlist heart button
- Compact affiliate disclaimer

### 4. Create `src/components/search/SortBar.tsx`
Horizontal bar above results:
- Grid/List view toggle icons (grid default)
- Sort dropdown matching filter panel sort
- Result count: "52 results found"

### 5. Rewrite `src/pages/SearchPage.tsx`
- **Title bar**: `Search Results for "{query}" in {city}` + result count + active filter chips with "Clear All" button
- **2-column layout**: FilterPanel (left, 260px) + results grid (right)
- **Filter logic**: URL params sync (`category`, `brand`, `minPrice`, `maxPrice`, `sort`, `localOnly`)
- **Grid/List toggle**: 3-col grid (desktop) / 1-col list view
- **Pagination**: 12 items per page, Previous/Next + page numbers using existing shadcn Pagination component
- **Empty state**: "No results for X in {city}" with suggestions
- **Compare bar**: Keep existing floating compare bar at bottom

### 6. Add Wishlist Integration
Import `toggleWishlist`, `isInWishlist` from `src/lib/wishlist.ts` (already created in Step 5). Wire heart button in ProductSearchCard.

## Files to Create
- `src/components/search/FilterPanel.tsx`
- `src/components/search/ProductSearchCard.tsx`
- `src/components/search/SortBar.tsx`

## Files to Modify
- `src/data/mockData.ts` — add 6-8 more products
- `src/pages/SearchPage.tsx` — full rewrite with 2-column layout, pagination, URL param sync

## Design
- Follows brand tokens: orange primary, green for savings badges
- Filter panel uses `bg-card border-border rounded-card` styling
- Mobile: filter panel in Sheet, results full-width, 1-col grid
- All affiliate links maintain `rel="nofollow sponsored noopener noreferrer"`
- "Local" labels use "City Partner" terminology per project memory

