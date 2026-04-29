/* ============================================
   JAY AMBE DECORATORS — GALLERY PAGE JS
   Green Glassmorphism Theme
   Colors updated for green — logic unchanged
   ============================================ */

'use strict';

(function () {

    /* ========== STATE ========== */
    let currentIndex = 0;
    let visibleItems = [];
    let activeFilter = 'all';
    let touchStartX  = 0;
    let touchStartY  = 0;

    /* ============================================
       FILTER GALLERY
       ============================================ */
    window.filterGallery = function (cat, btn) {
        if (activeFilter === cat) return;
        activeFilter = cat;

        /* Update buttons */
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });

        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        }

        /* Show/hide items with stagger */
        const allItems = document.querySelectorAll('.gallery-item');
        let count = 0;
        let delay = 0;

        allItems.forEach(item => {
            const itemCat = item.getAttribute('data-cat') || '';
            const show    = cat === 'all' || itemCat === cat;

            if (show) {
                item.classList.remove('gi-hidden');
                item.style.display    = '';
                item.style.opacity    = '0';
                item.style.transform  = 'scale(0.94) translateY(8px)';
                item.style.transition =
                    'opacity 0.45s ease, transform 0.45s ease';

                const d = delay;
                setTimeout(() => {
                    item.style.opacity   = '1';
                    item.style.transform = 'scale(1) translateY(0)';
                }, d);

                delay += 55;
                count++;
            } else {
                item.classList.add('gi-hidden');
                item.style.display = 'none';
            }
        });

        updateGalleryCount(count);

        const noResults = document.getElementById('noGalleryResults');
        if (noResults) noResults.style.display = count === 0 ? 'block' : 'none';

        updateVisibleItems();
    };

    /* ============================================
       HELPERS
       ============================================ */
    function updateGalleryCount(count) {
        const el = document.getElementById('galleryCount');
        if (el) {
            el.innerHTML =
                `Showing <strong>${count}</strong> ` +
                `photo${count !== 1 ? 's' : ''}`;
        }
    }

    function updateVisibleItems() {
        visibleItems = Array.from(
            document.querySelectorAll('.gallery-item:not(.gi-hidden)')
        );
    }

    /* ============================================
       LIGHTBOX
       ============================================ */
    window.openLightbox = function (el) {
        updateVisibleItems();
        currentIndex = visibleItems.indexOf(el);
        if (currentIndex < 0) currentIndex = 0;

        showLightboxItem(currentIndex);

        const lb = document.getElementById('lightbox');
        if (lb) {
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        setTimeout(() => {
            document.querySelector('.lightbox-close')?.focus();
        }, 120);
    };

    window.closeLightbox = function () {
        const lb = document.getElementById('lightbox');
        if (!lb) return;
        lb.classList.remove('active');
        document.body.style.overflow = '';

        const img  = document.getElementById('lightboxImg');
        const ph   = document.getElementById('lbPlaceholder');
        const spin = document.getElementById('lbLoader');
        if (img)  { img.src = ''; img.style.display = 'none'; }
        if (ph)   ph.style.display = 'flex';
        if (spin) spin.style.display = 'none';
    };

    window.lightboxNav = function (dir) {
        if (!visibleItems.length) return;
        currentIndex =
            (currentIndex + dir + visibleItems.length) % visibleItems.length;
        showLightboxItem(currentIndex);
    };

    function showLightboxItem(idx) {
        const item = visibleItems[idx];
        if (!item) return;

        const img     = document.getElementById('lightboxImg');
        const caption = document.getElementById('lbCaption');
        const counter = document.getElementById('lbCounter');
        const ph      = document.getElementById('lbPlaceholder');
        const spinner = document.getElementById('lbLoader');

        const title =
            item.querySelector('.gallery-overlay h4')?.textContent
            || 'Jay Ambe Decorators';
        const sub   =
            item.querySelector('.gallery-overlay span')?.textContent
            || 'Ahmedabad';

        if (caption) caption.textContent = `${title} — ${sub}`;
        if (counter) counter.textContent =
            `${idx + 1} / ${visibleItems.length}`;

        const realImg = item.querySelector('img');

        if (realImg?.src && !realImg.src.includes('data:') &&
            realImg.complete && realImg.naturalWidth > 0) {
            if (ph)      ph.style.display     = 'none';
            if (spinner) spinner.style.display = 'none';
            if (img) {
                img.src             = realImg.src;
                img.alt             = title;
                img.style.display   = 'block';
                img.style.animation = 'lb-zoom-in 0.3s ease';
            }
        } else {
            if (img)     img.style.display    = 'none';
            if (spinner) spinner.style.display = 'none';
            if (ph) {
                ph.style.display = 'flex';
                const phText = ph.querySelector('.ph-text');
                if (phText) phText.textContent = title;
            }
        }
    }

    /* ============================================
       KEYBOARD NAVIGATION
       ============================================ */
    document.addEventListener('keydown', e => {
        const lb = document.getElementById('lightbox');
        if (!lb?.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                lightboxNav(-1);
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                lightboxNav(1);
                break;
        }
    });

    /* ============================================
       TOUCH SWIPE — Lightbox
       ============================================ */
    const lbEl = document.getElementById('lightbox');
    if (lbEl) {
        lbEl.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        lbEl.addEventListener('touchend', e => {
            const dx = touchStartX - e.changedTouches[0].clientX;
            const dy = touchStartY - e.changedTouches[0].clientY;

            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 42) {
                lightboxNav(dx > 0 ? 1 : -1);
            }

            if (Math.abs(dx) < 8 && Math.abs(dy) < 8 &&
                e.target.classList.contains('lightbox-backdrop')) {
                closeLightbox();
            }
        }, { passive: true });
    }

    /* ============================================
       KEYBOARD ON GALLERY ITEMS
       ============================================ */
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(item);
            }
        });
    });

    /* ============================================
       TOUCH HOVER FIX — Green Theme
       ============================================ */
    if ('ontouchstart' in window) {
        const items = document.querySelectorAll('.gallery-item');

        items.forEach(item => {
            item.addEventListener('touchstart', () => {
                items.forEach(i => i.classList.remove('touch-hover'));
                item.classList.add('touch-hover');
            }, { passive: true });
        });

        document.addEventListener('touchstart', e => {
            if (!e.target.closest('.gallery-item')) {
                items.forEach(i => i.classList.remove('touch-hover'));
            }
        }, { passive: true });

        /* Green theme touch CSS */
        const s = document.createElement('style');
        s.textContent = `
            .gallery-item.touch-hover .gallery-overlay {
                opacity: 1 !important;
            }
            .gallery-item.touch-hover {
                border-color: rgba(16,185,129,0.45) !important;
                box-shadow:
                    0 8px 24px rgba(5,150,105,0.20),
                    0 0 20px rgba(16,185,129,0.12) !important;
                z-index: 2;
            }
        `;
        document.head.appendChild(s);
    }

    /* ============================================
       INIT
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {

        /* Initial count */
        const all = document.querySelectorAll('.gallery-item');
        updateGalleryCount(all.length);
        updateVisibleItems();

        /* URL param */
        const p   = new URLSearchParams(window.location.search);
        const cat = p.get('cat');
        if (cat) {
            const btn = document.querySelector(`[data-filter="${cat}"]`);
            if (btn) filterGallery(cat, btn);
        }

        /* Lazy load real images */
        if ('IntersectionObserver' in window) {
            const imgObs = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        imgObs.unobserve(img);
                    }
                });
            }, { rootMargin: '250px' });

            document.querySelectorAll('.gallery-item img[data-src]')
                    .forEach(img => imgObs.observe(img));
        }

        /* Scroll reveal for gallery items */
        if ('IntersectionObserver' in window) {
            const revObs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, i) => {
                        if (!entry.isIntersecting) return;
                        setTimeout(() => {
                            entry.target.style.opacity   = '1';
                            entry.target.style.transform =
                                'scale(1) translateY(0)';
                        }, i * 45);
                        revObs.unobserve(entry.target);
                    });
                },
                { threshold: 0.04, rootMargin: '0px 0px -20px 0px' }
            );

            document.querySelectorAll('.gallery-item').forEach(item => {
                item.style.opacity    = '0';
                item.style.transform  = 'scale(0.96) translateY(8px)';
                item.style.transition =
                    'opacity 0.5s ease, transform 0.5s ease, ' +
                    'border-color 0.3s ease, box-shadow 0.3s ease';
                revObs.observe(item);
            });
        }

        /* ---- Hover green glow effect (desktop) ---- */
        if (!('ontouchstart' in window) && window.innerWidth > 768) {
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('mousemove', e => {
                    const rect = item.getBoundingClientRect();
                    const x    = e.clientX - rect.left;
                    const y    = e.clientY - rect.top;

                    /* Green spotlight on placeholder */
                    const ph = item.querySelector('.placeholder-img');
                    if (ph) {
                        ph.style.background = `
                            radial-gradient(
                                circle at ${x}px ${y}px,
                                rgba(16,185,129,0.08) 0%,
                                transparent 60%
                            ),
                            linear-gradient(145deg,
                                var(--sage-lt), var(--sage))
                        `;
                    }
                });

                item.addEventListener('mouseleave', () => {
                    const ph = item.querySelector('.placeholder-img');
                    if (ph) ph.style.background = '';
                });
            });
        }
    });

})();