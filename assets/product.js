/* ============================================================
   Madrishi Global — product.js
   <mg-product-form>  : variant selection (price/availability/URL/
                        gallery sync). Add-to-cart is handled globally
                        by cart.js (form posts to /cart/add).
   <mg-product-gallery>: thumbnail navigation + variant image sync.
   Loaded only on product templates.
   ============================================================ */
(function () {
  'use strict';

  class MGProductForm extends HTMLElement {
    connectedCallback() {
      this.form = this.querySelector('form');
      this.idInput = this.querySelector('[data-mg-variant-id]');
      this.qtyInput = this.querySelector('[data-mg-qty]');
      this.priceCurrent = this.querySelector('[data-mg-price-current]');
      this.priceCompare = this.querySelector('[data-mg-price-compare]');
      this.atc = this.querySelector('[data-mg-atc]');
      this.atcText = this.querySelector('[data-mg-atc-text]');
      this.gallery = document.querySelector('mg-product-gallery');

      const data = this.querySelector('[data-mg-variants]');
      try { this.variants = JSON.parse(data.textContent); } catch (e) { this.variants = []; }

      this.addEventListener('change', (e) => { if (e.target.matches('[data-mg-option]')) this._onOptionChange(); });
      this.addEventListener('click', (e) => {
        if (!this.qtyInput) return;
        if (e.target.closest('[data-mg-qty-down]')) this.qtyInput.value = Math.max(1, (parseInt(this.qtyInput.value, 10) || 1) - 1);
        if (e.target.closest('[data-mg-qty-up]')) this.qtyInput.value = (parseInt(this.qtyInput.value, 10) || 1) + 1;
      });
    }

    _selectedOptions() {
      const groups = {};
      this.querySelectorAll('[data-mg-option]:checked').forEach((i) => { groups[i.dataset.optionPosition] = i.value; });
      return Object.keys(groups).sort().map((k) => groups[k]);
    }

    _onOptionChange() {
      const selected = this._selectedOptions();
      const variant = this.variants.find((v) => v.options.length === selected.length && v.options.every((o, i) => o === selected[i]));

      // Update visible option labels
      this.querySelectorAll('[data-mg-option-label]').forEach((label, idx) => {
        const checked = this.querySelector(`[data-option-position="${label.dataset.mgOptionLabel}"]:checked`);
        if (checked) label.textContent = checked.value;
      });

      if (!variant) { this._setUnavailable(); return; }

      if (this.idInput) this.idInput.value = variant.id;
      if (this.priceCurrent) this.priceCurrent.textContent = variant.price;
      if (this.priceCompare) {
        this.priceCompare.textContent = variant.on_sale ? variant.compare_at_price : '';
        this.priceCompare.hidden = !variant.on_sale;
      }
      this._setAvailability(variant.available);

      // Sync gallery to the variant's media
      if (variant.media_id && this.gallery && typeof this.gallery.selectByMediaId === 'function') {
        this.gallery.selectByMediaId(variant.media_id);
      }

      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    }

    _setAvailability(available) {
      if (!this.atc) return;
      this.atc.disabled = !available;
      if (this.atcText) this.atcText.textContent = available
        ? (this.atc.dataset.labelAdd || 'Add to cart')
        : (this.atc.dataset.labelSoldout || 'Sold out');
    }
    _setUnavailable() {
      if (!this.atc) return;
      this.atc.disabled = true;
      if (this.atcText) this.atcText.textContent = this.atc.dataset.labelUnavailable || 'Unavailable';
    }
  }
  if (!customElements.get('mg-product-form')) customElements.define('mg-product-form', MGProductForm);

  class MGProductGallery extends HTMLElement {
    connectedCallback() {
      this.slides = Array.from(this.querySelectorAll('[data-mg-media]'));
      this.thumbs = Array.from(this.querySelectorAll('[data-mg-thumb]'));
      this.thumbs.forEach((t) => t.addEventListener('click', () => this.select(parseInt(t.dataset.index, 10))));
      this.index = 0;
    }
    select(i) {
      if (i < 0 || i >= this.slides.length) return;
      this.index = i;
      this.slides.forEach((s, idx) => { s.classList.toggle('is-active', idx === i); s.setAttribute('aria-hidden', idx === i ? 'false' : 'true'); });
      this.thumbs.forEach((t, idx) => { t.classList.toggle('is-active', idx === i); t.setAttribute('aria-current', idx === i ? 'true' : 'false'); });
    }
    selectByMediaId(id) {
      const idx = this.slides.findIndex((s) => s.dataset.mediaId == id);
      if (idx > -1) this.select(idx);
    }
  }
  if (!customElements.get('mg-product-gallery')) customElements.define('mg-product-gallery', MGProductGallery);
})();
