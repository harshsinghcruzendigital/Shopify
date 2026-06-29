# Madrishi Global — Theme Architecture & Development Blueprint

> Part 2 deliverable. Software architecture only — no implementation. Implementation begins in Part 3.
> Project prefix: `mg-` (CSS) / `mg_` (JS globals & Liquid helpers).

---

## 1. Platform & Tooling Baseline

| Concern | Decision |
|---|---|
| Platform | Shopify **Online Store 2.0** |
| Templates | **JSON templates** (section-based, merchant-reorderable) |
| Header/Footer | **Section Groups** (`sections/*-group.json`) — the OS 2.0-native way |
| Liquid | Latest; **Theme Check** clean (`.theme-check.yml` committed) |
| JS | Native ES modules + **Custom Elements** (Web Components), `defer`/`type=module`. No jQuery. |
| CSS | Native CSS (custom properties, Grid, Flexbox). No framework. |
| Slider | **Native CSS scroll-snap** + tiny controller. Swiper only if a section genuinely cannot be done natively (documented exception). |
| Dev CLI | **Shopify CLI** (`shopify theme dev`, `theme check`, `theme push`) |
| Source control | Git (this repo) → GitHub `harshsinghcruzendigital/Shopify` |

---

## 2. Folder Structure (authoritative)

```
layout/
  theme.liquid
  password.liquid

templates/
  index.json
  product.json
  collection.json
  list-collections.json
  page.json
  page.contact.json
  page.about.json
  page.faq.json
  article.json
  blog.json
  cart.json
  search.json
  404.json
  gift_card.liquid
  customers/
    account.json
    activate_account.json
    addresses.json
    login.json
    order.json
    register.json
    reset_password.json

sections/
  # --- Section groups (OS 2.0 native) ---
  header-group.json
  footer-group.json
  overlay-group.json            # announcement / promo bars stacked above header
  # --- Global ---
  announcement-bar.liquid
  header.liquid
  footer.liquid
  # --- Homepage / editorial ---
  hero-banner.liquid
  featured-collections.liquid
  editorial-banner.liquid
  product-showcase.liquid
  featured-product.liquid
  collection-grid.liquid
  image-banner.liquid
  image-with-text.liquid
  video-banner.liquid
  lookbook.liquid
  brand-story.liquid
  founder-story.liquid
  timeline.liquid
  craftsmanship.liquid
  luxury-gallery.liquid
  global-map.liquid
  testimonial-slider.liquid
  instagram-feed.liquid
  newsletter.liquid
  faq.liquid
  journal.liquid
  awards.liquid
  press.liquid
  sustainability.liquid
  related-products.liquid
  recently-viewed.liquid
  custom-liquid.liquid
  # --- Template-bound (main-*) ---
  main-product.liquid
  main-collection.liquid
  main-cart.liquid
  main-search.liquid
  main-blog.liquid
  main-article.liquid
  main-page.liquid
  main-404.liquid

snippets/
  button.liquid
  icon.liquid
  badge.liquid
  price.liquid
  product-card.liquid
  collection-card.liquid
  article-card.liquid
  rating.liquid
  breadcrumbs.liquid
  pagination.liquid
  variant-picker.liquid
  wishlist-button.liquid
  quick-view.liquid
  media-gallery.liquid
  responsive-image.liquid       # central image renderer (srcset/sizes/lazy/CLS)
  drawer.liquid
  modal.liquid
  accordion.liquid
  search-item.liquid
  social-icons.liquid
  loading-spinner.liquid
  form-elements.liquid
  meta-tags.liquid              # SEO meta + OG + Twitter
  structured-data.liquid        # JSON-LD (product/collection/org/breadcrumb)
  section-styles.liquid         # emits per-section CSS custom props from settings
  css-variables.liquid          # bridges theme settings -> :root custom props

assets/
  # CSS (load order matters)
  variables.css
  base.css
  typography.css
  layout.css
  utilities.css
  components.css
  animations.css
  responsive.css
  # section CSS is colocated via {% stylesheet %} — NOT one global sections.css
  # JS (ES modules, conditionally loaded)
  theme.js          # entry / init
  global.js         # utilities, custom-element base
  product.js
  collection.js
  cart.js
  slider.js
  animations.js
  predictive-search.js
  wishlist.js
  # fonts (self-hosted, woff2)

config/
  settings_schema.json
  settings_data.json

locales/
  en.default.json
  en.default.schema.json        # translatable customizer labels

.theme-check.yml
.shopifyignore
```

