# Madrishi Global — Luxury Design System

> Part 3 deliverable. Specification only — no implementation code. Every later section MUST conform to these tokens.
> Token prefix: `--mg-*`. This document is the single source of truth; `variables.css` (built in Part 4+) will mirror it verbatim.

---

## 1. Design Philosophy (binding)

Editorial luxury, not ecommerce. Restraint over decoration. Whitespace over ornament. Timeless over trendy. Every component must "breathe." Reference set: Louis Vuitton, Dior, Cartier, Net-a-Porter, Harrods, Ounass. Forbidden: bright/saturated color, flashy gradients, heavy shadows, clutter, generic-template feel.

---

## 2. Color System

### Brand / Primary
| Token | Hex | Use |
|---|---|---|
| `--mg-navy` | `#1B2A4A` | Primary brand, footer, dark sections, primary text on light |
| `--mg-navy-deep` | `#11182B` | Hover/pressed navy, deepest backgrounds |
| `--mg-gold` | `#B6975C` | Primary accent, hairlines, focus, links |
| `--mg-gold-muted` | `#C9B07D` | Soft accent, secondary highlights |
| `--mg-bronze` | `#9C7A4E` | Warm accent, active states |
| `--mg-charcoal` | `#2B2B2B` | Neutral dark, body text alt |

### Neutrals
| Token | Hex | Use |
|---|---|---|
| `--mg-white` | `#FFFFFF` | Card bg, pure white |
| `--mg-cream` | `#FBF8F2` | Page background (default) |
| `--mg-ivory` | `#F7F4EC` | Text on dark, soft surfaces |
| `--mg-beige` | `#EDE6D8` | Warm section background |
| `--mg-gray-soft` | `#F2EFE7` | Alt section background |
| `--mg-gray-neutral` | `#D9D7D2` | Neutral fills, disabled surfaces |

### Text
| Token | Hex | Contrast on cream |
|---|---|---|
| `--mg-text` | `#1C1C1C` | AAA |
| `--mg-text-secondary` | `#5C5C5C` | AA |
| `--mg-text-muted` | `#8A8A8A` | AA (large/secondary only) |
| `--mg-text-disabled` | `#B5B5B5` | decorative only |
| `--mg-text-on-dark` | `#F7F4EC` | for navy/dark backgrounds |

### Backgrounds
| Token | Value |
|---|---|
| `--mg-bg-page` | `#FBF8F2` |
| `--mg-bg-section` | `#F2EFE7` |
| `--mg-bg-card` | `#FFFFFF` |
| `--mg-bg-footer` | `#1B2A4A` |
| `--mg-overlay` | `rgba(17, 24, 43, 0.45)` (navy scrim) |
| `--mg-overlay-strong` | `rgba(17, 24, 43, 0.65)` |

### Borders
| Token | Hex |
|---|---|
| `--mg-border-divider` | `#E6E2D8` |
| `--mg-border-input` | `#D6D1C4` |
| `--mg-border-card` | `#ECE8DE` |
| `--mg-border-hover` | `#B6975C` |

### Status (muted, luxury-safe)
| Token | Hex |
|---|---|
| `--mg-success` | `#4A6B4D` |
| `--mg-warning` | `#B08940` |
| `--mg-error` | `#9B4A3F` |
| `--mg-info` | `#3E5C7E` |

All pairings target WCAG 2.2 AA (≥4.5:1 body, ≥3:1 large/UI).

---

## 3. Typography System

**Families**
- `--mg-font-display`: `"Cormorant Garamond", "Didot", "Times New Roman", serif` — editorial high-contrast serif for headings.
- `--mg-font-body`: `"Inter", system-ui, sans-serif` — clean body.
- `--mg-font-eyebrow`: `"Jost", "Montserrat", sans-serif` — uppercase tracked labels/nav/buttons.
- Self-hosted **woff2**, `font-display: swap`, preload display + body.

**Scale** (Desktop / Tablet / Mobile px · weight · line-height · letter-spacing · transform). Fluid via `clamp()` between mobile↔desktop.

