/* ============================================
   JAY AMBE DECORATORS — PACKAGES PAGE JS
   Lavender + Blue + Violet | Glassmorphism
   ============================================ */

'use strict';

(function () {

    let activeFilter = 'all';

    /* ============================================
       PACKAGE FILTER
       ============================================ */
    window.filterPackages = function (type, btn) {
        if (activeFilter === type) return;
        activeFilter = type;

        /* Update buttons */
        document.querySelectorAll('.pkg-filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });

        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        }

        /* Filter cards with stagger */
        const cards = document.querySelectorAll('.package-card');
        let count   = 0;

        cards.forEach(card => {
            const cats = card.getAttribute('data-pkg') || '';
            const show = type === 'all' || cats.includes(type);

            if (show) {
                card.style.display   = '';
                card.style.opacity   = '0';
                card.style.transform = 'scale(0.95) translateY(12px)';

                const isPopular = card.classList.contains('popular');
                const d = count;

                setTimeout(() => {
                    card.style.transition =
                        'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity   = '1';
                    card.style.transform = isPopular
                        ? 'translateY(-8px)'
                        : 'translateY(0)';
                    count++;
                }, d * 70);

            } else {
                card.style.opacity   = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => { card.style.display = 'none'; }, 300);
            }
        });
    };

    /* ============================================
       BOOK PACKAGE
       ============================================ */
    window.bookPackage = function (pkg) {
        window.location.href =
            `contact.html?package=${encodeURIComponent(pkg)}`;
    };

    /* ============================================
       INIT
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {
        checkUrlFilter();
        updateWhatsAppLinks();
        initCardHovers();
        initTableScrollHint();
        initTableRowHover();
        initTouchSupport();
        initCardReveal();
    });

    /* ---- URL filter param ---- */
    function checkUrlFilter() {
        const p   = new URLSearchParams(window.location.search);
        const pkg = p.get('highlight');
        if (!pkg) return;

        const map = { wedding: 'wedding', birthday: 'birthday', corporate: 'corporate' };
        const f   = map[pkg.toLowerCase()];
        if (f) {
            const btn = document.querySelector(`[data-filter="${f}"]`);
            if (btn) filterPackages(f, btn);
        }
    }

    /* ---- Dynamic WhatsApp links ---- */
    function updateWhatsAppLinks() {
        document.querySelectorAll('.pkg-wa-btn').forEach(btn => {
            const card = btn.closest('.package-card');
            const name = card?.querySelector('h3')?.textContent?.trim();
            if (!name) return;

            const msg = encodeURIComponent(
                `Hi Jay Ambe Decorators! I'm interested in the ${name} package. Please share details.`
            );
            btn.href = `https://wa.me/916358111321?text=${msg}`;
        });
    }

    /* ---- Card hover effects ---- */
    function initCardHovers() {
        if ('ontouchstart' in window) return;

        document.querySelectorAll('.package-card').forEach(card => {
            const isPopular = card.classList.contains('popular');

            card.addEventListener('mouseenter', () => {
                if (!isPopular) {
                    card.style.borderColor = 'rgba(139,92,246,0.3)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!isPopular) {
                    card.style.borderColor = '';
                }
            });

            /* Subtle glass shine effect */
            if (!isPopular) {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x    = e.clientX - rect.left;
                    const y    = e.clientY - rect.top;

                    card.style.background = `
                        radial-gradient(
                            circle at ${x}px ${y}px,
                            rgba(139,92,246,0.06) 0%,
                            transparent 60%
                        ),
                        rgba(255,255,255,0.05)
                    `;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.background = '';
                    card.style.borderColor = '';
                });
            }
        });
    }

    /* ---- Table scroll hint ---- */
    function initTableScrollHint() {
        const tableWrap = document.querySelector('.compare-table-wrap');
        if (!tableWrap) return;

        if (tableWrap.scrollWidth > tableWrap.clientWidth) {
            const hint = document.createElement('div');
            hint.style.cssText = `
                text-align: center;
                font-size: 11px;
                color: var(--text-light);
                margin-top: 8px;
                font-weight: 500;
                opacity: 1;
                transition: opacity 0.3s ease;
            `;
            hint.textContent = '← Scroll to see full table →';
            tableWrap.parentNode.insertBefore(hint, tableWrap.nextSibling);

            tableWrap.addEventListener('scroll', () => {
                hint.style.opacity = '0';
            }, { once: true, passive: true });
        }
    }

    /* ---- Table row hover highlight ---- */
    function initTableRowHover() {
        document.querySelectorAll('.compare-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.querySelectorAll('td').forEach(cell => {
                    if (!cell.classList.contains('ct-feature')) {
                        cell.style.fontWeight = '600';
                    }
                });
            });

            row.addEventListener('mouseleave', () => {
                row.querySelectorAll('td').forEach(cell => {
                    cell.style.fontWeight = '';
                });
            });
        });
    }

    /* ---- Touch support ---- */
    function initTouchSupport() {
        if (!('ontouchstart' in window)) return;

        document.querySelectorAll('.package-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                if (!card.classList.contains('popular')) {
                    card.style.transform   = 'translateY(-5px)';
                    card.style.borderColor = 'rgba(139,92,246,0.3)';
                    card.style.boxShadow   = 'var(--sh-glow)';
                }
            }, { passive: true });

            card.addEventListener('touchend', () => {
                if (!card.classList.contains('popular')) {
                    setTimeout(() => {
                        card.style.transform   = '';
                        card.style.borderColor = '';
                        card.style.boxShadow   = '';
                    }, 300);
                }
            }, { passive: true });
        });
    }

    /* ---- Card scroll reveal ---- */
    function initCardReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.package-card').forEach(card => {
                card.style.opacity   = '1';
                card.style.transform = card.classList.contains('popular')
                    ? 'translateY(-8px)' : 'translateY(0)';
            });
            return;
        }

        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (!entry.isIntersecting) return;

                const isPopular = entry.target.classList.contains('popular');

                setTimeout(() => {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = isPopular
                        ? 'translateY(-8px)' : 'translateY(0)';
                }, i * 100);

                obs.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.package-card').forEach(card => {
            card.style.opacity    = '0';
            card.style.transform  = 'translateY(20px)';
            card.style.transition =
                'opacity 0.5s ease, transform 0.5s ease, ' +
                'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
            obs.observe(card);
        });
    }

})();