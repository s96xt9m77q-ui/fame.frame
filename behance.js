/* ──────────────────────────────────────────
   BEHANCE PORTFOLIO — behance.js
   Harsh Patel · London
────────────────────────────────────────── */

'use strict';

/* ── 1. CURSOR GLOW ── */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animate = () => {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.left = currentX + 'px';
    glow.style.top  = currentY + 'px';
    requestAnimationFrame(animate);
  };
  animate();
})();

/* ── 2. NAV SCROLL STATE ── */
(function () {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── 3. REVEAL ON SCROLL (IntersectionObserver) ── */
(function () {
  const targets = document.querySelectorAll(
    '.stats-bar, .project-card, .about-inner, .contact-inner, .section-header, .reveal'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ── 4. SMOOTH SCROLL FOR NAV LINKS ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── 5. PROJECT CARD TILT EFFECT ── */
(function () {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform =
        `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      card.style.transition = 'transform 0.1s ease, box-shadow 0.5s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease';
    });
  });
})();

/* ── 6. STATS COUNTER ANIMATION ── */
(function () {
  const statNums = document.querySelectorAll('.stat-num');

  const animateCount = (el) => {
    const raw = el.textContent.trim();
    const numMatch = raw.match(/\d+/);
    if (!numMatch) return;

    const end    = parseInt(numMatch[0]);
    const prefix = raw.slice(0, numMatch.index);
    const suffix = raw.slice(numMatch.index + numMatch[0].length);
    const duration = 1200;
    const start  = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = prefix + Math.round(eased * end) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.getElementById('statsBar');
  if (statsBar) observer.observe(statsBar);
})();

/* ── 7. TICKER PAUSE ON HOVER ── */
(function () {
  const ticker = document.getElementById('tickerWrap');
  if (!ticker) return;
  const track = ticker.querySelector('.ticker-track');

  ticker.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  ticker.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ── 8. STAGGER PROJECT CARDS ON LOAD ── */
(function () {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card, i) => {
    card.style.opacity  = '0';
    card.style.transform = 'translateY(40px)';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 120);
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(card);
  });
})();

/* ── 9. CONTACT BTN RIPPLE ── */
(function () {
  const btn = document.getElementById('contactBtn');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      background: rgba(201,169,110,0.2);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out;
      pointer-events: none;
    `;

    if (!document.getElementById('rippleStyle')) {
      const style = document.createElement('style');
      style.id = 'rippleStyle';
      style.textContent = `
        @keyframes rippleAnim {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
})();

/* ── 10. SKILL PILLS STAGGER ON HOVER ── */
(function () {
  const pills = document.querySelectorAll('.skill-pill');
  pills.forEach((pill, i) => {
    pill.style.transitionDelay = `${i * 30}ms`;
  });
})();

/* ── 11. HERO PARALLAX ── */
(function () {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    const offset  = scrollY * 0.15;
    heroName.style.transform = `translateY(${offset}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── PAGE LOADED ── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity    = '1';
  });
});
