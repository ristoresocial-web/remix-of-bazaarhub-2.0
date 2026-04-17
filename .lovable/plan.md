
User wants to remove all Email OTP functionality since the email OTP API isn't available. Let me identify what "Email OTP" means in this codebase.

Looking at the current state:
- `ForgotPasswordPage.tsx` has a tab toggle: **Email Link** | **Mobile OTP** (just added)
- The "Email Link" flow uses Supabase's `resetPasswordForEmail` (not really OTP, but email-based reset)
- `ResetPasswordPage.tsx` handles the email-link landing page
- Buyer auth memory mentions "Email OTP and Google OAuth" — but actual code uses email/password login + mobile OTP

User likely means: remove the email-based password reset flow entirely, keeping only Mobile OTP. Let me verify by checking what's actually wired.

From the visible code: `ForgotPasswordPage` has Email Link tab. User is currently on `/forgot-password`. They want only Mobile OTP option.

# Remove Email-Based Password Reset — Keep Mobile OTP Only

## Changes

### 1. `src/pages/ForgotPasswordPage.tsx`
- Remove the **Email Link / Mobile OTP** tab toggle entirely
- Remove all email reset logic (`resetPasswordForEmail`, email input field, email submit handler)
- Make Mobile OTP the only flow (no tabs, single form)
- Update page title/subtitle: "Reset your password" → "Reset via Mobile OTP"

### 2. `src/pages/ResetPasswordPage.tsx`
- Delete this file (it only handled the email-link landing page)

### 3. `src/App.tsx`
- Remove the `/reset-password` route and its lazy import for `ResetPasswordPage`

### 4. `src/components/auth/LoginForm.tsx` (verify)
- Confirm no "Login with Email OTP" / magic-link button exists
- If present, remove it (keep only password login)

### 5. Memory update
- Update `mem://auth/buyer-system` to remove the "Email OTP" mention — clarify auth is email+password OR mobile+password, with Mobile OTP only used for password reset / change / signup verification

## Files
**Modified:** `src/pages/ForgotPasswordPage.tsx`, `src/App.tsx`, `mem://auth/buyer-system`, `mem://index.md` (if needed)
**Deleted:** `src/pages/ResetPasswordPage.tsx`
**Verified:** `src/components/auth/LoginForm.tsx`

**Kept as-is (these are Mobile OTP, not Email OTP):**
- `send-otp`, `verify-otp`, `reset-password-otp`, `change-password-otp` edge functions
- `OtpVerifyStep.tsx`
- Mobile OTP in registration (Buyer + Seller)

## Test Flow
1. `/forgot-password` → see only Mobile OTP form (no tabs)
2. Enter `9943440384` → `999999` → set new password → login works
3. `/reset-password` → 404 (route removed)
4. `/auth` login → still works with email+password or mobile+password
