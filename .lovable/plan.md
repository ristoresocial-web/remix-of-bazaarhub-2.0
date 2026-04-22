

## Ship Option D hero copy

**Headline:** Compare Prices. Buy Smarter.
**Subheadline:** Every seller in your city and every major online store, in one view.

### What changes

**1 file edit** — `src/pages/Index.tsx` (hero section only)
- Replace `<h1>` text: `Find the Best Price in Your City` → `Compare Prices. Buy Smarter.`
  - Keep the orange accent span — apply it to **Buy Smarter.** so the visual rhythm stays intact
- Replace `<p>` subheadline: `Compare city partners vs Amazon, Flipkart — in real time.` → `Every seller in your city and every major online store, in one view.`
- Keep all motion props, gradient, search bar, popular searches, city pill — untouched

### Files NOT touched

- No routes, no components, no styling tokens, no DB, no edge functions
- Sections below the hero (Stats, BestComparison, Categories, etc.) stay as-is
- No translation keys to add (English-only homepage per existing rule)

### Verify after build

1. Open `/` → hero shows new headline with **Buy Smarter.** in orange
2. Subheadline reads the new neutral copy — no Amazon / Flipkart names
3. Layout unchanged at 760px and desktop widths

