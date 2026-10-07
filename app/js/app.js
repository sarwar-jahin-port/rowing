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
     Theme Toggle
     ----------------------------------------------------------------------- */
  function initTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    // Listen for manual toggle
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {}
    });

    // Listen for system preference changes (if user hasn't forced a theme)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  /* -----------------------------------------------------------------------
     Bootstrap — Initialize All Modules
     ----------------------------------------------------------------------- */
  function init() {
    initTheme();
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


  /* ==========================================================================
     LIGHTBOX
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const btnClose = document.querySelector('.lightbox__close');
  const btnPrev = document.querySelector('.lightbox__nav--prev');
  const btnNext = document.querySelector('.lightbox__nav--next');
  
  if (lightbox && lightboxImg) {
    const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
    let currentIndex = 0;

    const openLightbox = (index) => {
      currentIndex = index;
      const imgSrc = portfolioCards[index].getAttribute('data-lightbox');
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300); // clear after transition
    };

    const showNext = (e) => {
      if (e) e.stopPropagation();
      currentIndex = (currentIndex + 1) % portfolioCards.length;
      lightboxImg.src = portfolioCards[currentIndex].getAttribute('data-lightbox');
    };

    const showPrev = (e) => {
      if (e) e.stopPropagation();
      currentIndex = (currentIndex - 1 + portfolioCards.length) % portfolioCards.length;
      lightboxImg.src = portfolioCards[currentIndex].getAttribute('data-lightbox');
    };

    portfolioCards.forEach((card, index) => {
      card.addEventListener('click', () => openLightbox(index));
    });

    if (btnClose) {
      btnClose.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === document.querySelector('.lightbox__content')) {
        closeLightbox();
      }
    });

    if (btnNext) btnNext.addEventListener('click', showNext);
    if (btnPrev) btnPrev.addEventListener('click', showPrev);

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

})();
