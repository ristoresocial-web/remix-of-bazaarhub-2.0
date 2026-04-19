
User clarification: Their revenue model is **only seller subscriptions + city expo subscriptions**. No commission. No checkout. No orders flow. So I should re-scope — drop everything order/checkout related, focus on what monetizes + what completes the seller-directory experience.

Re-reading uploaded files in this light:
- `schema.prisma` had `orders`, `order_items`, checkout — **NOT NEEDED** per user
- `subscription_plans`, `seller_subscriptions`, `expo_ads`, `promo_codes`, `sms_plans` — **CORE REVENUE**, needed
- `disputes` — typically order-related, but for a directory it's "buyer complaint about seller" → still useful for trust
- `wishlist`, `comparisons`, `price_history` — buyer retention, drives traffic, drives seller value → keep
- `cities`, `categories` admin-managed → admin flexibility, keep

Revised gap list focused on revenue model = subscriptions only.

Keep response concise. This is a re-scoped report, not yet a build plan. End with clear next-step pick.
