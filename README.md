# Madrishi Global — Premium Luxury Shopify OS 2.0 Theme

A commercially-sellable, Theme-Store-grade luxury theme: an editorial, story-first
shopping experience in the spirit of Louis Vuitton, Cartier and Net-a-Porter — built
from scratch on Shopify Online Store 2.0.

## Highlights
- **OS 2.0** JSON templates, section groups, blocks — everything editable in the Theme Editor, nothing hardcoded.
- **Modular & reusable** — custom-element JS, colocated section CSS/JS, shared snippets (`product-card`, `collection-card`, `article-card`, `responsive-image`, `price`, `badge`, `facets`, …).
- **Performance-first** — per-section assets, lazy/responsive images (CLS-safe), one shared scroll observer, AJAX (cart/filters/search/recommendations) via the Section Rendering API, no jQuery, no third-party libraries.
- **Accessible (WCAG 2.2 AA)** — focus trapping, keyboard nav, ARIA, `prefers-reduced-motion`, skip link, visible focus.
- **Design system** — `--mg-*` tokens (color, type, spacing, radius, shadow, motion); see `DESIGN-SYSTEM.md`.

## Documentation
- `ARCHITECTURE.md` — folder structure & engineering decisions
- `DESIGN-SYSTEM.md` — tokens, type scale, components
- `PERFORMANCE-SEO-ACCESSIBILITY.md` — how the targets are met
- `QA-CHECKLIST.md` — release verification
- `CHANGELOG.md` — version history

## What's included
- **Global components**: announcement bar, header (sticky/transparent/shrink), mega menu, mobile nav, predictive search, wishlist, cart drawer, footer, newsletter popup, cookie banner, back-to-top, scroll progress, toasts/modal utilities.
- **Homepage**: 20 editorial sections (hero, philosophy, collections, craftsmanship, global map, founder story, lookbook, shop-the-look, testimonials, brands, press, awards, journal, instagram, newsletter, CTA, FAQ, footer CTA).
- **Collection**: hero, story, AJAX filters/sort, responsive grid, editorial banner, featured/related collections, SEO content, recently viewed.
- **Product**: media gallery, variant picker, quantity, add-to-cart, wishlist, accordions, JSON-LD, related + recently viewed.
- **Pages**: cart, page, about, contact, FAQ, blog, article, search, 404, list-collections, full customer account suite.

## Local development
```bash
shopify theme dev      # live preview against a dev store
shopify theme check    # lint (config in .theme-check.yml)
shopify theme push     # upload to a store
```

## Merchant setup
Enable the **Search & Discovery** app (filters + predictive search), set product
media-per-variant and color swatches in Admin, choose fonts under **Theme settings →
Typography**, and enable the newsletter popup / cookie banner in the **Footer** group.

---
Built with Claude Code. Brand: Madrishi Global.
