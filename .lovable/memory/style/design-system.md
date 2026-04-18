---
name: Design System
description: 2026 Premium theme — Syne/DM Sans/DM Mono fonts, --bh-* HSL tokens, orange #F97316 + green #16A34A, monospace prices
type: design
---
# BazaarHub 2026 Premium Theme

## Fonts
- **Syne** (700/800) — headings, hero, logos. Use class `font-display` or h1/h2/h3.
- **DM Sans** — body default (set on html/body).
- **DM Mono** — all price numbers. Use `font-mono` or `.text-price` / `.text-price-lg` / `.price` / `.price-number`.

## Color tokens (HSL, defined in src/index.css)
All accessible via Tailwind: `bg-bh-orange`, `text-bh-green`, `border-bh-border`, etc.

| Token | Hex | Use |
|---|---|---|
| --bh-orange | #F97316 | Brand primary, CTAs, savings |
| --bh-orange-light | #FFF0E6 | Hover bg, accent fills |
| --bh-orange-dark | #EA6C0A | Hover state |
| --bh-green | #16A34A | Local prices, success, "Hub" logo |
| --bh-green-dark | #15803D | Dark text on green-light |
| --bh-blue | #0369A1 | Online prices |
| --bh-bg | #FAFAF9 | Page background (warm stone) |
| --bh-surface | #FFFFFF | Cards |
| --bh-surface-2 | #F5F5F4 | Subtle inset |
| --bh-border | #E7E5E4 | Hairlines |
| --bh-sidebar | #0C0A09 | Dark sidebar bg (footer + seller dash) |
| --bh-text | #1C1917 | Primary text |
| --bh-text-secondary | #78716C | Secondary text |
| --bh-text-muted | #A8A29E | Muted/labels |

## Logo
"Bazaar" → `text-bh-orange`, "Hub" → `text-bh-green`. Syne 800. See `BazaarLogo.tsx`.

## Buttons
- **Primary**: `rounded-full bg-bh-orange text-white shadow-price hover:bg-bh-orange-dark hover:scale-[1.02]`
- **Outline**: `rounded-full border-2 border-bh-orange text-bh-orange hover:bg-bh-orange-light`
- **WhatsApp**: keep #25D366 (separate brand color)

## Cards
`rounded-2xl border border-bh-border bg-bh-surface shadow-bh-sm hover:shadow-price hover:-translate-y-1 transition-all duration-200`

## Prices
- Local: `font-mono text-bh-price-local` (green)
- Online: `font-mono text-bh-price-online` (blue)
- Savings pill: `rounded-full bg-bh-orange-light text-bh-orange-dark border border-bh-orange/20 font-bold`
- Animation: add `.price-animate` class for entry reveal

## Shadows
`shadow-bh-sm` `shadow-bh` `shadow-bh-lg` `shadow-price` (orange glow for CTAs)

## Animations (utility classes)
`.animate-fade-up` `.animate-fade-up-delay` `.animate-price-reveal` `.animate-savings-pop` `.skeleton` `.hover-lift`

## Easing
All transitions: `cubic-bezier(0.16, 1, 0.3, 1)` — set as `--bh-ease`.

## Legacy compatibility
Old tokens (`--primary`, `--secondary`, `--navy`, `--orange`, `--success`) preserved. New `--bh-*` are additive. Both work side by side.
