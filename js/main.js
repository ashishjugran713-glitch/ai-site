(function () {
  'use strict';

  /* ─── Smooth Scroll ─── */
  const wrapper = document.getElementById('smooth-wrapper');
  const content = document.getElementById('smooth-content');
  let smoothTarget = 0;
  let smoothCurrent = 0;
  let smoothIdle = true;

  function resizeSmooth() {
    document.body.style.height = content.offsetHeight + 'px';
  }

  function smoothScroll() {
    smoothTarget = window.scrollY;
    const diff = smoothTarget - smoothCurrent;
    if (Math.abs(diff) > 0.5) {
      smoothCurrent += diff * 0.12;
      smoothIdle = false;
    } else {
      smoothCurrent = smoothTarget;
      smoothIdle = true;
    }
    wrapper.style.transform = 'translate3d(0, ' + (-smoothCurrent) + 'px, 0)';
    requestAnimationFrame(smoothScroll);
  }

  window.addEventListener('resize', resizeSmooth);
  window.addEventListener('load', function () { setTimeout(resizeSmooth, 100); });
  resizeSmooth();
  smoothScroll();

  /* ─── Scroll Progress Bar ─── */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    const h = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / h) * 100;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─── Custom Cursor ─── */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function cursorSmooth() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(cursorSmooth);
  }
  cursorSmooth();

  // Magnetic & hover effects
  document.querySelectorAll('a, button, [data-magnetic], [data-tilt]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', function () {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  /* ─── Canvas Particles (viewport overlay) ─── */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mousePX = -1000, mousePY = -1000;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', function () { resizeCanvas(); initParticles(); });

  document.addEventListener('mousemove', function (e) {
    mousePX = e.clientX;
    mousePY = e.clientY;
  });
  document.addEventListener('mouseleave', function () {
    mousePX = -1000;
    mousePY = -1000;
  });

  function initParticles() {
    const count = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;

      const dx = p.x - mousePX;
      const dy = p.y - mousePY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.x += dx * force * 0.015;
        p.y += dy * force * 0.015;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx2 = p.x - p2.x;
        const dy2 = p.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (dist2 < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(59, 130, 246, ' + (0.06 * (1 - dist2 / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();

  /* ─── Loader ─── */
  const loader = document.getElementById('loader');
  const loaderCount = document.getElementById('loaderCount');
  if (loader && loaderCount) {
    document.body.style.overflow = 'hidden';

    (function animateLoader() {
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        loaderCount.textContent = Math.round(eased * 100);
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          setTimeout(function () {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
          }, 500);
        }
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ─── Nav Scroll ─── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ─── Mobile Menu ─── */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── Progress-Based Reveal Engine ─── */
  // Uses smoothCurrent instead of IntersectionObserver for continuous, progress-based animations

  let revealCache = null;
  let splitCache = null;

  function cacheEls() {
    revealCache = document.querySelectorAll('[data-reveal]');
    splitCache = document.querySelectorAll('[data-split]');
  }
  cacheEls();

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function getRevealProgress(el) {
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    // 0 = bottom edge enters, 1 = top edge leaves
    const raw = 1 - (rect.top / winH);
    return clamp(raw, 0, 1);
  }

  function updateReveals() {
    if (!revealCache) return;
    const winH = window.innerHeight;

    revealCache.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top > winH || rect.bottom < 0) return;

      const raw = 1 - (rect.top / winH);
      const progress = clamp(raw, 0, 1);
      const delay = parseFloat(el.getAttribute('data-delay')) || 0;

      // Map progress through delay: animation only starts after delay, completes by 1
      const adjusted = clamp((progress - delay) / (1 - delay), 0, 1);
      const eased = easeOutCubic(adjusted);

      const type = el.getAttribute('data-reveal');
      if (type === 'up') {
        el.style.opacity = eased;
        el.style.transform = 'translateY(' + (50 * (1 - eased)) + 'px)';
      } else if (type === 'scale') {
        el.style.opacity = eased;
        el.style.transform = 'scale(' + (0.85 + 0.15 * eased) + ')';
      }
    });
  }

  /* ─── Split Text Animation ─── */
  function processSplitText() {
    splitCache.forEach(function (el) {
      if (el.dataset.splitProcessed) return;
      el.dataset.splitProcessed = 'true';
      const type = el.getAttribute('data-split');
      if (type === 'chars') {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) { nodes.push(walker.currentNode); }
        nodes.forEach(function (textNode) {
          const text = textNode.textContent;
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (c === ' ') {
              frag.appendChild(document.createTextNode(' '));
            } else {
              const span = document.createElement('span');
              span.className = 'split-char';
              span.textContent = c;
              frag.appendChild(span);
            }
          }
          textNode.parentNode.replaceChild(frag, textNode);
        });
        const chars = el.querySelectorAll('.split-char');
        chars.forEach(function (span, i) {
          span.style.transitionDelay = (i * 0.025) + 's';
        });
      }
    });
  }

  function updateSplitReveals() {
    if (!splitCache) return;

    splitCache.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.top > winH || rect.bottom < 0) return;

      const progress = clamp(1 - (rect.top / winH), 0, 1);
      const spans = el.querySelectorAll('.split-char, .split-word');

      spans.forEach(function (span) {
        const delay = parseFloat(span.style.transitionDelay) || 0;
        const spanProgress = clamp((progress - delay) / (1 - delay), 0, 1);
        if (spanProgress > 0) {
          span.classList.add('revealed');
        } else {
          span.classList.remove('revealed');
        }
      });
    });
  }

  /* ─── 3D Tilt ─── */
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ─── Magnetic Hover ─── */
  document.querySelectorAll('[data-magnetic]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
    });
  });

  /* ─── Card Glow Follow ─── */
  document.querySelectorAll('.service-card').forEach(function (card) {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.setProperty('--mx', x + '%');
      glow.style.setProperty('--my', y + '%');
    });
  });

  /* ─── Horizontal Scroll Section ─── */
  const workTrack = document.getElementById('workTrack');
  let workTrackWidth = 0;

  function updateWorkWidth() {
    if (workTrack) {
      workTrackWidth = workTrack.scrollWidth - window.innerWidth + 64;
    }
  }
  window.addEventListener('resize', updateWorkWidth);
  updateWorkWidth();

  // Watch work section scroll for horizontal translation
  const workSection = document.getElementById('work');

  function updateWorkScroll() {
    if (!workTrack || !workSection) return;
    const rect = workSection.getBoundingClientRect();
    const winH = window.innerHeight;
    const sectionH = workSection.offsetHeight;
    // Progress through section: -sectionH (top at bottom) to winH (bottom at top)
    const progress = clamp(1 - ((rect.top + sectionH) / (winH + sectionH)), 0, 1);
    const maxTranslate = Math.max(0, workTrackWidth);
    workTrack.style.transform = 'translate3d(' + (-progress * maxTranslate) + 'px, 0, 0)';
  }

  /* ─── Main Animation Loop ─── */
  function animateLoop() {
    updateReveals();
    updateSplitReveals();
    updateWorkScroll();
    initCountUps();
    updateParallax();
    updateStaggeredReveals();
    requestAnimationFrame(animateLoop);
  }

  // Process split text after a short delay (needs DOM ready)
  setTimeout(function () {
    processSplitText();
    resizeSmooth();
    initTypewriter();
    initTestimonials();
  }, 100);

  animateLoop();

  /* ─── Contact Form ─── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = 'Sent!';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = orig;
        btn.disabled = false;
        this.reset();
      }.bind(this), 2500);
    });
  }

  /* ─── Count-Up Animation ─── */
  function animateCountUp(el) {
    const text = el.textContent;
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;
    const suffix = text.replace(/[0-9.]/g, '');
    const isPct = suffix === '%';
    const duration = 2000;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = eased * num;
      el.textContent = (isPct ? current.toFixed(1) : Math.round(current)) + suffix;
      el.classList.add('animated');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCountUps() {
    document.querySelectorAll('.count-up:not(.counted)').forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80 && rect.bottom > 0) {
        el.classList.add('counted');
        animateCountUp(el);
      }
    });
  }

  /* ─── Parallax Float Orbs ─── */
  function updateParallax() {
    const orbs = document.querySelectorAll('.float-orb');
    if (!orbs.length) return;
    const sy = window.scrollY;
    orbs.forEach(function (orb) {
      const speed = parseFloat(orb.getAttribute('data-speed')) || 0.03;
      orb.style.transform = 'translate3d(0, ' + (sy * speed) + 'px, 0)';
    });
  }

  /* ─── Staggered Reveal ─── */
  function updateStaggeredReveals() {
    document.querySelectorAll('[data-reveal-stagger]').forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60 && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });
  }

  /* ─── Back to Top Button ─── */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) { backToTop.classList.add('visible'); }
      else { backToTop.classList.remove('visible'); }
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Typewriter Effect ─── */
  function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;
    const words = JSON.parse(el.getAttribute('data-words') || '[]');
    if (!words.length) return;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.after(cursor);

    function type() {
      const current = words[wordIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }
      let speed = isDeleting ? 30 : 60;
      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
      }
      setTimeout(type, speed);
    }
    type();
  }

  /* ─── Testimonial Rotator ─── */
  function initTestimonials() {
    const rotator = document.getElementById('testimonialRotator');
    if (!rotator) return;
    const slides = rotator.querySelectorAll('.testimonial-slide');
    if (slides.length < 2) return;
    const dots = rotator.querySelectorAll('.testimonial-dot');
    let current = 0;
    let interval;

    function showSlide(index) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      slides[index].classList.add('active');
      if (dots[index]) dots[index].classList.add('active');
      current = index;
    }

    function nextSlide() { showSlide((current + 1) % slides.length); }

    function startAuto() { interval = setInterval(nextSlide, 4000); }
    function stopAuto() { clearInterval(interval); }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAuto();
        showSlide(i);
        startAuto();
      });
    });

    startAuto();
  }

  /* ─── Recalc on resize ─── */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resizeSmooth();
      updateWorkWidth();
      cacheEls();
    }, 200);
  });

  /* ─── Hash nav smooth jump ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + smoothCurrent;
        window.scrollTo({ top: top - 80, behavior: 'smooth' });
        updateProgress();
      }
    });
  });

})();
