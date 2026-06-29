/* ============================================================
   Madrishi Global — global.js
   Shared utilities + custom-element base. No dependencies, no jQuery.
   Exposes a single namespace: window.MG
   ============================================================ */
(function () {
  'use strict';

  // Swap no-js -> js as early as possible
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const MG = (window.MG = window.MG || {});

  /* ---------- Utilities ---------- */
  MG.utils = {
    debounce(fn, wait = 200) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    isMobile() {
      return window.matchMedia('(max-width: 767px)').matches;
    },

    // Returns focusable descendants of an element
    focusable(el) {
      return Array.from(
        el.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node) => node.offsetParent !== null);
    }
  };

  /* ---------- Focus trap (used by drawers/modals) ---------- */
  MG.FocusTrap = class {
    constructor(container) {
      this.container = container;
      this._onKeydown = this._onKeydown.bind(this);
    }
    activate() {
      this._previous = document.activeElement;
      const f = MG.utils.focusable(this.container);
      if (f.length) f[0].focus();
      this.container.addEventListener('keydown', this._onKeydown);
    }
    deactivate() {
      this.container.removeEventListener('keydown', this._onKeydown);
      if (this._previous && typeof this._previous.focus === 'function') {
        this._previous.focus();
      }
    }
    _onKeydown(e) {
      if (e.key !== 'Tab') return;
      const f = MG.utils.focusable(this.container);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  /* ---------- Tiny pub/sub event bus (cross-component comms) ---------- */
  MG.events = (function () {
    const map = {};
    return {
      on(name, cb) {
        (map[name] = map[name] || []).push(cb);
        return () => this.off(name, cb);
      },
      off(name, cb) {
        if (map[name]) map[name] = map[name].filter((f) => f !== cb);
      },
      hasListener(name) {
        return Boolean(map[name] && map[name].length);
      },
      emit(name, detail) {
        (map[name] || []).forEach((cb) => cb(detail));
      }
    };
  })();

  /* ---------- Recently-viewed history (localStorage) ---------- */
  MG.recentlyViewed = {
    key: 'mg-recently-viewed',
    max: 20,
    get() {
      try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; }
    },
    add(handle) {
      if (!handle) return;
      let list = this.get().filter((h) => h !== handle);
      list.unshift(handle);
      list = list.slice(0, this.max);
      try { localStorage.setItem(this.key, JSON.stringify(list)); } catch (e) {}
    }
  };
  // Auto-track: any page that declares the current product handle.
  const pmeta = document.querySelector('meta[name="mg:product-handle"]');
  if (pmeta && pmeta.content) MG.recentlyViewed.add(pmeta.content);

  // Shopify section lifecycle (Theme Editor) — components self-init via
  // connectedCallback, but expose a hook for non-custom-element listeners.
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', (e) =>
      MG.events.emit('section:load', e.detail)
    );
    document.addEventListener('shopify:section:unload', (e) =>
      MG.events.emit('section:unload', e.detail)
    );
  }
})();
