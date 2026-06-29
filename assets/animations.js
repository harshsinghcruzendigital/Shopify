/* ============================================================
   Madrishi Global — animations.js
   ONE shared IntersectionObserver for scroll-reveal across the
   whole theme. Any element with [data-mg-animate-section] gets
   .is-revealed when it scrolls into view. Respects reduced motion
   and re-scans on Theme Editor section loads. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  const reduced = window.MG ? MG.utils.prefersReducedMotion() : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SELECTOR = '[data-mg-animate-section]';

  function revealAll(root) {
    (root || document).querySelectorAll(SELECTOR).forEach((el) => el.classList.add('is-revealed'));
  }

  // Reduced motion or no IO support: reveal everything immediately.
  if (reduced || !('IntersectionObserver' in window)) {
    document.addEventListener('DOMContentLoaded', () => revealAll());
    if (window.MG && MG.events) MG.events.on('section:load', (d) => revealAll(d && d.target));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  function observe(root) {
    (root || document).querySelectorAll(SELECTOR + ':not(.is-revealed)').forEach((el) => io.observe(el));
  }

  if (document.readyState !== 'loading') observe();
  else document.addEventListener('DOMContentLoaded', () => observe());

  // Theme Editor: re-scan a freshly loaded section.
  if (window.MG && MG.events) MG.events.on('section:load', (d) => observe(d && d.target ? d.target : document));
})();