| Style | D | T | M | Weight | LH | Tracking | Transform |
|---|---|---|---|---|---|---|---|
| Display | 72 | 56 | 40 | 300 | 1.05 | -0.5px | none |
| Hero | 56 | 44 | 32 | 300 | 1.1 | -0.25px | none |
| Section Heading | 40 | 32 | 26 | 400 | 1.15 | 0 | none |
| Card Heading | 24 | 22 | 20 | 500 | 1.25 | 0 | none |
| Product Title | 18 | 17 | 16 | 500 | 1.35 | 0.2px | none |
| Collection Title | 28 | 24 | 20 | 400 | 1.2 | 0.5px | none |
| Body Large | 18 | 17 | 16 | 400 | 1.7 | 0 | none |
| Body Medium | 16 | 15 | 15 | 400 | 1.7 | 0 | none |
| Body Small | 14 | 14 | 14 | 400 | 1.6 | 0 | none |
| Caption | 12 | 12 | 12 | 400 | 1.5 | 0.3px | none |
| Button | 14 | 14 | 13 | 600 | 1 | 1.5px | UPPERCASE |
| Navigation | 14 | 14 | 14 | 500 | 1 | 1.2px | UPPERCASE |
| Footer | 14 | 14 | 14 | 400 | 1.8 | 0.3px | none |
| Label | 12 | 12 | 12 | 600 | 1.2 | 1px | UPPERCASE |
| Price | 16 | 16 | 16 | 500 | 1.2 | 0.2px | none |
| Compare Price | 14 | 14 | 14 | 400 | 1.2 | 0.2px | none (strikethrough, muted) |
| Badge | 11 | 11 | 11 | 600 | 1 | 1px | UPPERCASE |

Eyebrow/nav/button/label/badge use `--mg-font-eyebrow`; all headings use `--mg-font-display`; everything else `--mg-font-body`.

---

## 4. Spacing System

8-point-derived luxury scale (px):

| Token | px | | Token | px |
|---|---|---|---|---|
| `--mg-space-1` | 4 | | `--mg-space-8` | 40 |
| `--mg-space-2` | 8 | | `--mg-space-9` | 48 |
| `--mg-space-3` | 12 | | `--mg-space-10` | 64 |
| `--mg-space-4` | 16 | | `--mg-space-11` | 80 |
| `--mg-space-5` | 20 | | `--mg-space-12` | 96 |
| `--mg-space-6` | 24 | | `--mg-space-13` | 120 |
| `--mg-space-7` | 32 | | `--mg-space-14` | 160 |

Section vertical rhythm: desktop `--mg-space-13` (120), tablet `--mg-space-11` (80), mobile `--mg-space-10` (64). No off-scale values anywhere.

---

## 5. Grid System

| Breakpoint | Range | Container max | Columns | Column gap | Section pad (V) | Container pad (H) |
|---|---|---|---|---|---|---|
| Large Desktop | ≥1600 | 1440 | 12 | 32 | 120 | 64 |
| Desktop | 1280–1599 | 1200 | 12 | 32 | 120 | 48 |
| Laptop | 990–1279 | fluid (90%) | 12 | 24 | 96 | 40 |
| Tablet | 768–989 | fluid (92%) | 8 | 20 | 80 | 32 |
| Large Mobile | 480–767 | fluid (100%) | 4 | 16 | 64 | 20 |
| Small Mobile | <480 | fluid (100%) | 4 | 16 | 64 | 16 |

Breakpoint tokens: `--mg-bp-sm:480` · `--mg-bp-md:768` · `--mg-bp-lg:990` · `--mg-bp-xl:1280` · `--mg-bp-2xl:1600`.
Container tokens: `--mg-container-wide:1440` · `--mg-container:1200` · `--mg-container-narrow:880` (editorial reading width).

**Image / card ratios:** Portrait product `3:4` · Square `1:1` · Landscape banner `16:9` · Hero `16:9` (desktop) / `4:5` (mobile) · Editorial `4:5` · Collection card `3:4` · Lookbook `2:3`.

---

## 6. Border Radius System

Luxury = minimal rounding.

| Token | px | Applies to |
|---|---|---|
| `--mg-radius-none` | 0 | Buttons, cards, images (default luxury = square) |
| `--mg-radius-xs` | 2 | Inputs, badges, subtle softening |
| `--mg-radius-sm` | 4 | Dropdowns, small surfaces |
| `--mg-radius-md` | 8 | Modals, drawers |
| `--mg-radius-pill` | 999 | Pills/chips only |

Default for buttons/cards/images is `0` (sharp editorial). `xs` optional via setting.

---

## 7. Shadow System

Soft, navy-tinted, never heavy.

| Token | Value |
|---|---|
| `--mg-shadow-xs` | `0 1px 2px rgba(17,24,43,0.04)` |
| `--mg-shadow-sm` | `0 2px 8px rgba(17,24,43,0.06)` |
| `--mg-shadow-md` | `0 8px 24px rgba(17,24,43,0.08)` |
| `--mg-shadow-lg` | `0 16px 48px rgba(17,24,43,0.10)` |
| `--mg-shadow-card-hover` | `0 12px 32px rgba(17,24,43,0.10)` |

