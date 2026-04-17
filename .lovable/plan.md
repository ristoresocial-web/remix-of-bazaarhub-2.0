
User echoed my previous plan back with one critical change: **"PAN/GST/MSME any one compulsory"** — so seller registration requires at least one of those three IDs, not all three. Everything else stays the same.

Let me lock the plan in tightly and present.

# Comprehensive Auth System for Bazaar Hub

## 1. Database Migration
Add to `profiles` table:
- `role text default 'buyer'` (buyer | seller | admin)
- `mobile_verified boolean default false`
- `business_owner_name text`
- `gst_number text` + unique partial index
- `pan_number text`
- `msme_number text`
- `business_address text`
- `pin_code text`
- `shop_category text`
- Unique partial index on `mobile`

Update `handle_new_user()` trigger to read all new fields from `raw_user_meta_data`.

## 2. Edge Functions (Message Central — secrets already set)
- **`send-otp`** — `POST { mobile }` → calls `https://cpaas.messagecentral.com/verification/v3/send` → returns `verificationId`
- **`verify-otp`** — `POST { mobile, verificationId, code, signupData }` → validates OTP → creates user via Admin API with full metadata → sets `mobile_verified=true` → admin bypass for `9943440384`

Both functions use stored secrets `MESSAGECENTRAL_CUSTOMER_ID` + `MESSAGECENTRAL_AUTH_TOKEN`.

## 3. New Files
- `src/pages/AuthPage.tsx` — unified `/auth` with Login | Register tabs (Register has Buyer | Seller sub-toggle)
- `src/components/auth/LoginForm.tsx` — email-or-mobile + password, show/hide eye icon, forgot link, "Login with OTP" disabled placeholder
- `src/components/auth/BuyerRegisterForm.tsx` — Name, Email, Mobile, Password, City + OTP step
- `src/components/auth/SellerRegisterForm.tsx` — Owner Name, Email, Mobile, Password, GST, PAN, MSME, Address, PIN, Shop Category + OTP step
- `src/components/auth/OtpVerifyStep.tsx` — 6-digit input + 30s resend timer
- `src/components/auth/PriceTagLogo.tsx` — clean price-tag SVG (orange #FF6B00, no trolley/arrow)
- `src/pages/ForgotPasswordPage.tsx` + `src/pages/ResetPasswordPage.tsx`
- `src/lib/authValidation.ts` — zod schemas

## 4. Files Modified
- `src/App.tsx` — new routes `/auth`, `/forgot-password`, `/reset-password`. Redirect `/login`, `/buyer/login`, `/seller/login`, `/seller/register` → `/auth`
- `src/contexts/AuthContext.tsx` — add `role` to context
- Old login/register pages → thin redirect wrappers

## 5. Validation (zod)
- Email: standard
- Mobile: `^[6-9]\d{9}$`
- Password: min 8, ≥1 letter + ≥1 digit
- PIN: `^\d{6}$`
- GST: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- PAN: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`
- MSME: `^UDYAM-[A-Z]{2}-\d{2}-\d{7}$`
- **Seller rule (NEW)**: at least ONE of GST / PAN / MSME must be filled and valid. Form-level superRefine error: "Please provide at least one of GST, PAN, or MSME."

## 6. UX Flow
- **Register Buyer**: form → Send OTP → real SMS → verify → auto-login → `/buyer/dashboard`
- **Register Seller**: form (GST/PAN/MSME any one required) → Send OTP → verify → auto-login → `/seller/dashboard`
- **Login**: email or mobile + password → on submit, mobile pattern queries profile for email → `signInWithPassword` → role-based redirect (admin → `/admin`)
- **Forgot Password**: email → `resetPasswordForEmail` redirect to `/reset-password` → set new password
- **Login with OTP**: button shown but disabled, tooltip "Coming soon"

## 7. Design
- Centered card on muted bg, price-tag SVG logo
- Shadcn Tabs for Login | Register; 2-button toggle for Buyer | Seller
- Show/hide password = Eye / EyeOff icon
- Mobile-first: `h-11` inputs, 16px font (no iOS zoom)
- Framer-motion fade between tabs
- Inline destructive-color validation errors

## 8. Test Flow
1. `/auth` → Register → Buyer → fill → real SMS → verify → buyer dashboard
2. Logout → Register → Seller → fill (only GST or only PAN or only MSME) → SMS → verify → seller dashboard
3. Logout → Login with mobile + password → role-based redirect
4. Login with email + password → same
5. Forgot password → email link → reset → login
6. Mobile `9943440384` → admin role → `/admin`
