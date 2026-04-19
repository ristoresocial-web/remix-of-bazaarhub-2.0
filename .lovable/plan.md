
User wants to redesign the category browsing experience with a "lovable" claymorphism aesthetic + generate AI category icons + expand category list to full Amazon A-Z. Three distinct workstreams.

Current state:
- `CategoryGrid.tsx` shows 6 categories with lucide icons (Smartphone, Tv, etc.) on orange-light background
- Brand memory says: Orange #F97316 + Green #16A34A, Syne/DM Sans fonts, NOT pastel
- Memory has: 21 categories already defined per `mem://inventory/categories`
- Has Lovable AI Gateway access for image generation (Nano Banana via edge function)

Conflict to flag: User asks for pastel mint/peach/lavender + Inter/Montserrat. This **directly contradicts** locked brand memory (orange/green + Syne/DM Sans). Must ask before overriding brand.

Scope decisions needed:
1. Override brand colors/fonts on category section only? Or globally? Or keep brand and just add claymorphism shapes?
2. Generate icons via edge function (costs AI credits, ~12 images) or use static SVG illustrations?
3. Replace current 6-category grid or add new dedicated `/categories` page?

Keep plan tight.
