

# Price Alerts Page — Full Rebuild

## Current State
Basic page with a flat alert list, search bar, and a simple "How It Works" section. Missing: Set Alert form, guest mode gate, triggered alert styling, alert history, pro tips, detailed alert cards with seller/difference info, pause/edit functionality.

## What to Build

### 1. Set New Alert Form (top of page)
Card with product search input, target price field, notification toggles (WhatsApp checkbox, Email checkbox), WhatsApp number input. Guest users see a lock overlay with "Login to set alerts" + login button instead of the form.

### 2. Enhanced Alert Cards
Each card shows: product image, name, category, city, target price, current best price + seller name, price difference ("₹4,990 above your target"), notification status, last checked time. Action buttons: Edit Target, Pause, Delete.

### 3. Triggered Alert Card (green variant)
Green top border/badge with "PRICE DROPPED!" banner, shows price below target with celebration emoji, "View Deal" primary button.

### 4. Alert History (collapsible)
Collapsible section using existing `Collapsible` component. Shows past triggered/expired alerts as a simple list with product name, date, and outcome.

### 5. Pro Tips Section
Card with lightbulb icon and 3 bullet points about setting realistic targets, sale seasons, and local price drops.

### 6. Updated Mock Data
2 alerts: 1 active (Samsung Galaxy S24 Ultra, ₹125,000 target, ₹129,990 current, Kumar Electronics) and 1 triggered (iPhone 15 Pro Max, ₹150,000 target, ₹148,500 current, Amazon). Plus 3 past alerts for history.

### 7. Guest Mode Logic
Use `useAuth()` to check login state. If not logged in, the Set Alert form shows a blurred overlay with login prompt. Existing alerts list still visible (from localStorage mock).

## Files to Modify
- `src/pages/PriceAlertsPage.tsx` — full rewrite with all sections above

## Files to Add
- `src/App.tsx` — add `/price-alerts` route (already exists, no change needed)

## Design
- Page header: BellRing icon + city name from AppContext
- Set Alert card: white card with orange "Set Alert" button
- Active alerts: white cards with subtle left border
- Triggered alerts: green-50 background, green left border, green "PRICE DROPPED" badge
- How It Works: 3 horizontal steps with Search/Target/Phone icons in orange circles
- Pro Tips: amber/yellow tinted card with Lightbulb icon
- Guest lock: semi-transparent overlay with Lock icon + login link