**Deviations from the Part 2 draft (intentional, justified in §11):**
- `sections.css` removed → replaced by per-section `{% stylesheet %}`.
- Added **section groups** (`header-group.json`, `footer-group.json`, `overlay-group.json`).
- Added **`main-*.liquid`** sections (OS 2.0 keeps page bodies in sections, referenced from JSON templates).
- Added `responsive-image.liquid`, `meta-tags.liquid`, `structured-data.liquid`, `css-variables.liquid`, `section-styles.liquid`.
- Added `en.default.schema.json` for translatable settings.

---

## 3. CSS Architecture

**Two-layer model:**

1. **Global core** (loaded once in `theme.liquid`, in this order):
   `variables.css` → `base.css` → `typography.css` → `layout.css` → `utilities.css` → `components.css` → `animations.css` → `responsive.css`.
   Critical above-the-fold rules inlined in `<head>`; the rest loaded non-render-blocking.

2. **Section-scoped CSS** lives **inside each section** via `{% stylesheet %}`, so a section's CSS only ships when the section is on the page. This is the key performance decision and the reason there is no monolithic `sections.css`.

**Custom-property strategy:** all design tokens (color, type scale, spacing, radius, shadow, transitions, container widths) are declared in `variables.css` on `:root`. Merchant color/spacing choices are emitted **per section** as scoped custom properties on the section wrapper (`section-styles.liquid`), so settings drive CSS without inline style sprawl.

**Naming:** BEM with `mg-` prefix — `mg-block`, `mg-block__element`, `mg-block--modifier`. No generic/meaningless names.

**Responsive tokens / breakpoints (mobile-first):**
`--mg-bp-sm: 480px` (large mobile) · `--mg-bp-md: 768px` (tablet) · `--mg-bp-lg: 990px` (laptop) · `--mg-bp-xl: 1280px` (desktop) · `--mg-bp-2xl: 1600px` (large desktop). No fixed pixel widths for layout — Grid/Flexbox + `clamp()` fluid type & spacing.

---

## 4. JavaScript Architecture

- **Custom Elements pattern** (Dawn-style): each interactive component is a `<mg-...>` web component with its own lifecycle. Encapsulated, reusable, no global selectors leaking.
- **Module entry:** `theme.js` imports `global.js` (shared utilities + base classes), registers globally-needed components.
- **Conditional loading:** `product.js`, `collection.js`, `cart.js` etc. are loaded only on the templates that need them (via template-conditional `<script type="module">` in the relevant `main-*` section or `theme.liquid` guards). Nothing ships JS it doesn't use.
- **No library by default.** `slider.js` is a thin scroll-snap controller. `animations.js` uses `IntersectionObserver` for scroll-reveal.
- **Progressive enhancement:** every feature works (or degrades gracefully) without JS; JS enhances. ATC, search, filters all have non-JS fallbacks where Shopify allows.

---

## 5. Liquid Architecture

- **Sections** = independent, self-contained units (Liquid + `{% schema %}` + optional `{% stylesheet %}` + optional `{% javascript %}`). A merchant can add/duplicate/delete/reorder/hide any section without breaking the page.
- **Snippets** = pure reusable partials, parameterized via `{% render %}` (never `{% include %}`). Zero duplication: one `button.liquid`, one `product-card.liquid`, one `responsive-image.liquid`, etc.
- **Schema reuse:** Liquid has no native schema includes, so we adopt a **documented shared-settings convention** — a canonical block of "common section settings" (padding, margin, width, colors, animation, custom class, anchor id, visibility) copy-defined per section from a single reference in this doc, keeping names identical across all sections.
- **Data layer:** editorial/luxury content (craftsmanship, founder story, heritage timeline, press) backed by **metafields / metaobjects** where it belongs to the catalog, exposed through sections — never hardcoded.

---

## 6. Theme Customizer Strategy

- **Global theme settings** (`settings_schema.json`): brand colors, typography, logo, layout widths, social links, cart behavior, animation master toggle, SEO/social defaults.
- **Every section** exposes the shared settings block (see §5) plus its own content settings. Nothing is hardcoded — headings, subheadings, rich text, images (+ separate **mobile image**), video, buttons, links, overlay, alignment, width, padding/margin, animation, colors, radius, container width, visibility, custom CSS class, and section anchor id.
- **Blocks** used for repeatable content (slides, columns, FAQ items, testimonials) so merchants add/remove items freely.
- **Presets** shipped for every section so they drop in pre-styled.

---

## 7. Responsive Strategy

Mobile-first. Breakpoints in §3. Layout via CSS Grid/Flexbox + `clamp()` fluid type/spacing. Separate **mobile image** settings on media sections. No fixed widths; layouts must never break from large-desktop down to small-mobile.

---

## 8. Accessibility Strategy (WCAG 2.2 AA)

