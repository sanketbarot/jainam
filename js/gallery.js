/* ============================================
   JAY AMBE DECORATORS - GALLERY PAGE JS
   Emerald Green + Gold + Cream Theme
   ============================================ */

(function () {
    'use strict';

    // ========== STATE ==========
    let currentLightboxIndex = 0;
    let visibleItems = [];
    let activeFilter = 'all';
    let touchStartX = 0;
    let touchStartY = 0;

    // ========== FILTER GALLERY ==========
    window.filterGallery = function (cat, btn) {
        if (activeFilter === cat) return;
        activeFilter = cat;

        // Update buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        }

        // Filter items
        const allItems = document.querySelectorAll('.gallery-item');
        let count = 0;

        allItems.forEach((item, i) => {
            const itemCat = item.getAttribute('data-cat') || '';
            const show = cat === 'all' || itemCat === cat;

            if (show) {
                item.classList.remove('gi-hidden');
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.95)';

                // Stagger animation
                setTimeout(() => {
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, count * 60);

                count++;
            } else {
                item.classList.add('gi-hidden');
                item.style.display = 'none';
            }
        });

        // Update count display
        updateGalleryCount(count);

        // Show/hide no results
        const noResults = document.getElementById('noGalleryResults');
        if (noResults) {
            noResults.style.display = count === 0 ? 'block' : 'none';
        }

        // Update visible items for lightbox
        updateVisibleItems();
    };

    // Update gallery count text
    function updateGalleryCount(count) {
        const countEl = document.getElementById('galleryCount');
        if (countEl) {
            countEl.innerHTML = `Showing <strong>${count}</strong> photo${count !== 1 ? 's' : ''}`;
        }
    }

    // Update visible items array
    function updateVisibleItems() {
        visibleItems = Array.from(
            document.querySelectorAll('.gallery-item:not(.gi-hidden)')
        );
    }

    // ========== LIGHTBOX ==========
    window.openLightbox = function (el) {
        updateVisibleItems();
        currentLightboxIndex = visibleItems.indexOf(el);
        if (currentLightboxIndex === -1) currentLightboxIndex = 0;

        showLightboxItem(currentLightboxIndex);

        const lightbox = document.getElementById('lightbox');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        setTimeout(() => {
            document.querySelector('.lightbox-close')?.focus();
        }, 100);
    };

    window.closeLightbox = function () {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Clear image
        const img = document.getElementById('lightboxImg');
        if (img) {
            img.src = '';
            img.style.display = 'none';
        }

        const placeholder = document.getElementById('lbPlaceholder');
        if (placeholder) placeholder.style.display = 'flex';
    };

    window.lightboxNav = function (dir) {
        if (!visibleItems.length) return;
        currentLightboxIndex =
            (currentLightboxIndex + dir + visibleItems.length) % visibleItems.length;
        showLightboxItem(currentLightboxIndex);
    };

    function showLightboxItem(index) {
        const item = visibleItems[index];
        if (!item) return;

        const img = document.getElementById('lightboxImg');
        const caption = document.getElementById('lbCaption');
        const counter = document.getElementById('lbCounter');
        const placeholder = document.getElementById('lbPlaceholder');
        const loader = document.getElementById('lbLoader');

        // Get image source - real img or placeholder
        const realImg = item.querySelector('img');
        const overlayTitle = item.querySelector('.gallery-overlay h4');
        const overlaySpan = item.querySelector('.gallery-overlay span');

        const captionText = overlayTitle?.textContent || 'Jay Ambe Decorators';
        const spanText = overlaySpan?.textContent || 'Ahmedabad';

        if (caption) caption.textContent = `${captionText} — ${spanText}`;
        if (counter) counter.textContent = `${index + 1} / ${visibleItems.length}`;

        if (realImg && realImg.src && !realImg.src.includes('placeholder')) {
            // Real image
            if (placeholder) placeholder.style.display = 'none';
            if (loader) loader.style.display = 'flex';
            if (img) {
                img.style.display = 'none';
                img.src = '';

                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = tempImg.src;
                    img.alt = captionText;
                    img.style.display = 'block';
                    img.style.animation = 'lb-zoom-in 0.3s ease';
                    if (loader) loader.style.display = 'none';
                };
                tempImg.onerror = () => {
                    if (loader) loader.style.display = 'none';
                    if (placeholder) placeholder.style.display = 'flex';
                };
                tempImg.src = realImg.src;
            }
        } else {
            // Placeholder - show placeholder in lightbox
            if (img) img.style.display = 'none';
            if (loader) loader.style.display = 'none';
            if (placeholder) {
                placeholder.style.display = 'flex';
                const phText = placeholder.querySelector('.ph-text');
                if (phText) phText.textContent = captionText;
            }
        }
    }

    // ========== KEYBOARD NAVIGATION ==========
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox?.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': lightboxNav(-1); break;
            case 'ArrowRight': lightboxNav(1); break;
            case 'ArrowUp': lightboxNav(-1); break;
            case 'ArrowDown': lightboxNav(1); break;
        }
    });

    // ========== TOUCH SWIPE (Lightbox) ==========
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
        lightboxEl.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        lightboxEl.addEventListener('touchend', (e) => {
            const diffX = touchStartX - e.changedTouches[0].clientX;
            const diffY = touchStartY - e.changedTouches[0].clientY;

            // Only horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
                lightboxNav(diffX > 0 ? 1 : -1);
            }

            // Tap backdrop to close (small movement)
            if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                if (e.target.classList.contains('lightbox-backdrop')) {
                    closeLightbox();
                }
            }
        }, { passive: true });
    }

    // ========== KEYBOARD ON GALLERY ITEMS ==========
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(item);
            }
        });
    });

    // ========== GALLERY MASONRY HOVER FIX (Touch) ==========
    if ('ontouchstart' in window) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('touchstart', () => {
                document.querySelectorAll('.gallery-item').forEach(i => {
                    i.classList.remove('touch-hover');
                });
                item.classList.add('touch-hover');
            }, { passive: true });
        });

        // Add touch hover CSS
        const style = document.createElement('style');
        style.textContent = `
            .gallery-item.touch-hover .gallery-overlay { opacity: 1 !important; }
            .gallery-item.touch-hover { z-index: 2; }
        `;
        document.head.appendChild(style);
    }

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', () => {
        // Initial count
        const allItems = document.querySelectorAll('.gallery-item');
        updateGalleryCount(allItems.length);
        updateVisibleItems();

        // URL filter param
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        if (catParam) {
            const btn = document.querySelector(`[data-filter="${catParam}"]`);
            if (btn) filterGallery(catParam, btn);
        }

        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imgObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            imgObs.unobserve(img);
                        }
                    }
                });
            }, { rootMargin: '200px' });

            document.querySelectorAll('.gallery-item img[data-src]').forEach(img => {
                imgObs.observe(img);
            });
        }

        // Reveal items on scroll
        if ('IntersectionObserver' in window) {
            const revObs = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1)';
                        }, i * 50);
                        revObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05 });

            document.querySelectorAll('.gallery-item').forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.97)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                revObs.observe(item);
            });
        }
    });

})();