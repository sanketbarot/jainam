/* ============================================
   JAY AMBE DECORATORS — SERVICES PAGE JS
   Green Glassmorphism Theme
   Colors updated for green — logic unchanged
   ============================================ */

'use strict';

(function () {

    let activeFilter = 'all';

    /* ============================================
       FILTER SERVICES
       ============================================ */
    window.filterServices = function (cat, btn) {
        if (activeFilter === cat) return;
        activeFilter = cat;

        /* Update buttons */
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });

        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }

        const cards = document.querySelectorAll('.service-detailed-card');
        let visible = 0;
        let delay   = 0;

        cards.forEach(card => {
            const cats = card.getAttribute('data-cat') || '';
            const show = cat === 'all' || cats.includes(cat);

            if (show) {
                card.classList.remove('hidden');
                card.style.display    = '';
                card.style.opacity    = '0';
                card.style.transform  = 'translateY(16px) scale(0.97)';
                card.style.transition =
                    'opacity 0.45s ease, transform 0.45s ease';

                const d = delay;
                setTimeout(() => {
                    card.style.opacity   = '1';
                    card.style.transform = '';
                }, d);

                delay   += 60;
                visible++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        /* No results */
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visible === 0 ? 'block' : 'none';
        }

        /* Scroll to services */
        if (cat !== 'all') {
            const sec     = document.getElementById('services');
            const filterH =
                document.querySelector('.services-filter-bar')?.offsetHeight || 0;
            const navH    =
                document.getElementById('navbar')?.offsetHeight || 58;

            if (sec) {
                setTimeout(() => {
                    const top =
                        sec.getBoundingClientRect().top +
                        window.scrollY - navH - filterH - 10;
                    window.scrollTo({ top, behavior: 'smooth' });
                }, 50);
            }
        }
    };

    /* ============================================
       INIT
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {
        checkUrlFilter();
        updateWhatsAppLinks();
        initProcessAnimation();
        initWhyStripAnimation();
        initCardTouch();
        initMobileFeatureExpand();
        initCardGlowEffect();
    });

    /* ---- URL filter param ---- */
    function checkUrlFilter() {
        const p   = new URLSearchParams(window.location.search);
        const cat = p.get('cat');
        if (cat) {
            const btn = document.querySelector(`[data-filter="${cat}"]`);
            if (btn) filterServices(cat, btn);
        }
    }

    /* ---- Dynamic WhatsApp links — green theme msg ---- */
    function updateWhatsAppLinks() {
        document.querySelectorAll('.service-detailed-card').forEach(card => {
            const waBtn = card.querySelector('.btn-wa');
            const name  = card.querySelector('h3')?.textContent?.trim();
            if (!waBtn || !name) return;

            const msg = encodeURIComponent(
                `Hi Jay Ambe Decorators! 🌿 I'm interested in ${name}. ` +
                `Please share details and pricing.`
            );
            waBtn.href = `https://wa.me/916358111321?text=${msg}`;
        });
    }

    /* ---- Process steps animation ---- */
    function initProcessAnimation() {
        const steps = document.querySelectorAll('.process-step');
        if (!steps.length) return;

        if (!('IntersectionObserver' in window)) {
            steps.forEach(s => {
                s.classList.add('animated');
                s.style.transition =
                    'opacity 0.55s ease, transform 0.55s ease';
            });
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                let i = 0;
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const delay = i * 130;
                    const el    = entry.target;
                    el.style.transition =
                        `opacity 0.55s ease ${delay}ms, ` +
                        `transform 0.55s ease ${delay}ms`;
                    el.classList.add('animated');
                    obs.unobserve(el);
                    i++;
                });
            },
            { threshold: 0.15 }
        );

        steps.forEach(s => obs.observe(s));
    }

    /* ---- Why strip animation ---- */
    function initWhyStripAnimation() {
        const items = document.querySelectorAll('.ws-item');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('animated'));
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                let i = 0;
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const delay = i * 90;
                    entry.target.style.transitionDelay = `${delay}ms`;
                    entry.target.classList.add('animated');
                    obs.unobserve(entry.target);
                    i++;
                });
            },
            { threshold: 0.2 }
        );

        items.forEach(item => obs.observe(item));
    }

    /* ---- Touch support for cards — green theme ---- */
    function initCardTouch() {
        if (!('ontouchstart' in window)) return;

        document.querySelectorAll('.service-detailed-card').forEach(card => {
            let timer;

            card.addEventListener('touchstart', () => {
                card.style.transform   = 'translateY(-4px) scale(0.99)';
                card.style.borderColor = 'rgba(16,185,129,0.30)';
                card.style.boxShadow   =
                    '0 8px 28px rgba(5,150,105,0.18)';
            }, { passive: true });

            card.addEventListener('touchend', () => {
                timer = setTimeout(() => {
                    card.style.transform   = '';
                    card.style.borderColor = '';
                    card.style.boxShadow   = '';
                }, 250);
            }, { passive: true });

            card.addEventListener('touchcancel', () => {
                clearTimeout(timer);
                card.style.transform   = '';
                card.style.borderColor = '';
                card.style.boxShadow   = '';
            }, { passive: true });
        });
    }

    /* ---- Mobile feature expand — green gradient text ---- */
    function initMobileFeatureExpand() {
        if (window.innerWidth > 768) return;

        document.querySelectorAll('.service-detailed-card').forEach(card => {
            const features = card.querySelector('.service-features');
            const body     = card.querySelector('.service-body');
            if (!features || !body) return;

            features.style.display = 'none';

            const btn = document.createElement('button');
            btn.className   = 'feature-expand-btn';
            btn.textContent = '▼ View Features';
            btn.style.cssText = `
                background: none;
                border: none;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                padding: 4px 0 8px;
                font-family: var(--font);
                display: block;
                -webkit-tap-highlight-color: transparent;
                background: linear-gradient(135deg, #10B981, #065F46);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            `;

            body.insertBefore(btn, features);

            let open = false;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                open = !open;
                features.style.display = open ? 'block' : 'none';
                btn.textContent = open ? '▲ Hide Features' : '▼ View Features';
            });
        });
    }

    /* ---- Glass card green glow effect (desktop) ---- */
    function initCardGlowEffect() {
        if ('ontouchstart' in window) return;
        if (window.innerWidth < 768) return;

        document.querySelectorAll('.service-detailed-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x    = e.clientX - rect.left;
                const y    = e.clientY - rect.top;

                /* Green spotlight */
                card.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(16,185,129,0.05) 0%,
                        transparent 60%
                    ),
                    rgba(255,255,255,0.88)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

})();