Cards default to **no shadow** (border hairline); shadow appears on hover only.

---

## 8. Button System

Shared: tracked uppercase (`Button` type), `--mg-transition-base` on hover, visible focus ring (`0 0 0 2px --mg-gold` offset), disabled `--mg-text-disabled` + `cursor:not-allowed`, loading = inline spinner + disabled, icon gap `--mg-space-2`.

| Variant | Height (D/M) | Padding X | Fill | Text | Border | Hover | Radius |
|---|---|---|---|---|---|---|---|
| Primary | 52 / 48 | 32 | `--mg-navy` | `--mg-ivory` | none | bg→`--mg-navy-deep`, subtle lift | none |
| Secondary | 52 / 48 | 32 | `--mg-gold` | `--mg-navy` | none | bg→`--mg-bronze` | none |
| Outline | 52 / 48 | 32 | transparent | `--mg-navy` | 1px `--mg-navy` | fill→`--mg-navy`, text→ivory | none |
| Ghost | 48 / 44 | 24 | transparent | `--mg-navy` | none | bg→`rgba(27,42,74,0.05)` | none |
| Text | auto | 0 | transparent | `--mg-navy` | none | gold underline grows L→R | none |
| Icon | 44×44 | — | transparent | `--mg-navy` | none | bg→`rgba(27,42,74,0.05)` | xs |

Icon position: left or right via setting. Min touch target 44×44 (mobile).

---

## 9. Card System

Shared: hairline `--mg-border-card`, no default shadow, hover lift `translateY(-4px)` + `--mg-shadow-card-hover`, image zoom `scale(1.04)` on hover, `--mg-transition-slow`.

| Card | Image ratio | Padding | Content | Notes |
|---|---|---|---|---|
| Product | 3:4 | content `--mg-space-4` 0 | title, price, swatches | hover 2nd image, wishlist top-right, quick-view on hover |
| Collection | 3:4 | overlay or below | collection title + count | optional navy overlay + CTA |
| Editorial | 4:5 | `--mg-space-5` | eyebrow, heading, excerpt | magazine feel |
| Blog | 16:9 | `--mg-space-5` | date, title, excerpt, read more | |
| Gallery | 1:1 / 2:3 | none | optional caption on hover | |
| Story | 4:5 | `--mg-space-6` | quote/heading | minimal |

---

## 10. Form System

Inputs: height 52 (D)/48 (M), padding `0 --mg-space-4`, 1px `--mg-border-input`, radius `xs`, `--mg-font-body` 16px (prevents iOS zoom).
States: hover border→`--mg-bronze`; focus border→`--mg-gold` + ring `0 0 0 2px rgba(182,151,92,0.25)`; error border→`--mg-error` + message `--mg-error` caption with `aria-describedby`; disabled bg→`--mg-gray-soft`.
Components: Textarea (min-h 120), Select (custom chevron icon), Checkbox/Radio (custom, gold check, 20px target ≥44 hit area), Switch (navy track when on), Newsletter (inline input+button), Search (icon-led, predictive), Contact (labelled, validated). Floating or top-aligned labels; never placeholder-only. Full keyboard + screen-reader support.

---

## 11. Badge System

| Badge | Text color | Background | Notes |
|---|---|---|---|
| Sale | `--mg-ivory` | `--mg-error` | |
| New | `--mg-navy` | `--mg-gold-muted` | |
| Best Seller | `--mg-ivory` | `--mg-navy` | |
| Limited Edition | `--mg-gold` | `--mg-navy-deep` | |
| Exclusive | `--mg-navy` | `--mg-gold` | |
| Sold Out | `--mg-ivory` | `--mg-text-muted` | |
| Low Stock | `--mg-navy` | `--mg-warning` tint | |
| Luxury Pick | `--mg-gold` | transparent + 1px gold | |
| Editor's Choice | `--mg-ivory` | `--mg-bronze` | |

Shared: `Badge` type (11px uppercase, 1px tracking), padding `4px 10px`, radius `xs`, position top-left or top-right of card via setting.

---

## 12. Icon System

Line icons, uniform **1.5px stroke**, 24×24 grid, `currentColor`, rounded caps. Single SVG sprite via `icon.liquid`. No filled/cartoon/emoji icons.

---

## 13. Animation System

