

# Add Extra Features from HTML Design

## Features to Add

Based on the uploaded `01_buyer_homepage.html`, the current Lovable app is missing these sections:

### 1. Stats Bar (below hero)
Animated counter strip showing: "12,400+ Local Shops", "8.2L+ Products Listed", "420+ Cities Covered", "180 Cr+ Savings Generated". Uses a count-up animation on scroll.

### 2. Today's Best Deals carousel
Horizontal scrollable deal cards for the selected city. Each card shows product name, price, savings vs online, and shop name. Gradient purple-to-cyan background strip.

### 3. Popular Products Grid with Sort Bar
Product cards showing local vs online price comparison inline, wishlist heart button, "Save X vs Flipkart" tags, and Call/WhatsApp action buttons. Sort bar with Price/Rating/Nearest filters.

### 4. Map Banner CTA
"Find Shops Near You on Map" banner with icon, description, and button linking to `/find-sellers`.

### 5. Navbar Search Bar (desktop)
Inline search input in the desktop navbar between the city selector and action buttons — matching the HTML layout: `[Logo] [City] [Search bar] [Seller Login]`.

### 6. Compare Bar (floating)
Fixed bottom bar that appears when user selects products to compare, with a "Compare Now" button. Hidden by default, shows when items are added.

---

## Technical Plan

### Files to create:
- `src/components/StatsBar.tsx` — Animated counter strip with IntersectionObserver
- `src/components/TodaysBestDeals.tsx` — Horizontal scroll deal cards with mock data
- `src/components/PopularProductsGrid.tsx` — Product cards grid with sort/filter, wishlist, price comparison, Call/WhatsApp buttons
- `src/components/MapBanner.tsx` — CTA banner linking to find-sellers
- `src/components/CompareBar.tsx` — Fixed bottom compare tray (context-driven, hidden until items selected)

### Files to modify:
- `src/pages/Index.tsx` — Add StatsBar after hero, TodaysBestDeals before trending, PopularProductsGrid after city offers, MapBanner before categories
- `src/components/Navbar.tsx` — Add search input between city selector and action buttons on desktop

### Data:
All sections use mock data initially (no new database tables needed).

### Design tokens:
Uses existing brand colors (primary orange, navy). Savings badges use green (`#22C55E`). Cards follow existing `rounded-2xl bg-card shadow-card` pattern.

