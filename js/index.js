/* ============================================
   JAY AMBE DECORATORS — INDEX PAGE JS
   Colors handled in CSS — JS stays same
   ============================================ */

'use strict';

(function () {

    /* ============================================
       HERO SLIDER
       ============================================ */
    const heroEl     = document.querySelector('.hero');
    const slidesEl   = document.getElementById('heroSlides');
    const dotsEl     = document.getElementById('heroDots');
    const slideNodes = document.querySelectorAll('.hero-slide');
    const total      = slideNodes.length;

    let current   = 0;
    let autoTimer = null;
    let animLock  = false;
    let touchX    = 0;
    let touchY    = 0;

    /* Build dots */
    if (total > 1 && dotsEl) {
        slideNodes.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', `Slide ${i + 1}`);
            btn.setAttribute('role', 'tab');
            btn.addEventListener('click', () => {
                goTo(i);
                restartAuto(8000);
            });
            dotsEl.appendChild(btn);
        });
    }

    function goTo(n) {
        if (animLock || n === current) return;
        animLock = true;
        current  = ((n % total) + total) % total;
        if (slidesEl) slidesEl.style.transform = `translateX(-${current * 100}%)`;
        dotsEl?.querySelectorAll('.hero-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
            d.setAttribute('aria-selected', String(i === current));
        });
        setTimeout(() => { animLock = false; }, 750);
    }

    window.changeSlide = function (dir) {
        goTo(current + dir);
        restartAuto(8000);
    };

    function startAuto(delay = 5000) {
        stopAuto();
        if (total > 1) autoTimer = setInterval(() => goTo(current + 1), delay);
    }

    function stopAuto() { clearInterval(autoTimer); autoTimer = null; }

    function restartAuto(delay = 5000) { stopAuto(); startAuto(delay); }

    heroEl?.addEventListener('mouseenter', stopAuto);
    heroEl?.addEventListener('mouseleave', () => startAuto());
    heroEl?.addEventListener('focusin', stopAuto);
    heroEl?.addEventListener('focusout', () => startAuto());

    heroEl?.addEventListener('touchstart', e => {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    }, { passive: true });

    heroEl?.addEventListener('touchend', e => {
        const dx = touchX - e.changedTouches[0].clientX;
        const dy = touchY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
            goTo(current + (dx > 0 ? 1 : -1));
            restartAuto(9000);
        }
    }, { passive: true });

    document.addEventListener('keydown', e => {
        if (!document.activeElement?.closest('.hero')) return;
        if (e.key === 'ArrowLeft')  { goTo(current - 1); stopAuto(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); stopAuto(); }
    });

    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopAuto() : startAuto();
    });

    startAuto();

    /* ============================================
       TESTIMONIAL SLIDER
       ============================================ */
    const tTrack  = document.getElementById('testimonialTrack');
    const tDotsEl = document.getElementById('testimonialDots');
    const tCards  = document.querySelectorAll('.testimonial-card');
    const tTotal  = tCards.length;

    let tCurrent = 0;
    let tTimer   = null;
    let tTouchX  = 0;

    if (tTotal > 1 && tDotsEl) {
        tCards.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 't-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', `Review ${i + 1}`);
            btn.addEventListener('click', () => {
                goToT(i);
                restartTAuto(9000);
            });
            tDotsEl.appendChild(btn);
        });
    }

    function goToT(n) {
        tCurrent = ((n % tTotal) + tTotal) % tTotal;
        if (tTrack) tTrack.style.transform = `translateX(-${tCurrent * 100}%)`;
        tDotsEl?.querySelectorAll('.t-dot').forEach((d, i) => {
            d.classList.toggle('active', i === tCurrent);
        });
    }

    window.changeTestimonial = function (dir) {
        goToT(tCurrent + dir);
        restartTAuto(9000);
    };

    function startTAuto(d = 4500) {
        stopTAuto();
        if (tTotal > 1) tTimer = setInterval(() => goToT(tCurrent + 1), d);
    }

    function stopTAuto()     { clearInterval(tTimer); tTimer = null; }
    function restartTAuto(d) { stopTAuto(); startTAuto(d); }

    const tSlider = document.querySelector('.testimonial-slider');
    tSlider?.addEventListener('touchstart', e => {
        tTouchX = e.touches[0].clientX;
    }, { passive: true });

    tSlider?.addEventListener('touchend', e => {
        const diff = tTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            goToT(tCurrent + (diff > 0 ? 1 : -1));
            restartTAuto(9000);
        }
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopTAuto() : startTAuto();
    });

    startTAuto();

    /* ============================================
       SMOOTH ANCHOR SCROLL
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = (document.getElementById('navbar')?.offsetHeight || 58) + 12;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ============================================
       LAZY LOAD
       ============================================ */
    if ('IntersectionObserver' in window) {
        const imgObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const img = entry.target;
                const src = img.dataset.src;
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    imgObs.unobserve(img);
                }
            });
        }, { rootMargin: '250px' });
        document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
    }

    /* ============================================
       TOUCH CARD FIX
       ============================================ */
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card, .why-card').forEach(card => {
            let timer;
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            }, { passive: true });
            card.addEventListener('touchend', () => {
                timer = setTimeout(() => card.classList.remove('touch-active'), 300);
            }, { passive: true });
            card.addEventListener('touchcancel', () => {
                clearTimeout(timer);
                card.classList.remove('touch-active');
            }, { passive: true });
        });

        const s = document.createElement('style');
        s.textContent = `
            .service-card.touch-active { transform: translateY(-4px); }
            .service-card.touch-active::before { transform: scaleX(1) !important; }
            .why-card.touch-active { transform: translateY(-3px); }
            .why-card.touch-active::after { transform: scaleX(1) !important; }
        `;
        document.head.appendChild(s);
    }

})();