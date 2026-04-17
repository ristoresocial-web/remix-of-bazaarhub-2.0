
User echoed back my previous OTP plan and added one new requirement at the end:
> "add one more after click terms and privacy policy user register"

This means: a mandatory **Terms & Privacy Policy checkbox** must be checked before the user can register (both Buyer and Seller forms). They must click/check it to enable the Register button.

Let me confirm what needs to change vs the previous declined plan — same 7 sections + add T&C consent.

# Add OTP Password Flows + T&C Consent on Registration

## 1. Forgot Password — Add Mobile OTP Option
Update `ForgotPasswordPage.tsx`:
- Tab toggle: **Email Link** | **Mobile OTP**
- Mobile OTP flow: enter mobile → Send OTP → enter 6-digit + new password + confirm → submit to `reset-password-otp` → toast → redirect `/auth`

## 2. Logged-In Password Change (NEW)
Create `src/pages/ChangePasswordPage.tsx` at `/account/change-password`:
- Auth-required (redirect to `/auth` if not logged in)
- Step A: current password + new + confirm → re-auth via `signInWithPassword` → call `send-otp` to registered mobile
- Step B: OTP → submit to `change-password-otp` → toast → sign out → redirect `/auth`
- Add "Change Password" link in buyer dashboard + seller `SettingsTab`

## 3. T&C / Privacy Consent on Registration (NEW)
Update `BuyerRegisterForm.tsx` and `SellerRegisterForm.tsx`:
- Add a required checkbox above the submit button:
  > ☐ I agree to the [Terms of Service](/terms) and [Privacy Policy](/privacy)
- Links open in new tab (`target="_blank"`)
- "Send OTP" / submit button stays **disabled** until checkbox is checked
- Add to zod schema: `acceptedTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the Terms and Privacy Policy" }) })`
- Inline error if user tries to submit without checking
- For Seller form: also link Seller Terms (`/seller-terms`) — `I agree to Terms, Privacy Policy, and Seller Terms`

## 4. New Edge Function: `reset-password-otp` (no JWT)
- Body: `{ mobile, verificationId, code, newPassword }`
- Zod-validate inputs (mobile `^[6-9]\d{9}$`, code 6 digits, password min 8 + letter + digit)
- Admin bypass: mobile `9943440384` + code `999999` → skip Message Central
- Otherwise validate via MC `GET /validateOtp`
- Lookup `user_id` in `profiles` by mobile → if not found, return generic success (don't leak account existence)
- If found, use Service Role: `supabaseAdmin.auth.admin.updateUserById(user_id, { password: newPassword })`
- Return `{ success: true }`

## 5. New Edge Function: `change-password-otp` (validates JWT in code)
- Body: `{ verificationId, code, newPassword }`
- Validate JWT via `getClaims()` → get `user_id`
- Lookup mobile from profiles for that user_id
- Validate OTP (with admin bypass)
- Update password via Admin API for that user_id
- Return `{ success: true }`

## 6. Files
**Created:**
- `supabase/functions/reset-password-otp/index.ts`
- `supabase/functions/change-password-otp/index.ts`
- `src/pages/ChangePasswordPage.tsx`

**Modified:**
- `src/pages/ForgotPasswordPage.tsx` — add Email/OTP tab toggle + OTP reset flow
- `src/components/auth/BuyerRegisterForm.tsx` — add T&C checkbox + validation
- `src/components/auth/SellerRegisterForm.tsx` — add T&C + Seller Terms checkbox + validation
- `src/lib/authValidation.ts` — add `acceptedTerms` to buyer + seller schemas
- `src/App.tsx` — add route `/account/change-password`
- `src/components/seller/SettingsTab.tsx` — add "Change Password" link
- `src/pages/BuyerDashboardPage.tsx` — add "Change Password" link

**Reused as-is:** `send-otp`, `OtpVerifyStep.tsx`

## 7. UX
- Reuse 30s resend timer + admin bypass hint on OTP step
- Show/hide password eye on all password fields
- T&C checkbox uses shadcn `Checkbox` with linked text
- Submit button disabled state when checkbox unchecked (visible affordance)
- Friendly inline errors

## 8. Test Flow
1. `/auth` → Register Buyer → fill form → notice Send OTP disabled → tick T&C → Send OTP works
2. Register Seller → tick combined T&C + Seller Terms → Send OTP
3. `/forgot-password` → Mobile OTP tab → enter `9943440384` → `999999` → new password → login works
4. Login → Settings → Change Password → enter current + new → OTP to registered mobile → submit → re-login works
5. Real mobile: real SMS arrives for both reset and change flows
