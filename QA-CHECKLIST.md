# Madrishi Global — QA & Release Checklist (Part 12)

## Automated (passing)
- ✅ All JSON templates / locales / config parse as valid JSON.
- ✅ Every `{% render %}` snippet exists (23 snippets).
- ✅ Every section `type` in templates/groups exists (42 sections).
- ✅ Every `asset_url` reference exists; both section groups resolve.

## Pre-release (run on a real/dev store with Shopify CLI)
- [ ] `shopify theme check` — zero offenses (config in `.theme-check.yml`).
- [ ] `shopify theme dev` — visually confirm every template renders:
      index, collection, product, cart, page, page.contact, page.about,
      page.faq, blog, article, search, 404, list-collections, customers/*.
- [ ] Lighthouse: Home/Collection/Product mobile ≥90, desktop ≥95; A11y/SEO/BP = 100.
- [ ] Add to cart from product + Shop-the-Look → cart drawer opens, count + free-shipping bar update.
- [ ] Variant change → price/availability/URL/gallery update; sold-out disables ATC.
- [ ] Filters/sort (collection) update via AJAX; chips + clear-all work; mobile drawer.
- [ ] Predictive search: live results, ↑/↓ nav, Enter → results page.
- [ ] Wishlist: card hearts persist, header counter, drawer renders saved items.
- [ ] Recently viewed populates after browsing products.
- [ ] Localization (country/language) switches; payment icons render in footer.
- [ ] Newsletter (footer/popup/section) submits; contact form submits.
- [ ] Customer flows: register, login, reset, account, addresses, order.
- [ ] Keyboard-only + screen-reader pass (drawers, menus, forms trapped/labelled).
- [ ] `prefers-reduced-motion` disables animations.
- [ ] RTL spot-check if launching RTL locales.

## Merchant setup notes (document for buyers)
- Configure **Search & Discovery** app for collection filters + predictive search.
- Set product **media per variant** for gallery sync; set native **color swatches** in Admin.
- Upload a **world map image** for the Global Marketplace section (tune pin X/Y).
- Newsletter popup & cookie banner ship **disabled** — enable in the Footer group.
- Fonts use the theme **Typography** settings (Shopify-hosted); change there.

## Optimization done
- Per-section CSS/JS, conditional JS, no external libraries, no jQuery.
- Lazy/responsive images with CLS guards; LCP eager + fetchpriority.
- AJAX with request aborting; single shared scroll observer.

## Packaging
- Theme name/version in `config/settings_schema.json` (`theme_info`).
- Repo: github.com/harshsinghcruzendigital/Shopify.
- To export: `shopify theme push` to a dev store, then **Download theme** (zip), or
  zip the working tree excluding `.git/`, `.claude/`, `node_modules/`.
