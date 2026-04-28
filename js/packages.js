/* ============================================
   JAY AMBE DECORATORS - PACKAGES PAGE JS
   Emerald Green + Gold + Cream Theme
   ============================================ */

(function () {
    'use strict';

    // ========== PACKAGE FILTER ==========
    let activeFilter = 'all';

    window.filterPackages = function (type, btn) {
        if (activeFilter === type) return;
        activeFilter = type;

        // Update buttons
        document.querySelectorAll('.pkg-filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });

        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        }

        // Filter cards
        const cards = document.querySelectorAll('.package-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const cats = card.getAttribute('data-pkg') || '';
            const show = type === 'all' || cats.includes(type);

            if (show) {
                card.style.display = '';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';

                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = card.classList.contains('popular')
                        ? 'translateY(-8px)' : '';
                    visibleCount++;
                }, visibleCount * 70);

            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    // ========== BOOK PACKAGE ==========
    // Override common.js bookPackage for this page
    window.bookPackage = function (pkg) {
        // Redirect to contact with package pre-selected
        window.location.href = `contact.html?package=${encodeURIComponent(pkg)}`;
    };

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', () => {

        // Check URL for package param
        const urlParams = new URLSearchParams(window.location.search);
        const pkgParam = urlParams.get('highlight');
        if (pkgParam) {
            const filterMap = {
                'wedding': 'wedding',
                'birthday': 'birthday',
                'corporate': 'corporate'
            };
            const filter = filterMap[pkgParam.toLowerCase()];
            if (filter) {
                const btn = document.querySelector(`[data-filter="${filter}"]`);
                if (btn) filterPackages(filter, btn);
            }
        }

        // ========== CARD HOVER EFFECTS ==========
        document.querySelectorAll('.package-card').forEach(card => {
            const isPopular = card.classList.contains('popular');

            card.addEventListener('mouseenter', () => {
                if (!isPopular) {
                    card.style.borderColor = 'rgba(212,175,55,0.3)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!isPopular) {
                    card.style.borderColor = '';
                }
            });
        });

        // ========== COMPARE TABLE SCROLL INDICATOR ==========
        const tableWrap = document.querySelector('.compare-table-wrap');
        if (tableWrap) {
            const hasScroll = tableWrap.scrollWidth > tableWrap.clientWidth;
            if (hasScroll) {
                const hint = document.createElement('div');
                hint.style.cssText = `
                    text-align: center;
                    font-size: 11px;
                    color: var(--text-light);
                    margin-top: 8px;
                    font-weight: 500;
                `;
                hint.textContent = '← Scroll to see full table →';
                tableWrap.parentNode.insertBefore(hint, tableWrap.nextSibling);

                // Hide on scroll
                tableWrap.addEventListener('scroll', () => {
                    hint.style.opacity = '0';
                }, { once: true, passive: true });
            }
        }

        // ========== FEATURE HIGHLIGHT ON HOVER ==========
        document.querySelectorAll('.compare-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    if (!cell.classList.contains('ct-feature')) {
                        cell.style.fontWeight = '600';
                    }
                });
            });

            row.addEventListener('mouseleave', () => {
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.fontWeight = '';
                });
            });
        });

        // ========== TOUCH SUPPORT FOR CARDS ==========
        if ('ontouchstart' in window) {
            document.querySelectorAll('.package-card').forEach(card => {
                card.addEventListener('touchstart', () => {
                    if (!card.classList.contains('popular')) {
                        card.style.transform = 'translateY(-5px)';
                        card.style.borderColor = 'rgba(212,175,55,0.3)';
                    }
                }, { passive: true });

                card.addEventListener('touchend', () => {
                    if (!card.classList.contains('popular')) {
                        setTimeout(() => {
                            card.style.transform = '';
                            card.style.borderColor = '';
                        }, 300);
                    }
                }, { passive: true });
            });
        }

        // ========== ANIMATE CARDS ON SCROLL ==========
        if ('IntersectionObserver' in window) {
            const cardObs = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            if (entry.target.classList.contains('popular')) {
                                entry.target.style.transform = 'translateY(-8px)';
                            } else {
                                entry.target.style.transform = 'translateY(0)';
                            }
                        }, i * 100);
                        cardObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.package-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
                cardObs.observe(card);
            });
        }

        // ========== UPDATE WHATSAPP LINKS ==========
        document.querySelectorAll('.pkg-wa-btn').forEach(btn => {
            const card = btn.closest('.package-card');
            const pkgName = card?.querySelector('h3')?.textContent?.trim();
            if (pkgName) {
                const msg = encodeURIComponent(
                    `Hi Jay Ambe Decorators! I'm interested in the ${pkgName} package. Please share details.`
                );
                btn.href = `https://wa.me/916358111321?text=${msg}`;
            }
        });

    });

})();