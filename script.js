/* ═══════════════════════════════════════════════════════════════════════
   Masnaf Trading Co. — script.js
   ─ Lazy image loading
   ─ Sticky nav (transparent → solid on scroll)
   ─ Intersection Observer scroll-reveal
   ─ Mobile menu toggle
   ─ Smooth active nav link highlighting
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Lazy Image Loading ─────────────────────────────────────────────── */
  const lazyImages = document.querySelectorAll('img.deferred[data-src]');

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.remove('deferred');
        imgObserver.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback: load all immediately
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  /* ── Sticky Nav ─────────────────────────────────────────────────────── */
  const nav = document.getElementById('main-nav');

  const updateNav = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load

  /* ── Scroll-Reveal ──────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Stagger reveal for multi-child groups ──────────────────────────── */
  document.querySelectorAll('.dishes-trio, .branch-grid, .social-row').forEach(parent => {
    const children = parent.querySelectorAll('.dish-card, .branch-card, .social-icon');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
      child.classList.add('reveal');
      revealObserver.observe(child);
    });
  });

  /* ── Mobile Menu Toggle ─────────────────────────────────────────────── */
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active Nav Link on Scroll ─────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('#nav-links a[href^="#"]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

  /* ── Parallax (lightweight) ─────────────────────────────────────────── */
  const parallaxImgs = document.querySelectorAll('.parallax');

  const doParallax = () => {
    parallaxImgs.forEach(img => {
      const rect   = img.parentElement.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * 0.12;
      img.style.transform = `translateY(${offset}px) scale(1.08)`;
    });
  };

  if (parallaxImgs.length > 0) {
    window.addEventListener('scroll', doParallax, { passive: true });
    doParallax();
  }

});
