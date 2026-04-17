
User clarification: OTP only at **registration** (one-time phone verification). For **login**, just use email/mobile + password — no OTP. This simplifies things significantly and changes the auth model.

Current state:
- `SellerLoginPage.tsx` — uses mock OTP login (needs replacement)
- `BuyerLoginPage.tsx` — has Email/Google/WhatsApp OTP tabs
- `SellerRegisterPage.tsx` — exists (need to check current flow)
- Supabase profile table exists with email, mobile fields
- Message Central credentials provided (CUSTOMER_ID + AUTH_TOKEN, valid until 2031)

Revised approach:
- **Registration**: collect name + email + mobile + password → send OTP to mobile via Message Central → verify OTP → create Supabase user with email+password → mark phone as verified
- **Login**: simple email-or-mobile + password → standard `supabase.auth.signInWithPassword()`. If user enters mobile, look up email by mobile from profiles, then sign in with that email.

# Revised Auth Plan — OTP only at Registration

## Auth Model
- **Sign up**: Name + Email + Mobile + Password → OTP sent to mobile → verify → account created
- **Login**: Email OR Mobile + Password (no OTP)
- Mobile number stored in `profiles.mobile` and marked verified

## Secrets Needed
- `MESSAGECENTRAL_CUSTOMER_ID`
- `MESSAGECENTRAL_AUTH_TOKEN`

(I'll request these once via the secret prompt.)

## Database
Add to `profiles` table:
- `mobile_verified boolean default false`
- Unique index on `mobile` (so login-by-mobile works and prevents duplicates)

## Edge Functions (2)

### `send-registration-otp`
- Input: `{ phone }` (10 digits)
- Checks no existing verified user has this mobile
- Calls Message Central `POST /verification/v3/send?countryCode=91&mobileNumber={phone}&flowType=SMS&otpLength=6`
- Returns `{ verificationId }`
- `verify_jwt = false`

### `verify-registration-otp`
- Input: `{ name, email, mobile, password, verificationId, code, role: 'buyer' | 'seller' }`
- Verifies OTP via Message Central `GET /verification/v3/validateOtp`
- On success: creates Supabase user via Admin API (`createUser` with email, password, `email_confirm: true`, metadata `{ full_name, mobile, role }`)
- Existing `handle_new_user()` trigger creates profile row; we then update it with `mobile`, `mobile_verified=true`
- Returns success → frontend signs in normally with email+password
- `verify_jwt = false`

## Frontend Changes

### `SellerRegisterPage.tsx` & buyer signup
- Form: Name, Email, Mobile (10 digits), Password, Confirm Password
- Click "Send OTP" → calls `send-registration-otp`
- OTP input appears → click "Verify & Create Account" → calls `verify-registration-otp`
- On success: `supabase.auth.signInWithPassword({ email, password })` → redirect to dashboard

### `SellerLoginPage.tsx` (rewrite)
- Replace OTP UI with: Email-or-Mobile field + Password field + "Login" button
- If input matches `^[6-9]\d{9}$` (mobile): query `profiles` table to get email by mobile → then `signInWithPassword({ email, password })`
- Else: treat input as email → `signInWithPassword({ email, password })`
- "Forgot Password?" link → `/forgot-password` page (uses `resetPasswordForEmail`)

### `BuyerLoginPage.tsx`
- Same single email/mobile + password flow (drop the WhatsApp OTP tab; keep Google sign-in if present)

### New page: `/forgot-password`
- Enter email → `supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + '/reset-password' })`

### New page: `/reset-password`
- Reads recovery token from URL → `supabase.auth.updateUser({ password })`

## Files
- **Create**: `supabase/functions/send-registration-otp/index.ts`
- **Create**: `supabase/functions/verify-registration-otp/index.ts`
- **Create**: `src/pages/ForgotPasswordPage.tsx`, `src/pages/ResetPasswordPage.tsx`
- **Modify**: `src/pages/SellerLoginPage.tsx`, `src/pages/BuyerLoginPage.tsx`, `src/pages/SellerRegisterPage.tsx`, `src/App.tsx` (routes)
- **Migration**: add `mobile_verified` column + unique index on `profiles.mobile`

## Testing Flow
1. Go to `/seller/register` → fill form → click Send OTP → real SMS arrives
2. Enter 6-digit code → account created → auto-logged in → redirected to `/seller/dashboard`
3. Logout → go to `/seller/login` → enter mobile (or email) + password → logged in
4. "Forgot Password?" → enter email → reset link arrives → set new password