**Durations:** `--mg-dur-fast:200ms` · `--mg-dur-base:300ms` · `--mg-dur-slow:500ms` · `--mg-dur-slower:800ms`.
**Easing:** `--mg-ease:cubic-bezier(0.22,1,0.36,1)` (default), `--mg-ease-in-out:cubic-bezier(0.65,0,0.35,1)`.
**Transitions:** `--mg-transition-base: all 300ms var(--mg-ease)` · `--mg-transition-slow: all 500ms var(--mg-ease)`.

Catalog: Fade (300), Reveal/Slide-Up on scroll (500, 24px travel), Slide L/R (500), Scale-in (400), Image zoom hover (500, scale 1.04), Button hover (300), Card hover lift (300), Nav/Mega-menu reveal (300 fade+8px), Drawer slide (400), Accordion height (300), Page transition fade (300), Scroll reveal via IntersectionObserver (stagger 80ms).

**`prefers-reduced-motion: reduce` → all motion reduced to opacity-only ≤120ms or none.** CSS-first; JS only for scroll observers. No animation may regress LCP/CLS/INP.

---

## 14. Image System

Hero (16:9 D / 4:5 M, `fetchpriority=high`, eager), Collection/Product (3:4), Lifestyle (4:5), Banner (16:9), Thumbnail (1:1). All via central renderer: `srcset` + `sizes`, `loading="lazy"` (except LCP), explicit width/height/`aspect-ratio` (CLS=0), `object-fit:cover`, hover zoom `scale(1.04)`. Modern formats served by Shopify CDN.

---

## 15. Product Card (premium spec)

3:4 image · secondary image on hover (fade) · wishlist heart top-right (always visible mobile, hover desktop) · quick-view reveal on hover (desktop) · title (Product Title) · price + compare (strikethrough muted) · optional rating · color swatches (max 4 + "+N") · badge top-left · hover lift + zoom. Minimal — no borders inside, no clutter.

---

## 16. Collection Card (premium spec)

Large 3:4 image · editorial title (Collection Title) over optional navy overlay OR below image · optional product count · optional Text/Outline CTA · hover zoom. Minimal text.

---

## 17. Navigation Design

Desktop header (logo center or left, nav, search, account, wishlist, cart), transparent-over-hero option, sticky-on-scroll-up with background fade-in, hairline bottom border. Mega menu: full-width panel, columns + featured image, 300ms fade+8px. Dropdown: simple list, sm radius, sm shadow. Mobile header: hamburger + logo + cart, slide-in drawer nav, large touch targets. Cart drawer + wishlist drawer slide from right. Announcement bar above header (rotating, dismissible).

---

## 18. Footer Design

Navy bg, ivory text, generous spacing (`--mg-space-12` top). Blocks: newsletter, quick links, collections, customer support, social icons, payment icons, country + language selector, copyright. Footer typography, gold hairline dividers, large breathing room.

---

## 19. Mobile & Responsive

Premium mobile: ≥44px touch targets, one-handed reach, sticky bottom action bar (PDP ATC), smooth/swipe-friendly, fast. Every component specified across Large Desktop → Small Mobile (§5). No layout may break; no fixed widths; Grid/Flexbox + `clamp()`.

---

## 20. Accessibility (WCAG 2.2 AA)

AA contrast (tokens validated §2), full keyboard nav, visible gold focus rings, ARIA where needed, readable line-heights (body 1.7), touch spacing, skip link, focus trap in drawers/modals, reduced-motion honored, alt text merchant-editable.

---

## 21. Design Tokens (master reference)

Consolidated token groups (values defined above): **Colors** (§2) · **Typography** families+scale (§3) · **Spacing** `--mg-space-1..14` (§4) · **Radius** `--mg-radius-*` (§6) · **Shadow** `--mg-shadow-*` (§7) · **Animation** `--mg-dur-*`, `--mg-ease*`, `--mg-transition-*` (§13) · **Breakpoints/Container** `--mg-bp-*`, `--mg-container*` (§5).

**Z-index scale:** `--mg-z-base:1` · `--mg-z-dropdown:100` · `--mg-z-sticky-header:200` · `--mg-z-overlay:300` · `--mg-z-drawer:400` · `--mg-z-modal:500` · `--mg-z-toast:600`.
**Opacity:** `--mg-opacity-muted:0.6` · `--mg-opacity-disabled:0.4` · `--mg-opacity-overlay:0.45`.
**Border widths:** `--mg-border-hairline:1px` · `--mg-border-thick:2px`.

> All tokens reused theme-wide. No section may introduce off-system values. `variables.css` will mirror this file 1:1 when implementation starts.

*No Liquid/CSS/section implementation produced. Awaiting Part 4 (Global Components) to begin building.*
