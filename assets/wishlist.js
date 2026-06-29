/* ============================================================
   Madrishi Global — wishlist.js
   localStorage wishlist: store + button-state controller + drawer.
   Lights up every [data-mg-wishlist-toggle] button and the header
   counter. Guest-friendly (no account required). No dependencies.
   ============================================================ */
(function () {
  'use strict';
  if (!window.MG) window.MG = {};

  /* ---------- Store ---------- */
  const Wishlist = (MG.wishlist = {
    key: 'mg-wishlist',
    get() {
      try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; }
    },
    _set(list) {
      try { localStorage.setItem(this.key, JSON.stringify(list)); } catch (e) {}
      if (MG.events) MG.events.emit('wishlist:change', { items: list });
    },
    has(handle) { return this.get().indexOf(handle) !== -1; },
    count() { return this.get().length; },
    toggle(handle) {
      if (!handle) return false;
      const list = this.get();
      const i = list.indexOf(handle);
      if (i === -1) list.push(handle); else list.splice(i, 1);
      this._set(list);
      return i === -1; // true if now added
    },
    remove(handle) {
      const list = this.get().filter((h) => h !== handle);
      this._set(list);
    }
  });

  /* ---------- Button state + counters ---------- */
  function syncButtons(root) {
    (root || document).querySelectorAll('[data-mg-wishlist-toggle]').forEach((btn) => {
      const active = Wishlist.has(btn.dataset.productHandle);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }
  function syncCounters() {
    const n = Wishlist.count();
    document.querySelectorAll('[data-mg-wishlist-count]').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mg-wishlist-toggle]');
    if (!btn) return;
    e.preventDefault();
    Wishlist.toggle(btn.dataset.productHandle);
  });

  function refresh() { syncButtons(); syncCounters(); }
  if (document.readyState !== 'loading') refresh();
  else document.addEventListener('DOMContentLoaded', refresh);

  if (MG.events) {
    MG.events.on('wishlist:change', refresh);
    MG.events.on('products:appended', (d) => syncButtons(d && d.grid));
    MG.events.on('section:load', () => refresh());
  }

  /* ---------- Drawer ---------- */
  class MGWishlistDrawer extends HTMLElement {
    connectedCallback() {
      this.panel = this.querySelector('.mg-drawer__panel');
      this.body = this.querySelector('[data-mg-wishlist-body]');
      this.empty = this.querySelector('[data-mg-wishlist-empty]');
      this.sectionId = this.dataset.section || 'recently-viewed-product';
      this.trap = MG.FocusTrap ? new MG.FocusTrap(this.panel) : null;

      if (MG.events) {
        MG.events.on('wishlist:open', () => this.open());
        MG.events.on('wishlist:change', () => { if (this.classList.contains('is-open')) this.render(); });
      }
      this.addEventListener('click', (e) => { if (e.target.closest('[data-mg-drawer-close]')) this.close(); });
      this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
    }

    open() { this.hidden = false; requestAnimationFrame(() => this.classList.add('is-open')); document.body.style.overflow = 'hidden'; if (this.trap) this.trap.activate(); this.render(); }
    close() {
      this.classList.remove('is-open'); document.body.style.overflow = '';
      if (this.trap) this.trap.deactivate();
      const done = () => { this.hidden = true; this.panel.removeEventListener('transitionend', done); };
      if (MG.utils && MG.utils.prefersReducedMotion()) this.hidden = true; else this.panel.addEventListener('transitionend', done);
    }

    async render() {
      const handles = Wishlist.get();
      if (!this.body) return;
      if (!handles.length) { this.body.innerHTML = ''; if (this.empty) this.empty.hidden = false; return; }
      if (this.empty) this.empty.hidden = true;
      try {
        const results = await Promise.all(
          handles.map((h) => fetch(`/products/${encodeURIComponent(h)}?section_id=${this.sectionId}`).then((r) => (r.ok ? r.text() : '')).catch(() => ''))
        );
        const frag = document.createDocumentFragment();
        results.forEach((html) => {
          if (!html) return;
          const item = new DOMParser().parseFromString(html, 'text/html').querySelector('[data-mg-rv-item]');
          if (item) frag.appendChild(document.importNode(item, true));
        });
        this.body.innerHTML = '';
        this.body.appendChild(frag);
        syncButtons(this.body);
      } catch (e) { /* keep prior */ }
    }
  }
  if (!customElements.get('mg-wishlist-drawer')) customElements.define('mg-wishlist-drawer', MGWishlistDrawer);
})();
