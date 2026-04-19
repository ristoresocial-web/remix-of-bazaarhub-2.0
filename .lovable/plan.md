

User wants better category icons. Current ones were generated with Nano Banana 2 (`google/gemini-3.1-flash-image-preview`) using a generic prompt. They look decent but user wants higher quality.

Options to improve:
1. **Upgrade model** to `google/gemini-3-pro-image-preview` (Nano Banana Pro) — top-tier image quality, slower/costlier but visibly better.
2. **Refine prompt** — add stronger claymorphism cues (studio lighting, ambient occlusion, hero subject framing, transparent background).
3. **Transparent backgrounds** — current icons may have white/colored backgrounds. PNGs with transparent BG sit better on the gradient cards.

Plan: regenerate all 12 category icons with Pro image model + tighter prompt formula + transparent background spec. Replace existing files in `src/assets/categories/`. No code changes needed — `CategoryGrid.tsx` already references these paths.

## What I'll do

1. **Regenerate 12 icons** using `google/gemini-3-pro-image-preview` (Nano Banana Pro — best quality available).
2. **Use a refined prompt formula** per category:
   > "[subject], 3D claymorphism icon, glossy clay material, soft studio lighting with ambient occlusion, vibrant Bazaar Hub orange (#F97316) and warm accents, isometric hero angle, ultra-detailed 4k render, transparent background, centered composition, friendly and tactile"
3. **Save to** `src/assets/categories/*.png` (overwrites current files — `CategoryGrid.tsx` keeps working as-is).
4. **QA each generated image** by viewing it before declaring done — re-roll any that look off.

## Categories to regenerate
mobiles, electronics, laptops, tvs, home-kitchen, beauty, fashion, books, toys, pets, grocery, sports

## Files touched
- `src/assets/categories/*.png` (12 files, replaced)
- No `.tsx` changes — paths are unchanged

## Cost note
Nano Banana Pro is more expensive than Flash. 12 images = one-time cost; icons are then static assets. Worth it for permanent homepage hero.

