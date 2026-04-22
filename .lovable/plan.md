

## Add BazaarHub logo to header (top) and footer (bottom) on every page

You want the "BazaarHub" wordmark visible at the top-left of the header and in the footer on all pages — matching the HTML you pasted (orange "Bazaar" + green "Hub").

### What changes

**1. `src/components/Navbar.tsx`** — add logo on the left
- Insert a `<Link to="/">` wrapping the wordmark as the **first child** inside the `<nav>`, before the "Home" link
- Markup: `<span class="text-bh-orange">Bazaar</span><span class="text-bh-green">Hub</span>`, font-display, extrabold, ~1.125rem so it fits the 56px header
- Add `shrink-0` so it never collapses on the horizontal-scroll mobile row
- The 5 nav buttons (Home, City Expo, Log In, Location, Languages) stay exactly as they are — order and behavior unchanged
- Logo click goes to `/` (acts as a 6th interactive element but it's a brand mark, not a nav button — matches your HTML reference)

**2. `src/components/Footer.tsx`** — already shows the wordmark in column 1; no change needed there. The footer renders on every non-dashboard page via `App.tsx`, so "bottom of every page" is already satisfied.

**3. Dashboard pages (`/seller/dashboard`, `/admin`)** — these intentionally hide the global Navbar/Footer (see `AnimatedRoutes` in `App.tsx`). The admin sidebar already shows the BazaarHub wordmark at its top. The seller dashboard sidebar — I'll verify it shows the wordmark and add it if missing, so the brand appears on those pages too.

### Files NOT touched

- `App.tsx` routing, `BazaarLogo.tsx` (existing component stays available but Navbar uses inline markup to match the exact HTML you pasted and keep bundle lean)
- All page components, all styling tokens, no DB, no edge functions

### Verify after build

1. Open `/` at 760px width → header shows **BazaarHub** wordmark on the left, then Home / City Expo / Log In / Location / Languages
2. Scroll to bottom → footer column 1 shows the same **BazaarHub** wordmark + tagline
3. Visit `/search`, `/city-offers`, `/product/...`, `/login`, `/about` → logo appears top and bottom on each
4. Visit `/seller/dashboard` and `/admin` → wordmark visible in the left sidebar (no global header/footer by design)
5. Mobile horizontal-scroll row in the navbar still works; logo stays pinned and doesn't shrink

