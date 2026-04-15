

# Homepage Upgrade Plan

## What's Changing

The current homepage has a dark navy hero, 21 category cards, and several sections that feel cluttered. The prompt requests a cleaner, more focused layout with a light hero, condensed 6-category grid, "Today's Best Price Differences" comparison cards, and a Become a Seller CTA section.

## Approach

Keep existing components that already work well (Navbar, Footer, AISmartSearchBar, FeaturedSellers, StatsBar). Restructure `Index.tsx` to match the prompt's section order and visual style. Create new focused components where needed.

## Plan

### 1. Redesign Hero Section in `Index.tsx`
- Change background from dark navy gradient to light `white → #FFF7ED` gradient
- Update headline to "Find the Best Price in Your City"
- Update subtitle to "Compare city partners vs Amazon, Flipkart — in real time."
- Keep existing `AISmartSearchBar` but make it larger/more prominent
- Add "Popular searches" links below search bar (Samsung Galaxy S24, LG AC, HP Laptop)
- Add city context line: "Showing prices in {city} · Change city"
- Remove trust badges row (replaced by popular searches)

### 2. Create `src/components/CategoryGrid.tsx`
- 6 focused categories: Mobiles, Televisions, Laptops, Air Conditioners, Refrigerators, Audio
- 3x2 grid (desktop), 2x3 (mobile)
- Icon + label cards with orange border hover + lift animation
- Title: "What are you looking for?"
- Reuse existing category images from assets

### 3. Create `src/components/BestComparisonCards.tsx`
- Title: "Today's Best Price Differences in {city}"
- Subtitle: "Updated 15 mins ago"
- 3 product cards from comparison mock data showing: product name, city partner price vs online price, "₹X cheaper [via city partner/online]" badge, [Compare Now] button linking to `/product/compare?product=slug`
- Horizontal scroll on mobile

### 4. Create `src/components/BecomeSeller.tsx`
- Split card (50/50 on desktop, stacked on mobile)
- Left side: "Sell More with BazaarHub" + 3-4 benefit bullets
- Right side: [Get Started] button linking to `/become-seller`

### 5. Restructure `Index.tsx` section order
Remove/reorganize to match prompt:
1. Hero (redesigned — light bg)
2. StatsBar (keep)
3. CategoryGrid (new — 6 cards)
4. BestComparisonCards (new — replaces TodaysBestDeals)
5. How It Works (keep, update subtitles to use "city partners" language)
6. FeaturedSellers (keep — "Trusted City Partners in {city}")
7. Price Alert Banner (keep, restyle to full-width orange)
8. BecomeSeller (new)
9. CityOffersFloatingButton (keep)

**Remove from homepage**: TrendingSection, CityHeroBanner, CityOffersBanner, PopularProductsGrid, MapBanner, Live Price Comparison sample, City Coverage Strip, WhatsApp Banner, Why Bazaar Hub section, 21-category grid. These sections still exist as components but are no longer rendered on the homepage.

### 6. Update Footer copyright line
- Change to: "© 2025 BazaarHub. Your Town. Your Price."

## Files to create
- `src/components/CategoryGrid.tsx`
- `src/components/BestComparisonCards.tsx`
- `src/components/BecomeSeller.tsx`

## Files to modify
- `src/pages/Index.tsx` — full restructure
- `src/components/Footer.tsx` — copyright line update