Semantic HTML landmarks; logical heading hierarchy; ARIA only where semantics fall short; full keyboard operability; **visible focus states**; descriptive alt text (merchant-editable); accessible forms (labels, error messaging, `aria-describedby`); skip-to-content link; focus trapping in drawers/modals; `prefers-reduced-motion` respected across all animations; color-contrast tokens validated against AA.

---

## 9. Performance Strategy

Targets: Desktop Lighthouse **95+**, Mobile **90+**, A11y/SEO/Best-Practices **100**.
Tactics: per-section CSS (§3); conditional JS (§4); `responsive-image.liquid` central renderer (`image_url` + `srcset`/`sizes`, `loading="lazy"`, `fetchpriority="high"` on LCP hero, explicit `width`/`height`/`aspect-ratio` to kill CLS); self-hosted **woff2** fonts with `font-display: swap` + `<link rel="preload">`; minimal DOM; defer non-critical JS; avoid render-blocking; budget-guard INP via event delegation in custom elements.

---

## 10. SEO Strategy

`meta-tags.liquid` (title, description, canonical, Open Graph, Twitter cards) + `structured-data.liquid` emitting JSON-LD for Product, Collection, Organization, Breadcrumb, Article. Semantic markup, single `<h1>` per page, proper heading order, accessible/crawlable navigation, localized via `locales/`.

---

## 11. Why Each Decision (rationale)

1. **Section groups for header/footer** — the OS 2.0-native mechanism; lets merchants manage global areas in the customizer and supports stacked announcement/overlay bars. The Part 2 draft treated these as plain sections; groups are the correct, future-proof primitive.
2. **Per-section `{% stylesheet %}` instead of `sections.css`** — a global section stylesheet ships CSS for sections that aren't on the page, directly hurting LCP/render-blocking and the 95+/90+ targets. Colocated CSS ships only what's used and keeps a section truly self-contained (add/delete cleanly).
3. **Custom Elements + conditional JS** — encapsulation kills the "all JS in one global file" anti-pattern, prevents selector collisions, and ensures product/collection/cart code never loads where it isn't needed (INP/JS-cost wins).
4. **Native scroll-snap over Swiper** — Part 1/2 mandate "avoid unnecessary libraries"; a library on the homepage is a measurable Lighthouse cost. Native slider keeps us within budget; Swiper stays a documented fallback only.
5. **Central `responsive-image.liquid`** — one renderer guarantees consistent srcset/lazy/CLS handling everywhere; without it, image best-practices drift section to section.
6. **Metafields/metaobjects for editorial content** — the brand is "story first." Storytelling data belongs in structured catalog data, not hardcoded Liquid, so merchants edit it natively and it's reusable across surfaces.
7. **`prefers-reduced-motion` baked into `animations.css`** — required for genuine WCAG 2.2 AA and a hallmark of premium, considerate UX; the original list omitted it.
8. **`*.schema.json` locale + `meta-tags`/`structured-data` snippets** — required for Theme-Store-grade i18n and SEO; the original folder list under-specified both.
9. **`render` over `include`, BEM+prefix, shared settings convention** — these are the concrete mechanisms that deliver the "no duplication / fully reusable / merchant-friendly" mandate rather than just asserting it.

---

## 12. Suggested Improvements (to approve before Part 3)

1. **Adopt section groups** (header/footer/overlay) instead of plain global sections. *(Recommended)*
2. **Drop `sections.css`; colocate section CSS** via `{% stylesheet %}`. *(Recommended — biggest perf lever)*
3. **Custom Elements + template-conditional JS loading** rather than globally-loaded JS files. *(Recommended)*
4. **Native scroll-snap slider**; treat Swiper as an exception requiring justification.
5. **Add metaobjects** for craftsmanship/founder/heritage/press storytelling.
6. **Add `prefers-reduced-motion`, skip-link, focus-trap** to the a11y baseline.
7. **Add `responsive-image`, `meta-tags`, `structured-data`, `css-variables`, `section-styles` snippets** + `en.default.schema.json`.
8. **Commit `.theme-check.yml` + Shopify CLI workflow** from day one so every part is validated as it lands.

---

## 13. Production-Readiness Statement

With the eight improvements in §12 adopted, this architecture is **production-ready and Theme-Store-grade**: modular, reusable, fully merchant-customizable, OS 2.0-native, performance-budgeted (95+/90+/100/100/100), WCAG 2.2 AA-oriented, SEO-complete, and i18n-ready — scalable to thousands of merchants with no hardcoded content and no duplicated Liquid/CSS/JS.

*No implementation code produced in this phase. Implementation begins at Part 3 (Design System).*
