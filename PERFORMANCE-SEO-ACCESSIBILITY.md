# Madrishi Global — Performance, SEO & Accessibility (Part 11)

This theme was built to the targets in Part 1: Desktop Lighthouse 95+, Mobile 90+, Accessibility 100, Best Practices 100, SEO 100. This document records how each is achieved and what to verify in QA.

## Performance

- **Per-section CSS/JS** via `{% stylesheet %}` / `{% javascript %}` — a section ships its styles/scripts only when it's on the page. No monolithic `sections.css`.
- **Conditional JS** — `product.js` loads only on product templates; global modules (`global`, `animations`, `slider`, `wishlist`, `cart`, `utilities`) are small and `defer`-loaded in order.
- **Central image renderer** (`responsive-image.liquid`) — `srcset` + `sizes`, art-directed `<picture>` (mobile image), explicit `width`/`height` + `aspect-ratio` (CLS≈0), `loading="lazy"` everywhere except the LCP element (hero/first product media/article hero get `loading="eager"` + `fetchpriority="high"`).
- **Fonts** — Shopify-hosted via `font_picker` + `font_face` (no external font request); `font-display: swap`.
- **One shared `IntersectionObserver`** (`animations.js`) for all scroll reveals; carousels/scroll-utils use single passive, rAF-throttled scroll listeners.
- **AJAX over reload** — cart, filters/sort, predictive search, load-more/infinite scroll use `fetch` + Section Rendering API; in-flight requests aborted (`AbortController`) when superseded.
- **No libraries** — native scroll-snap slider, native CSS Grid/Flexbox, custom elements. Zero jQuery.
- **CLS guards** — fixed announcement-bar/header heights, image aspect-ratios, sticky-header body spacer.

## SEO

- **Titles/description** in `theme.liquid`; **canonical** via `{{ canonical_url }}`.
- **`meta-tags.liquid`** — Open Graph (site/type/title/description/url/image, product price) + Twitter summary_large_image.
- **`structured-data.liquid`** — Organization + WebSite (SearchAction) JSON-LD sitewide.
- **Product JSON-LD** in `main-product.liquid`; **BreadcrumbList** microdata in `breadcrumbs.liquid`.
- **Semantic HTML** — single `<h1>` per page (header logo on home, page/product/article titles elsewhere), logical heading order, `<nav>/<main>/<article>/<footer>` landmarks.
- **Crawlable navigation**, native pagination links, localized via `locales/`.

## Accessibility (WCAG 2.2 AA)

- **Skip link** to `#MainContent`; `<main tabindex="-1">`.
- **Visible focus** — gold focus ring via `:focus-visible` in `base.css`.
- **Keyboard** — hero/lookbook arrow keys, predictive-search ↑/↓, mega-menu focus-within + Escape, accordions/disclosures as `<button aria-expanded>`.
- **Focus trapping** — drawers (mobile nav, cart, wishlist), search overlay, modals, lightbox, popup use `MG.FocusTrap`; Escape + overlay close.
- **ARIA** — `role="dialog" aria-modal`, `aria-live` (cart count, search results, toasts), `aria-current`, `aria-pressed` (wishlist), `role="progressbar"` (shipping/cart), labelled icon buttons.
- **`prefers-reduced-motion`** — honored globally in `base.css` and every animated section/element.
- **Forms** — real labels (or visually-hidden), native validation, error messaging with `role="alert"`.
- **Color contrast** — token palette validated for AA (body ≥4.5:1, large/UI ≥3:1).
- **Touch targets** — ≥44px on interactive controls.

## QA verification (run on a populated store)

1. `shopify theme check` → resolve any offenses.
2. Lighthouse (mobile + desktop) on Home, Collection, Product, Cart, Article.
3. Keyboard-only pass: tab through header → mega menu → drawers → product form → footer.
4. Screen-reader smoke test (VoiceOver/NVDA) on Product + Cart.
5. Throttled 3G: confirm LCP image priority and no layout shift.
6. Validate JSON-LD with Google Rich Results Test.
