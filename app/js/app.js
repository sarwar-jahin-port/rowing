'use strict';

(() => {

  /* -----------------------------------------------------------------------
     Scroll Reveal
     ----------------------------------------------------------------------- */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length || !('IntersectionObserver' in window)) {
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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  /* -----------------------------------------------------------------------
     Smooth Scroll
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
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
      closeMobileMenu();
    });
  }

  /* -----------------------------------------------------------------------
     Navbar Scroll State
     ----------------------------------------------------------------------- */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -----------------------------------------------------------------------
     Mobile Menu
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
     Current Year
     ----------------------------------------------------------------------- */
  function initCurrentYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------------
     Theme Toggle
     ----------------------------------------------------------------------- */
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      try { localStorage.setItem('theme', newTheme); } catch (e) {}
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  /* -----------------------------------------------------------------------
     Generic Lightbox factory
     One lightbox element, multiple trigger groups — each group registers
     its own click handlers but shares one close/nav/keyboard binding.
     ----------------------------------------------------------------------- */
  function makeLightbox({ lightboxEl, imgEl, counterEl, srcAttr = 'data-lightbox' }) {
    if (!lightboxEl || !imgEl) return;

    let activeTriggers = [];
    let current = 0;

    const open = (triggers, idx) => {
      activeTriggers = triggers;
      current = ((idx % triggers.length) + triggers.length) % triggers.length;
      imgEl.src = activeTriggers[current].getAttribute(srcAttr);
      if (counterEl) counterEl.textContent = `${String(current + 1).padStart(2, '0')} / ${activeTriggers.length}`;
      lightboxEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const nav = (delta) => {
      if (!activeTriggers.length) return;
      current = ((current + delta) % activeTriggers.length + activeTriggers.length) % activeTriggers.length;
      imgEl.src = activeTriggers[current].getAttribute(srcAttr);
      if (counterEl) counterEl.textContent = `${String(current + 1).padStart(2, '0')} / ${activeTriggers.length}`;
    };

    const close = () => {
      lightboxEl.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { imgEl.src = ''; }, 300);
    };

    lightboxEl.querySelector('[class*="close"]')?.addEventListener('click', close);
    lightboxEl.querySelector('[class*="prev"]')?.addEventListener('click', (e) => { e.stopPropagation(); nav(-1); });
    lightboxEl.querySelector('[class*="next"]')?.addEventListener('click', (e) => { e.stopPropagation(); nav(1); });
    lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) close(); });

    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nav(1);
      if (e.key === 'ArrowLeft') nav(-1);
    });

    /* Returns a register function — call once per trigger group */
    return (triggers) => {
      triggers.forEach((el, i) => el.addEventListener('click', () => open(triggers, i)));
    };
  }

  /* -----------------------------------------------------------------------
     Single-trigger-group lightbox (comments etc)
     ----------------------------------------------------------------------- */
  function makeSimpleLightbox({ lightboxEl, imgEl, counterEl, triggers, srcAttr = 'data-src' }) {
    if (!lightboxEl || !imgEl || !triggers.length) return;
    let current = 0;

    const open = (idx) => {
      current = ((idx % triggers.length) + triggers.length) % triggers.length;
      imgEl.src = triggers[current].getAttribute(srcAttr);
      if (counterEl) counterEl.textContent = `${String(current + 1).padStart(2, '0')} / ${triggers.length}`;
      lightboxEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const nav = (delta) => open(current + delta);

    const close = () => {
      lightboxEl.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { imgEl.src = ''; }, 300);
    };

    triggers.forEach((el, i) => el.addEventListener('click', () => open(i)));
    lightboxEl.querySelector('[class*="close"]')?.addEventListener('click', close);
    lightboxEl.querySelector('[class*="prev"]')?.addEventListener('click', (e) => { e.stopPropagation(); nav(-1); });
    lightboxEl.querySelector('[class*="next"]')?.addEventListener('click', (e) => { e.stopPropagation(); nav(1); });
    lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') nav(1);
      if (e.key === 'ArrowLeft') nav(-1);
    });
  }

  /* -----------------------------------------------------------------------
     Horizontal scroll nav helper
     ----------------------------------------------------------------------- */
  function makeScrollNav({ trackId, prevId, nextId, cardWidth = 320, counterId, total }) {
    const track = document.getElementById(trackId);
    const prev  = document.getElementById(prevId);
    const next  = document.getElementById(nextId);
    const counter = document.getElementById(counterId);
    if (!track) return;

    const updateCounter = () => {
      if (!counter || !total) return;
      const idx = Math.round(track.scrollLeft / cardWidth) + 1;
      const clamped = Math.min(Math.max(idx, 1), total);
      counter.textContent = `${String(clamped).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    };

    if (next) next.addEventListener('click', () => track.scrollBy({ left: cardWidth, behavior: 'smooth' }));
    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -cardWidth, behavior: 'smooth' }));
    track.addEventListener('scroll', updateCounter, { passive: true });
  }

  /* -----------------------------------------------------------------------
     Bootstrap
     ----------------------------------------------------------------------- */
  function init() {
    initTheme();
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initCurrentYear();

    /* Shared portfolio/analytics lightbox — one overlay, two groups */
    const registerGroup = makeLightbox({
      lightboxEl: document.getElementById('lightbox'),
      imgEl:      document.getElementById('lightbox-img'),
      counterEl:  document.getElementById('lightbox-counter'),
    });
    if (registerGroup) {
      registerGroup(Array.from(document.querySelectorAll('.post-card[data-lightbox]')));
      registerGroup(Array.from(document.querySelectorAll('.analytics-card[data-lightbox]')));
    }

    /* Wire sp-card data-src from their img src */
    document.querySelectorAll('.sp-card').forEach(card => {
      const img = card.querySelector('img');
      if (img) card.setAttribute('data-src', img.src);
    });

    /* Comments lightbox */
    makeSimpleLightbox({
      lightboxEl: document.getElementById('spLightbox'),
      imgEl:      document.getElementById('sp-lightbox-img'),
      counterEl:  document.getElementById('sp-lightbox-counter'),
      triggers:   Array.from(document.querySelectorAll('.sp-card')),
      srcAttr:    'data-src',
    });

    /* Portfolio scroll nav */
    makeScrollNav({
      trackId:   'portfolioTrack',
      prevId:    'portfolioPrev',
      nextId:    'portfolioNext',
      cardWidth:  320,
      counterId: 'portfolioCounter',
      total:      19,
    });

    /* Analytics scroll nav */
    makeScrollNav({
      trackId:   'analyticsTrack',
      prevId:    'analyticsPrev',
      nextId:    'analyticsNext',
      cardWidth:  360,
      counterId: 'analyticsCounter',
      total:      13,
    });

    /* Reels scroll nav */
    makeScrollNav({
      trackId:   'reelsTrack',
      prevId:    'reelsPrev',
      nextId:    'reelsNext',
      cardWidth:  260,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
