/**
 * Home page enhancements: navbar scroll state, scroll reveals, footer year and
 * the category pills that drive the search bar.
 *
 * Loaded after shop.js. The shared `farmfresh:ready` event has already fired by
 * then, so this script initialises directly instead of waiting for it.
 */
(function () {
    'use strict';
  
    /* Navbar shrinks once the hero starts scrolling away. */
    function initNavScroll() {
      const nav = document.querySelector('.modern-nav');
      if (!nav) return;
  
      const sync = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
      sync();
      window.addEventListener('scroll', sync, { passive: true });
    }
  
    /* Reveal sections as they enter the viewport. */
    function initReveal() {
      const targets = document.querySelectorAll('.home .reveal');
      if (!targets.length) return;
  
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || !('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-visible'));
        return;
      }
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
      );
  
      targets.forEach((el) => observer.observe(el));
    }
  
    function initFooterYear() {
      const el = document.getElementById('footerYear');
      if (el) el.textContent = String(new Date().getFullYear());
    }
  
    initNavScroll();
    initReveal();
    initFooterYear();
  })();
  