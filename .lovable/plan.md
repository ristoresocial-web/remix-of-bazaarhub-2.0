

## Add buyer/seller chooser before login form

The "Log In" link in the header currently goes straight to `/buyer/login`. You want a step in between that asks the user to pick **Buyer** or **Seller** first, then routes to the right login.

### What changes

**1. Header link target** — `src/components/Navbar.tsx`
- Change the "Log In" link from `/buyer/login` → `/login`

**2. New chooser page** — `src/pages/LoginChooserPage.tsx` (new file, route `/login`)
- Centered card on the same gradient background as auth pages
- Title: "How would you like to log in?"
- Two large tap targets stacked (mobile) / side-by-side (desktop):
  - **🛒 I'm a Buyer** → navigates to `/buyer/login`
  - **🏪 I'm a Seller** → navigates to `/seller/login`
- Small "New here? Register" link below → `/auth?tab=register`
- Uses existing brand tokens (orange primary, navy text), `rounded-card`, hover scale, 200ms transition
- Active highlight on hover, icon from `lucide-react` (`ShoppingBag`, `Store`)

**3. Route registration** — `src/App.tsx`
- Add `<Route path="/login" element={<LoginChooserPage />} />` (lazy-loaded like other pages)

### Files NOT touched

- `BuyerLoginPage.tsx`, `SellerLoginPage.tsx`, `AuthPage.tsx` — unchanged, just reached via the chooser
- Existing `/buyer/login` and `/seller/login` routes stay valid (deep links keep working)
- No DB, no edge functions, no auth logic changes

### Verify after build

1. Click **Log In** in header → lands on `/login` showing two buttons
2. Click **I'm a Buyer** → goes to `/buyer/login` email/password form
3. Click **I'm a Seller** → goes to `/seller/login` (currently redirects to `/auth`)
4. Direct visit to `/buyer/login` or `/seller/login` still works (no forced redirect through chooser)

