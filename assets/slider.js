/* ============================================================
   Madrishi Global — slider.js
   Reusable <mg-carousel> custom element: a native CSS scroll-snap
   slider with prev/next controls. No library. Shared by featured
   collection, recently viewed, testimonials, etc.

   Markup contract:
     <mg-carousel>
       <button data-mg-carousel-prev>…</button>
       <ul data-mg-carousel-track> <li>…</li> </ul>
       <button data-mg-carousel-next>…</button>
     </mg-carousel>
   ============================================================ */
(function () {
  'use strict';

  class MGCarousel extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-mg-carousel-track]');
      this.prev = this.querySelector('[data-mg-carousel-prev]');
      this.next = this.querySelector('[data-mg-carousel-next]');
      if (!this.track) return;

      this._onScroll = (window.MG ? MG.utils.debounce(() => this._update(), 80) : () => this._update());
      this.track.addEventListener('scroll', this._onScroll, { passive: true });
      this.prev && this.prev.addEventListener('click', () => this._scroll(-1));
      this.next && this.next.addEventListener('click', () => this._scroll(1));
      window.addEventListener('resize', this._onScroll);

      this._update();
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this._onScroll);
    }

    _amount() {
      // Scroll by ~90% of the visible track, snapping to items.
      const item = this.track.querySelector(':scope > *');
      const gap = parseFloat(getComputedStyle(this.track).columnGap || 0) || 0;
      if (item) {
        const w = item.getBoundingClientRect().width + gap;
        const perView = Math.max(1, Math.round(this.track.clientWidth / w));
        return w * perView;
      }
      return this.track.clientWidth * 0.9;
    }

    _scroll(dir) {
      this.track.scrollBy({
        left: dir * this._amount(),
        behavior: (window.MG && MG.utils.prefersReducedMotion()) ? 'auto' : 'smooth'
      });
    }

    _update() {
      const max = this.track.scrollWidth - this.track.clientWidth - 1;
      const x = this.track.scrollLeft;
      const scrollable = this.track.scrollWidth > this.track.clientWidth + 2;
      this.classList.toggle('is-static', !scrollable);
      if (this.prev) this.prev.disabled = x <= 0;
      if (this.next) this.next.disabled = x >= max;
    }
  }

  if (!customElements.get('mg-carousel')) customElements.define('mg-carousel', MGCarousel);
})();
