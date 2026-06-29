/* ============================================================
   Madrishi Global — utilities.js
   Global UI primitives: toast notifications + generic <mg-modal>.
   - MG.toast(message, { type, duration })
   - <mg-modal id="x"> opened by [data-mg-modal-open="x"], closed by
     [data-mg-modal-close] / Escape / overlay. MG.modal.open(id)/close(id).
   ============================================================ */
(function () {
  'use strict';
  if (!window.MG) window.MG = {};

  /* ---------- Toasts ---------- */
  let toastHost;
  function host() {
    if (!toastHost) {
      toastHost = document.createElement('div');
      toastHost.className = 'mg-toasts';
      toastHost.setAttribute('aria-live', 'polite');
      toastHost.setAttribute('aria-atomic', 'true');
      document.body.appendChild(toastHost);
    }
    return toastHost;
  }

  MG.toast = function (message, opts) {
    opts = opts || {};
    const type = opts.type || 'info';
    const duration = opts.duration || 4000;
    const el = document.createElement('div');
    el.className = 'mg-toast mg-toast--' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.textContent = message;
    host().appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-visible'));
    const remove = () => {
      el.classList.remove('is-visible');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
      setTimeout(() => el.remove(), 400);
    };
    const timer = setTimeout(remove, duration);
    el.addEventListener('click', () => { clearTimeout(timer); remove(); });
    return el;
  };

  // Surface cart errors as toasts automatically.
  if (MG.events) {
    MG.events.on('cart:error', (err) => MG.toast((err && err.description) || 'Something went wrong', { type: 'error' }));
  }

  /* ---------- Generic modal ---------- */
  class MGModal extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('.mg-modal__dialog');
      this.trap = MG.FocusTrap && this.dialog ? new MG.FocusTrap(this.dialog) : null;
      this.addEventListener('click', (e) => { if (e.target.closest('[data-mg-modal-close]')) this.close(); });
      this.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
    }
    open() {
      this.hidden = false;
      requestAnimationFrame(() => this.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      if (this.trap) this.trap.activate();
    }
    close() {
      this.classList.remove('is-open');
      document.body.style.overflow = '';
      if (this.trap) this.trap.deactivate();
      const done = () => { this.hidden = true; this.removeEventListener('transitionend', done); };
      if (MG.utils && MG.utils.prefersReducedMotion()) this.hidden = true;
      else this.addEventListener('transitionend', done);
    }
  }
  if (!customElements.get('mg-modal')) customElements.define('mg-modal', MGModal);

  MG.modal = {
    open(id) { const m = document.getElementById(id); if (m && m.open) m.open(); },
    close(id) { const m = document.getElementById(id); if (m && m.close) m.close(); }
  };

  // Delegated open triggers anywhere on the page.
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-mg-modal-open]');
    if (trigger) { e.preventDefault(); MG.modal.open(trigger.getAttribute('data-mg-modal-open')); }
  });
})();
