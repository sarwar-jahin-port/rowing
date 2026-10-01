'use strict';

/* ==========================================================================
   APP.JS — Core Application Logic
   Oar & Blade Portfolio Website

   Architecture:
   - IIFE to avoid global namespace pollution
   - IntersectionObserver for scroll reveals (no heavy libraries)
   - Passive event listeners where applicable
   - Graceful degradation for older browsers
   ========================================================================== */

(() => {
  /* -----------------------------------------------------------------------
     Scroll Reveal — IntersectionObserver
     Elements with class .reveal fade in when they enter the viewport.
     Once revealed, the observer disconnects that element (fire-once).
     ----------------------------------------------------------------------- */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length || !('IntersectionObserver' in window)) {
      /* Fallback: make everything visible immediately */
      reveals.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* -----------------------------------------------------------------------
     Smooth Scroll — Anchor Links
     Scrolls to the target section with native smooth behavior.
     Also closes mobile menu if open.
     ----------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height'),
        10
      ) || 72;

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });

      /* Close mobile menu if open */
      closeMobileMenu();
    });
  }

  /* -----------------------------------------------------------------------
     Navbar — Scroll State
     Adds .scrolled class when user scrolls past threshold.
     ----------------------------------------------------------------------- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const threshold = 50;

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > threshold);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    /* Run once on load in case page is already scrolled */
    onScroll();
  }

  /* -----------------------------------------------------------------------
     Mobile Menu — Toggle
     ----------------------------------------------------------------------- */
  function initMobileMenu() {
    const burger = document.getElementById('burger');
    if (!burger) return;

    burger.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.setAttribute('aria-hidden', String(!isOpen));
    });
  }

  function closeMobileMenu() {
    document.body.classList.remove('menu-open');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (menu) menu.setAttribute('aria-hidden', 'true');
  }

  /* -----------------------------------------------------------------------
     Current Year — Footer
     Dynamically inserts current year to avoid stale copyright.
     ----------------------------------------------------------------------- */
  function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------------
     Bootstrap — Initialize All Modules
     ----------------------------------------------------------------------- */
  function init() {
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCurrentYear();
  }

  /* Execute when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
