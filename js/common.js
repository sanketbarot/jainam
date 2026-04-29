/* ============================================
   JAY AMBE DECORATORS — COMMON JS
   Green Glassmorphism Theme
   Emerald #10B981 + Forest #022C22 + Mint #6EE7B7
   Performance Optimized | IIFE
   ============================================ */

'use strict';

(function () {

    /* ============================================
       STATE
       ============================================ */
    const state = {
        menuOpen:    false,
        scrollY:     0,
        ticking:     false,
        resizeTimer: null,
        cursorRAF:   null
    };

    /* ============================================
       INIT
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {
        initLoader();
        injectNavClose();
        setActiveNav();
        initMenuLinks();
        initReveal();
        initCounters();
        checkCookie();
        setFooterYear();
        initCursor();
        initNavOverlay();
        initKeyboard();
        initResize();
        initGlowEffect();
    });

    /* ============================================
       LOADER
       ============================================ */
    function initLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;
        setTimeout(() => loader.classList.add('hidden'), 450);
        setTimeout(() => {
            loader.style.display = 'none';
            loader.remove();
        }, 900);
    }

    /* ============================================
       INJECT CLOSE BTN
       ============================================ */
    function injectNavClose() {
        const nav = document.getElementById('navLinks');
        if (!nav) return;

        const existing = nav.querySelector('.nav-close-btn');
        if (existing) existing.remove();

        if (window.innerWidth > 768) return;

        const btn = document.createElement('button');
        btn.className = 'nav-close-btn';
        btn.setAttribute('aria-label', 'Close menu');
        btn.innerHTML = '✕';
        btn.addEventListener('click', window.closeMenu);
        nav.appendChild(btn);
    }

    /* ============================================
       ACTIVE NAV LINK
       ============================================ */
    function setActiveNav() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href === page || href === `./${page}`) {
                link.classList.add('active');
            }
        });
    }

    /* ============================================
       MENU LINKS
       ============================================ */
    function initMenuLinks() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ============================================
       SCROLL — RAF throttled
       ============================================ */
    window.addEventListener('scroll', () => {
        state.scrollY = window.scrollY;
        if (!state.ticking) {
            requestAnimationFrame(onScroll);
            state.ticking = true;
        }
    }, { passive: true });

    function onScroll() {
        const y   = state.scrollY;
        const nav = document.getElementById('navbar');
        if (nav) nav.classList.toggle('scrolled', y > 40);

        const btn = document.getElementById('scrollTop');
        if (btn) btn.style.display = y > 400 ? 'flex' : 'none';

        state.ticking = false;
    }

    /* ============================================
       REVEAL — IntersectionObserver
       ============================================ */
    function initReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll(
                '.reveal, .reveal-left, .reveal-right, .reveal-scale'
            ).forEach(el => el.classList.add('visible'));
            return;
        }

        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.07, rootMargin: '0px 0px -24px 0px' }
        );

        document.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .reveal-scale'
        ).forEach(el => obs.observe(el));
    }

    /* ============================================
       COUNTERS
       ============================================ */
    function initCounters() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.stat-number').forEach(el => {
                el.textContent =
                    (el.dataset.target || '0') + (el.dataset.suffix || '+');
            });
            return;
        }

        const obs = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll('.stat-number').forEach(n => obs.observe(n));
    }

    /* ============================================
       COOKIE CHECK
       ============================================ */
    function checkCookie() {
        if (localStorage.getItem('cookie_jay_ambe') === '1') {
            const b = document.getElementById('cookieBanner');
            if (b) b.style.display = 'none';
        }
    }

    /* ============================================
       FOOTER YEAR
       ============================================ */
    function setFooterYear() {
        document.querySelectorAll('.footer-year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }

    /* ============================================
       CURSOR — Green (desktop)
       ============================================ */
    function initCursor() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            ['cursor', 'cursorDot'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            return;
        }

        const cursor = document.getElementById('cursor');
        const dot    = document.getElementById('cursorDot');
        if (!cursor && !dot) return;

        let mX = 0, mY = 0, lagX = 0, lagY = 0;

        document.addEventListener('mousemove', e => {
            mX = e.clientX;
            mY = e.clientY;
            if (dot) {
                dot.style.transform = `translate(${mX - 2.5}px, ${mY - 2.5}px)`;
            }
        }, { passive: true });

        function moveCursor() {
            lagX += (mX - lagX) * 0.16;
            lagY += (mY - lagY) * 0.16;
            if (cursor) {
                cursor.style.transform =
                    `translate(${lagX - 11}px, ${lagY - 11}px)`;
            }
            state.cursorRAF = requestAnimationFrame(moveCursor);
        }

        moveCursor();

        /* Scale + green tint on hover */
        document.addEventListener('mouseover', e => {
            if (e.target.matches(
                'a, button, [role="button"], .service-card, .why-card'
            )) {
                if (cursor) {
                    cursor.style.transform += ' scale(1.5)';
                    cursor.style.borderColor = 'var(--green)';
                    cursor.style.opacity     = '0.85';
                }
            }
        });

        document.addEventListener('mouseout', e => {
            if (e.target.matches(
                'a, button, [role="button"], .service-card, .why-card'
            )) {
                if (cursor) {
                    cursor.style.borderColor = 'var(--emerald)';
                    cursor.style.opacity     = '0.5';
                }
            }
        });
    }

    /* ============================================
       GLOW EFFECT — Green spotlight
       ============================================ */
    function initGlowEffect() {
        if ('ontouchstart' in window) return;
        if (window.innerWidth < 768) return;

        const cards = document.querySelectorAll(
            '.service-card, .why-card, .glass-card, .why-about .wa-card'
        );

        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x    = e.clientX - rect.left;
                const y    = e.clientY - rect.top;
                const xPct = (x / rect.width  - 0.5) * 20;
                const yPct = (y / rect.height - 0.5) * 20;

                card.style.transform =
                    `perspective(600px) rotateX(${-yPct * 0.3}deg) ` +
                    `rotateY(${xPct * 0.3}deg) translateY(-4px)`;

                /* Green gradient spotlight */
                card.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(16,185,129,0.05) 0%,
                        transparent 60%
                    ),
                    var(--card, #FFFFFF)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform  = '';
                card.style.background = '';
            });
        });
    }

    /* ============================================
       NAV OVERLAY
       ============================================ */
    function initNavOverlay() {
        const overlay = document.getElementById('navOverlay');
        if (overlay) overlay.addEventListener('click', closeMenu);
    }

    /* ============================================
       KEYBOARD
       ============================================ */
    function initKeyboard() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && state.menuOpen) closeMenu();
        });
    }

    /* ============================================
       RESIZE
       ============================================ */
    function initResize() {
        window.addEventListener('resize', () => {
            clearTimeout(state.resizeTimer);
            state.resizeTimer = setTimeout(() => {
                injectNavClose();
                if (window.innerWidth > 768 && state.menuOpen) {
                    window.closeMenu();
                }
            }, 150);
        }, { passive: true });
    }

    /* ============================================
       GLOBAL FUNCTIONS
       ============================================ */

    window.toggleMenu = function () {
        state.menuOpen ? closeMenu() : openMenu();
    };

    function openMenu() {
        state.menuOpen = true;
        const nav     = document.getElementById('navLinks');
        const overlay = document.getElementById('navOverlay');
        const ham     = document.querySelector('.hamburger');

        if (nav)     nav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        if (ham) {
            ham.classList.add('open');
            ham.setAttribute('aria-expanded', 'true');
        }

        document.body.style.overflow = 'hidden';
        setTimeout(() => nav?.querySelector('a')?.focus(), 50);
    }

    window.closeMenu = function () {
        state.menuOpen = false;
        const nav     = document.getElementById('navLinks');
        const overlay = document.getElementById('navOverlay');
        const ham     = document.querySelector('.hamburger');

        if (nav)     nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        if (ham) {
            ham.classList.remove('open');
            ham.setAttribute('aria-expanded', 'false');
        }

        document.body.style.overflow = '';
    };

    window.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.closeCookie = function () {
        const b = document.getElementById('cookieBanner');
        if (b) {
            b.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            b.style.opacity    = '0';
            b.style.transform  = 'translateY(20px)';
            setTimeout(() => b.style.display = 'none', 320);
        }
        localStorage.setItem('cookie_jay_ambe', '1');
    };

    /* Counter animation — easeOutQuad */
    window.animateCounter = function (el) {
        const target   = parseInt(el.dataset.target)  || 0;
        const suffix   = el.dataset.suffix || '+';
        const duration = 1400;
        const start    = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - (1 - progress) * (1 - progress);
            el.textContent =
                Math.floor(eased * target) + (progress >= 1 ? suffix : '');
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    };

    /* FAQ toggle */
    window.toggleFaq = function (el) {
        const item   = el.parentElement;
        const isOpen = item.classList.contains('active');

        document.querySelectorAll('.faq-item')
            .forEach(f => f.classList.remove('active'));

        if (!isOpen) {
            item.classList.add('active');
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 50);
            }
        }
    };

    /* Book package */
    window.bookPackage = function (pkg) {
        window.location.href =
            `contact.html?package=${encodeURIComponent(pkg)}`;
    };

    /* Form validation */
    window.validateForm = function (fields) {
        for (const f of fields) {
            const el  = document.getElementById(f.id);
            if (!el) continue;
            const val = el.value.trim();

            if (!val) {
                showToast('⚠️ ' + f.msg, 'error');
                el.focus();
                shakeField(el);
                return false;
            }

            if (f.type === 'phone') {
                if (val.replace(/\D/g, '').length < 10) {
                    showToast('⚠️ Enter valid 10-digit phone!', 'error');
                    el.focus();
                    shakeField(el);
                    return false;
                }
            }

            if (f.type === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    showToast('⚠️ Enter a valid email address!', 'error');
                    el.focus();
                    shakeField(el);
                    return false;
                }
            }

            if (f.type === 'date') {
                const today = new Date().toISOString().split('T')[0];
                if (val < today) {
                    showToast('⚠️ Please select a future date!', 'error');
                    el.focus();
                    shakeField(el);
                    return false;
                }
            }
        }
        return true;
    };

    /* Shake invalid field */
    function shakeField(el) {
        /* Green border → Red on error */
        el.style.borderColor = '#EF4444';
        el.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.1)';
        el.style.animation   = 'shake 0.35s ease';

        if (!document.getElementById('shake-style')) {
            const s = document.createElement('style');
            s.id    = 'shake-style';
            s.textContent = `
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-5px); }
                    40%     { transform: translateX(5px); }
                    60%     { transform: translateX(-4px); }
                    80%     { transform: translateX(4px); }
                }
            `;
            document.head.appendChild(s);
        }

        setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow   = '';
            el.style.animation   = '';
        }, 2800);
    }

    /* Toast — Green themed */
    window.showToast = function (message, type = 'info') {
        document.querySelectorAll('.toast-notification')
            .forEach(t => t.remove());

        const colors = {
            success: 'linear-gradient(135deg, #10B981, #065F46)',
            error:   'linear-gradient(135deg, #EF4444, #DC2626)',
            info:    'linear-gradient(135deg, #059669, #047857)',
            warning: 'linear-gradient(135deg, #F59E0B, #D97706)'
        };

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 13px 22px;
            border-radius: 50px;
            background: ${colors[type] || colors.info};
            color: #FFFFFF;
            font-family: inherit;
            font-size: 13px;
            font-weight: 600;
            z-index: 10000;
            max-width: min(340px, calc(100vw - 40px));
            box-shadow: 0 8px 32px rgba(5,150,105,0.30),
                        0 2px 8px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            animation: slideInRight 0.3s ease;
            transition: opacity 0.3s ease, transform 0.3s ease;
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.15);
        `;
        toast.textContent = message;
        toast.addEventListener('click', () => dismiss(toast));
        document.body.appendChild(toast);
        setTimeout(() => dismiss(toast), 4000);
    };

    function dismiss(toast) {
        if (!toast.parentNode) return;
        toast.style.opacity   = '0';
        toast.style.transform = 'translateX(20px) scale(0.95)';
        setTimeout(() => toast.remove(), 300);
    }

    /* Newsletter subscribe */
    window.subscribeNewsletter = function () {
        const input = document.getElementById('newsletterEmail');
        if (!input) return;
        const email = input.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('⚠️ Please enter a valid email!', 'error');
            input.focus();
            return;
        }
        showToast('🌿 Thank you for subscribing!', 'success');
        input.value = '';
    };

})();