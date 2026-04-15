

# Comparison Engine Rebuild — Online vs Local Split-Screen

## What Changes

The current `/compare` page is a spec-comparison tool (model A vs model B). The prompt asks for a fundamentally different feature: a **price comparison engine** that shows the SAME product across online sellers vs local sellers in a split-screen layout.

Both features are valuable — the existing spec comparison stays, and we add the new price comparison engine alongside it.

## Plan

### 1. Create mock data file `src/data/comparisonMockData.ts`
- Define `ComparisonProduct`, `OnlineSeller`, `LocalSeller`, `ComparisonResult` interfaces per the prompt
- 5 products with 3 online sellers + 3-4 local sellers each (Pune city data)
- Samsung Galaxy S24 Ultra, iPhone 15 Pro Max, Samsung 43" Crystal 4K TV, HP Pavilion Laptop 15, LG OLED C3 55" TV
- Price difference calculations built in

### 2. Create `src/components/compare/ComparisonEngine.tsx`
- Split-screen layout: Online Sellers (left) | Local Sellers (right)
- Desktop: side-by-side columns. Mobile: stacked vertically
- Price Difference Banner between columns showing "X cheaper locally" or "X cheaper online" — no bias language
- Lowest price badge on each side, absolute winner gets "Lowest Price in {City}"
- Sort options: Price, Distance (local only), Rating
- Filter: Platform selector (online), Distance radius (local)
- WhatsApp / Call / Directions buttons on local seller cards (gated to logged-in buyers per memory rules)

### 3. Create `src/components/PriceTeaser.tsx`
- Inline 1-line component for product cards: `₹X local | ₹Y online → ₹Z cheaper locally/online`
- Used inside `ProductCard.tsx` when local price data is available

### 4. Update `src/pages/ComparePage.tsx`
- Add a third mode toggle: "Model vs Model" | "Config Search" | **"Price Compare"**
- Price Compare mode shows a product search bar, loads `ComparisonEngine` for the selected product
- Support URL param `?product=samsung-galaxy-s24` to pre-load a product
- Keep existing spec comparison fully intact

### 5. Update `src/components/ProductCard.tsx`
- Add `PriceTeaser` below the price line showing local vs online comparison

## Files to create
- `src/data/comparisonMockData.ts` — interfaces + mock data for 5 products
- `src/components/compare/ComparisonEngine.tsx` — split-screen price comparison
- `src/components/PriceTeaser.tsx` — inline price teaser for cards

## Files to modify
- `src/pages/ComparePage.tsx` — add "Price Compare" mode tab + URL param support
- `src/components/ProductCard.tsx` — add PriceTeaser inline

## Design
- Uses existing brand tokens (orange primary, green for best price, navy accents)
- Cards follow `rounded-card border-border bg-card shadow-card` pattern
- No bias language — purely price-based ("₹X cheaper", "Lowest Price in Pune")
- Seller contact buttons gated behind auth per existing rules

