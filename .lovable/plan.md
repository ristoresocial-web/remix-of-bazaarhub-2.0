

# Seller Profile Page Upgrade

## Current State
The page exists at `/seller/:id` with a basic hero card (name, location, trust badge, action buttons) and a flat product list with search. Missing: stats bar, product grid, reviews section, location card, category filter/sort, and guest mode logic.

## What to Build

### 1. Expand Mock Data
Add `since: 2015`, full reviews array (3 reviews with buyer name, rating, comment, product, date), and `onlineBestPrice` per product.

### 2. Stats Bar
4-stat row below the header: Products count, Rating, Reviews, "Since 2015". Light gray background, centered text.

### 3. Product Grid with Filter/Sort
- Replace flat list with responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
- Add category dropdown filter (All, Smartphones, TVs, etc.)
- Add sort dropdown (Price Low to High, Price High to Low, Name)
- Each card: product image, name, price, "Best in City" badge if applicable, Compare button

### 4. Reviews Section
- Left: rating summary with star breakdown bars (5-star to 1-star percentages)
- Right: 3 review cards with avatar initial, name, stars, comment, product purchased, date
- "Load More" button at bottom

### 5. Location Card
- Gray map placeholder box
- Full address text
- "Open in Google Maps" external link button

### 6. Guest Mode Logic
- Use `useAuth()` to check if buyer is logged in
- If not logged in: blur/hide phone, WhatsApp, and directions buttons with "Login to contact" overlay
- Product prices always visible

## Files to Modify
- `src/pages/SellerProfilePage.tsx` — full rewrite with all 6 sections above

## Design
- Orange gradient banner stays
- Stats bar: `bg-muted` with 4 centered columns
- Product cards: `rounded-card border shadow-card` matching ProductCard style
- Review stars: yellow-400 fill
- Location card: gray placeholder with MapPin icon
- Guest mode: semi-transparent overlay with lock icon + login link on contact buttons

