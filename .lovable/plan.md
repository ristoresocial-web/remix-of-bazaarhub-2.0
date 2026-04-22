

## Minimal 5-button header + global chatbot (close-able), nothing else

You want a strict, minimal global chrome. Here's exactly what changes — no extras, no duplicates.

### Header — exactly 5 controls, in this order

`src/components/Navbar.tsx` — full rewrite to render only:

1. **Home** — text link → `/`
2. **City Expo** — text link → `/city-offers` (existing route renders city sellers + Food Festival)
3. **Log In** — text link → `/buyer/login`
4. **Location** — pill button showing current city, opens existing `CitySelector` modal (GPS + 4000 cities)
5. **Languages** — small dropdown with **English, Tamil, Hindi** only (uses existing `setLanguage` from `LanguageContext`; the 22-lang `LanguageSwitcher` component stays in the codebase but is no longer mounted in the header)

Layout:
- Sticky, light background (`bg-white`), thin bottom border, `h-14`
- Equal `gap-2 sm:gap-4` between buttons, centered container
- Mobile: same 5 buttons in one row with `overflow-x-auto` horizontal scroll, no hamburger menu, no slide-out drawer
- Active route gets orange underline + bold

Removed from header: BazaarLogo, search input, "Seller Login" CTA, AnnouncementTicker, mobile hamburger, mobile slide menu, the duplicate compact city button.

### Removed globally to honor "no duplicate buttons"

In `src/App.tsx`:
- **Remove** `<MobileBottomNav />` mount (it duplicates Home / Offers / Seller already in the header — spec forbids duplicates)
- **Remove** `<WhatsAppButton />` mount (spec: "No WhatsApp integration")
- Keep `<ChatbotWidget />` mount, but make it **lazy-loaded** to satisfy the "loads only when opened" rule — see next section

The component files (`MobileBottomNav.tsx`, `WhatsAppButton.tsx`) stay on disk; just unmounted to keep the change reversible.

### Chatbot — keep current widget, fix the 4 spec items

`src/components/ChatbotWidget.tsx` adjustments:

1. **Lazy load** — split into a tiny shell `<ChatbotLauncher />` (just the floating bot button, ~1KB) and a `React.lazy()`-imported `<ChatbotPanel />` that mounts only when opened. This keeps initial bundle small.
2. **Bottom-right position** — move from `bottom-20` to `bottom-4 right-4` (the `bottom-20` offset existed only to clear the now-removed `MobileBottomNav`).
3. **Close UX** — current X button stays. Add: click-outside on the backdrop closes the panel, and `Esc` key closes it. Closing returns to the floating icon.
4. **Window sizing** — already 380×520, max `calc(100vw-2rem)` — confirmed mobile-friendly, never full-screen.
5. **Animation** — add `animate-in fade-in slide-in-from-bottom-2 duration-200` for fast open/close.

Chatbot capabilities (already wired, no change needed):
- Streams via `ai-buyer-chat` edge function (BazaarBot persona)
- Action chips for `[ACTION:search:...]`, `[ACTION:sellers:...]`, `[ACTION:city-offers]` → matches your "search product / compare / find nearby stores" requirement
- Markdown rendering
- 429/402 friendly toasts

### Login page — strip OTP

`src/pages/BuyerLoginPage.tsx` — replace the OTP step with a plain email + password form (uses existing `supabase.auth.signInWithPassword`). Google OAuth button stays as a single optional shortcut. No OTP flow, no WhatsApp OTP.

If you'd rather keep OTP available behind a "Sign in with code" link, say so and I'll keep both paths. Default plan: kill OTP entirely per your spec.

### Files touched

| File | Change |
|---|---|
| `src/components/Navbar.tsx` | Full rewrite: 5 buttons only, sticky, mobile-scroll |
| `src/App.tsx` | Remove `<MobileBottomNav />` and `<WhatsAppButton />` mounts; lazy-load chatbot |
| `src/components/ChatbotWidget.tsx` | Reposition bottom-4, add Esc + outside-click close, open/close animation, split into launcher + lazy panel |
| `src/pages/BuyerLoginPage.tsx` | Replace OTP with email + password (keep Google) |

### Files NOT touched

- `CitySelector.tsx`, `LanguageContext.tsx`, `MobileBottomNav.tsx`, `WhatsAppButton.tsx`, `ai-buyer-chat` edge function, all routes, all data files
- `LanguageSwitcher.tsx` (still exists for any future page that needs the full 22-lang picker; just not in header)

### Verify after build

1. Every page shows the same sticky header with exactly 5 controls — no logo, no search, no seller CTA
2. No bottom mobile tab bar, no green WhatsApp bubble anywhere
3. Languages dropdown shows only English / Tamil / Hindi
4. Location button opens the city modal with GPS detect
5. Bottom-right floating bot icon → click opens chat → X / Esc / outside-click all close it → returns to icon
6. `/buyer/login` accepts email + password, no OTP step
7. Initial page load no longer fetches the chat panel JS until the bot is opened (Network tab)

### One confirmation

The spec says **"Hindi (future ready)"**. I'll include Hindi as a working option in the dropdown today (it already works via the existing translation pipeline) — if you'd rather show Hindi as disabled / "Coming soon" instead, reply and I'll grey it out.

