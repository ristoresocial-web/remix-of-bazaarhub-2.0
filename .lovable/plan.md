

# Seller Registration & Login Upgrade

## Current State

- **Seller Registration** (`/seller/register`): 5-step form (Info, Location, Shop, WhatsApp, Review) with 457 lines. Has OTP, GST/PAN validation, photo uploads, category selection, promo codes. Currently uses a 4-digit OTP and has no success animation screen.
- **Buyer Login** (`/buyer/login`): Centered card with Email OTP (Supabase), WhatsApp OTP (mock), and Google OAuth. Has 6-digit OTP boxes. No `/login` route exists — only `/buyer/login`.
- No dedicated seller login page exists. No `/login` route in App.tsx.

## What to Build

### 1. Create Seller Login Page (`src/pages/SellerLoginPage.tsx`)
New page at `/login` — centered card (max-w-md):
- BazaarHub logo + "Your Town. Your Price." tagline
- Phone input with `+91` prefix
- [Send OTP] button → transitions to 6-box OTP input (reuse shadcn InputOTP)
- [Change number] link, countdown timer for resend
- After OTP verified → redirect to `/seller/dashboard`
- Footer links: "New seller? Register here" → `/seller/register`, "Buyer? Continue as Buyer" → `/buyer/login`
- Mock OTP verification (like existing WhatsApp OTP flow)

### 2. Simplify Seller Registration to 3 Steps (`src/pages/SellerRegisterPage.tsx`)
Condense current 5 steps into 3 per the prompt:

**Step 1 — Shop Details**: Shop Name, City dropdown, Phone with +91 (keep existing validation). Remove Owner Name, GST, PAN from step 1.

**Step 2 — Business Details**: GST Number (required, keep existing regex), Category checkboxes (Mobiles, TVs, Laptops, ACs, Refrigerators, Audio), "Approx products" radio pills (1-10, 11-50, 51-200, 200+). Remove photo uploads and location detection.

**Step 3 — Connect WhatsApp**: WhatsApp number with "Same as phone" checkbox, Language preference radio (English, Tamil, Hindi, Telugu, Kannada), Terms checkbox, [Register My Shop] button.

**Success Screen**: Animated checkmark, "Shop Registered!" message, review within 24 hours notice, [Go to Seller Dashboard] button. Replace the current review step.

### 3. Add Route in App.tsx
Add `/login` route pointing to new `SellerLoginPage`.

### 4. Update Progress Bar
Change from 5 steps (Info, Location, Shop, WhatsApp, Review) to 3 steps (Shop Details, Business Details, Connect WhatsApp).

## Files to Create
- `src/pages/SellerLoginPage.tsx` — phone + OTP login flow

## Files to Modify
- `src/pages/SellerRegisterPage.tsx` — condense to 3 steps + success screen
- `src/App.tsx` — add `/login` route

## Design
- Login card: `max-w-md rounded-2xl border bg-card shadow-card` (matches buyer login)
- OTP: use 6-box input like buyer login (upgrade from current 4-digit)
- Progress bar: 3 circles with connecting lines, orange fill for active/complete
- Success screen: green checkmark with scale animation, confetti-style feel
- Mobile-first: all inputs full-width, large touch targets

