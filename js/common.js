/* ============================================
   JAY AMBE DECORATORS - COMMON JS
   ============================================ */

(function () {
    'use strict';

    // ========== FAST LOADER ==========
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Hide loader fast
        const loader = document.getElementById('loader');
        if (loader) {
            requestAnimationFrame(() => {
                setTimeout(() => loader.classList.add('hidden'), 400);
                setTimeout(() => {
                    loader.style.display = 'none';
                    document.body.style.overflow = '';
                }, 800);
            });
        }

        // Set active nav link
        setActiveNav();

        // Init menu close on link click
        initMenuLinks();

        // Init scroll reveal
        initReveal();

        // Init counters
        initCounters();

        // Check cookie
        checkCookie();

        // Hide cursor on touch devices
        hideCursorOnTouch();

        // Set current year in footer
        setFooterYear();
    }

    // ========== ACTIVE NAV ==========
    function setActiveNav() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === page) {
                link.classList.add('active');
            }
        });
    }

    // ========== MENU LINKS ==========
    function initMenuLinks() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    // ========== SCROLL REVEAL ==========
    function initReveal() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.06,
            rootMargin: '0px 0px -20px 0px'
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // ========== COUNTERS ==========
    function initCounters() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.stat-number').forEach(el => {
                const target = parseInt(el.getAttribute('data-target')) || 0;
                const suffix = el.getAttribute('data-suffix') || '+';
                el.textContent = target + suffix;
            });
            return;
        }

        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number').forEach(n => counterObs.observe(n));
    }

    // ========== COOKIE ==========
    function checkCookie() {
        if (localStorage.getItem('cookie_jay_ambe') === 'accepted') {
            const b = document.getElementById('cookieBanner');
            if (b) b.style.display = 'none';
        }
    }

    // ========== HIDE CURSOR ON TOUCH ==========
    function hideCursorOnTouch() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            const cursor = document.getElementById('cursor');
            const dot = document.getElementById('cursorDot');
            if (cursor) cursor.style.display = 'none';
            if (dot) dot.style.display = 'none';
        }
    }

    // ========== FOOTER YEAR ==========
    function setFooterYear() {
        document.querySelectorAll('.footer-year').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    }

    // ========== SCROLL EVENTS ==========
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar shrink
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 40);
        }

        // Scroll to top button
        const btn = document.getElementById('scrollTop');
        if (btn) {
            btn.style.display = scrollY > 400 ? 'block' : 'none';
        }
    }

    // ========== GLOBAL FUNCTIONS ==========

    // Toggle Menu
    window.toggleMenu = function () {
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('navOverlay');

        if (navLinks) navLinks.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');

        // Prevent body scroll when menu open
        document.body.style.overflow =
            navLinks && navLinks.classList.contains('active') ? 'hidden' : '';
    };

    // Close Menu
    window.closeMenu = function () {
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('navOverlay');

        if (navLinks) navLinks.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Scroll To Top
    window.scrollToTop = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Close Cookie
    window.closeCookie = function () {
        const b = document.getElementById('cookieBanner');
        if (b) {
            b.style.opacity = '0';
            b.style.transform = 'translateY(100%)';
            setTimeout(() => b.style.display = 'none', 300);
        }
        localStorage.setItem('cookie_jay_ambe', 'accepted');
    };

    // Counter Animation
    window.animateCounter = function (el) {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '+';
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quad
            const ease = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(ease * target);

            el.textContent = current + (progress >= 1 ? suffix : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    };

    // FAQ Toggle
    window.toggleFaq = function (el) {
        const item = el.parentElement;
        const isOpen = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.faq-item').forEach(f => {
            f.classList.remove('active');
        });

        // Open clicked if wasn't open
        if (!isOpen) {
            item.classList.add('active');
        }
    };

    // Book Package
    window.bookPackage = function (pkg) {
        window.location.href = `contact.html?package=${encodeURIComponent(pkg)}`;
    };

    // Newsletter Subscribe
    window.subscribeNewsletter = function () {
        const input = document.getElementById('newsletterEmail');
        if (!input) return;

        const email = input.value.trim();
        if (!email || !email.includes('@') || !email.includes('.')) {
            showToast('⚠️ Please enter a valid email!', 'error');
            return;
        }

        showToast('🎉 Thank you for subscribing!', 'success');
        input.value = '';
    };

    // Form Validation
    window.validateForm = function (fields) {
        for (const f of fields) {
            const el = document.getElementById(f.id);
            if (!el) continue;

            const val = el.value.trim();

            // Required check
            if (!val) {
                showToast('⚠️ ' + f.msg, 'error');
                el.focus();
                highlightField(el);
                return false;
            }

            // Phone validation
            if (f.type === 'phone') {
                const digits = val.replace(/\D/g, '');
                if (digits.length < 10) {
                    showToast('⚠️ Please enter valid 10-digit phone!', 'error');
                    el.focus();
                    highlightField(el);
                    return false;
                }
            }

            // Email validation
            if (f.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                    showToast('⚠️ Please enter valid email!', 'error');
                    el.focus();
                    highlightField(el);
                    return false;
                }
            }

            // Date validation
            if (f.type === 'date') {
                const today = new Date().toISOString().split('T')[0];
                if (val < today) {
                    showToast('⚠️ Please select a future date!', 'error');
                    el.focus();
                    highlightField(el);
                    return false;
                }
            }
        }
        return true;
    };

    // Highlight invalid field
    function highlightField(el) {
        el.style.borderColor = 'var(--red)';
        el.style.boxShadow = '0 0 0 3px rgba(220,53,69,0.1)';
        setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
        }, 3000);
    }

    // Toast Notification
    window.showToast = function (message, type) {
        // Remove existing toast
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 14px 22px;
            border-radius: 10px;
            color: white;
            font-size: 13px;
            font-weight: 600;
            font-family: var(--font);
            z-index: 10000;
            animation: fadeInDown 0.3s ease;
            max-width: 350px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            backdrop-filter: blur(10px);
            background: ${type === 'success'
                ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                : type === 'error'
                    ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                    : 'linear-gradient(135deg, #3498db, #2980b9)'};
        `;
        toast.textContent = message;
        toast.onclick = () => {
            toast.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        };

        document.body.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-10px)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    };

    // ========== CURSOR (Desktop) ==========
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function updateCursor() {
            const cursor = document.getElementById('cursor');
            const dot = document.getElementById('cursorDot');

            if (cursor) {
                dotX += (cursorX - dotX) * 0.15;
                dotY += (cursorY - dotY) * 0.15;
                cursor.style.transform = `translate(${dotX - 10}px, ${dotY - 10}px)`;
            }

            if (dot) {
                dot.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px)`;
            }

            requestAnimationFrame(updateCursor);
        }

        requestAnimationFrame(updateCursor);
    }

    // ========== ESCAPE KEY ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // ========== CLOSE MENU ON RESIZE ==========
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        }, 150);
    });

})();