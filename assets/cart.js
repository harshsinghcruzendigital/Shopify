/* ============================================================
   Madrishi Global — cart.js
   AJAX cart: store + <mg-cart-drawer> + global add-to-cart capture.
   Re-renders the drawer via the Section Rendering API so all line-item
   markup stays in Liquid. No dependencies.
   ============================================================ */
(function () {
  'use strict';
  if (!window.MG) window.MG = {};

  const root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';

  const Cart = (MG.cart = {
    async state() { return fetch(`${root}cart.js`).then((r) => r.json()); },
    async add(formData) {
      const res = await fetch(`${root}cart/add.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw err; }
      return res.json();
    },
    async change(line, quantity) {
      return fetch(`${root}cart/change.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity })
      }).then((r) => r.json());
    },
    async updateNote(note) {
      return fetch(`${root}cart/update.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
    }
  });

  function updateCounts(count) {
    document.querySelectorAll('[data-mg-cart-count]').forEach((el) => {
      el.textContent = count;
      el.classList.toggle('is-empty', count === 0);
    });
  }

  /* ---------- Global add-to-cart capture ---------- */
  document.addEventListener('submit', async (e) => {
    const form = e.target.closest('form[action$="/cart/add"], form[data-mg-product-form]');
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn && btn.classList.add('is-loading');
    try {
      await Cart.add(new FormData(form));
      const drawer = document.querySelector('mg-cart-drawer');
      if (drawer) { await drawer.refresh(); drawer.open(); }
      else window.location = `${root}cart`;
      if (MG.events) MG.events.emit('cart:updated');
    } catch (err) {
      if (MG.events) MG.events.emit('cart:error', err);
      form.querySelector('[data-mg-cart-error]') &&
        (form.querySelector('[data-mg-cart-error]').textContent = (err && err.description) || 'Could not add to cart');
    } finally {
      btn && btn.classList.remove('is-loading');
    }
  });

  /* ---------- Drawer ---------- */
  class MGCartDrawer extends HTMLElement {
    connectedCallback() {
      this.panel = this.querySelector('.mg-drawer__panel');
      this.sectionId = this.dataset.sectionId;
      this.trap = MG.FocusTrap ? new MG.FocusTrap(this.panel) : null;

      if (MG.events) MG.events.on('cart:open', () => { this.refresh(); this.open(); });

      this.addEventListener('click', (e) => this._onClick(e));
      this.addEventListener('change', (e) => this._onChange(e));
      this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });

      updateCounts(this._count());
    }

    _count() {
      const el = this.querySelector('[data-mg-cart-count]');
      return el ? parseInt(el.textContent, 10) || 0 : 0;
    }

    open() { this.hidden = false; requestAnimationFrame(() => this.classList.add('is-open')); document.body.style.overflow = 'hidden'; if (this.trap) this.trap.activate(); }
    close() {
      this.classList.remove('is-open'); document.body.style.overflow = '';
      if (this.trap) this.trap.deactivate();
      const done = () => { this.hidden = true; this.panel.removeEventListener('transitionend', done); };
      if (MG.utils && MG.utils.prefersReducedMotion()) this.hidden = true; else this.panel.addEventListener('transitionend', done);
    }

    async _onClick(e) {
      if (e.target.closest('[data-mg-drawer-close]')) return this.close();
      const remove = e.target.closest('[data-mg-cart-remove]');
      if (remove) { e.preventDefault(); return this._change(remove.dataset.line, 0); }
      const dec = e.target.closest('[data-mg-qty-down]');
      const inc = e.target.closest('[data-mg-qty-up]');
      if (dec || inc) {
        const wrap = (dec || inc).closest('[data-mg-line]');
        const line = wrap.dataset.line;
        const qty = parseInt(wrap.querySelector('[data-mg-qty-input]').value, 10) || 1;
        return this._change(line, dec ? qty - 1 : qty + 1);
      }
    }

    _onChange(e) {
      const input = e.target.closest('[data-mg-qty-input]');
      if (input) {
        const line = input.closest('[data-mg-line]').dataset.line;
        return this._change(line, Math.max(0, parseInt(input.value, 10) || 0));
      }
      const note = e.target.closest('[data-mg-cart-note]');
      if (note) Cart.updateNote(note.value);
    }

    async _change(line, quantity) {
      this.classList.add('is-busy');
      try {
        await Cart.change(parseInt(line, 10), quantity);
        await this.refresh();
        if (MG.events) MG.events.emit('cart:updated');
      } finally { this.classList.remove('is-busy'); }
    }

    async refresh() {
      try {
        const res = await fetch(`${root}?section_id=${this.sectionId}`);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const fresh = doc.querySelector('[data-mg-cart-contents]');
        const host = this.querySelector('[data-mg-cart-contents]');
        if (fresh && host) host.innerHTML = fresh.innerHTML;
        updateCounts(this._count());
      } catch (e) { /* keep current */ }
    }
  }
  if (!customElements.get('mg-cart-drawer')) customElements.define('mg-cart-drawer', MGCartDrawer);
})();
