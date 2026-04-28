/* ============================================
   JAY AMBE DECORATORS - INDEX PAGE JS
   ============================================ */

(function () {
    'use strict';

    // ========== HERO SLIDER ==========
    let currentSlide = 0;
    let heroInterval = null;
    let isAnimating = false;

    const slides = document.querySelectorAll('.hero-slide');
    const heroSlidesEl = document.getElementById('heroSlides');
    const dotsContainer = document.getElementById('heroDots');
    const heroSection = document.querySelector('.hero');
    const totalSlides = slides.length;

    // Create dots
    if (totalSlides > 1 && dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.setAttribute('role', 'tab');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(n, animate = true) {
        if (isAnimating && animate) return;
        if (n === currentSlide) return;

        isAnimating = true;
        currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;

        if (heroSlidesEl) {
            heroSlidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Update dots
        document.querySelectorAll('.hero-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
            d.setAttribute('aria-selected', i === currentSlide);
        });

        // Update hamburger aria
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            const isOpen = document.getElementById('navLinks')
                ?.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        setTimeout(() => { isAnimating = false; }, 700);
    }

    window.changeSlide = function (dir) {
        goToSlide(currentSlide + dir);
    };

    function startHeroAuto() {
        stopHeroAuto();
        if (totalSlides > 1) {
            heroInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }
    }

    function stopHeroAuto() {
        if (heroInterval) {
            clearInterval(heroInterval);
            heroInterval = null;
        }
    }

    // Pause on hover (desktop)
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopHeroAuto);
        heroSection.addEventListener('mouseleave', startHeroAuto);
        heroSection.addEventListener('focusin', stopHeroAuto);
        heroSection.addEventListener('focusout', startHeroAuto);
    }

    // Touch swipe support
    if (heroSection && totalSlides > 1) {
        let touchStartX = 0;
        let touchStartY = 0;

        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        heroSection.addEventListener('touchend', (e) => {
            const diffX = touchStartX - e.changedTouches[0].clientX;
            const diffY = touchStartY - e.changedTouches[0].clientY;

            // Only horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
                goToSlide(currentSlide + (diffX > 0 ? 1 : -1));
                stopHeroAuto();
                setTimeout(startHeroAuto, 8000);
            }
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.activeElement &&
            document.activeElement.closest('.hero')) {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentSlide - 1);
                stopHeroAuto();
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentSlide + 1);
                stopHeroAuto();
            }
        }
    });

    // Start auto
    startHeroAuto();

    // ========== TESTIMONIAL SLIDER ==========
    let currentT = 0;
    let tInterval = null;

    const tCards = document.querySelectorAll('.testimonial-card');
    const tTrack = document.getElementById('testimonialTrack');
    const tDotsContainer = document.getElementById('testimonialDots');
    const totalT = tCards.length;

    // Create dots
    if (totalT > 1 && tDotsContainer) {
        tCards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 't-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Review ${i + 1}`);
            dot.setAttribute('role', 'tab');
            dot.addEventListener('click', () => goToTestimonial(i));
            tDotsContainer.appendChild(dot);
        });
    }

    function goToTestimonial(n) {
        currentT = ((n % totalT) + totalT) % totalT;

        if (tTrack) {
            tTrack.style.transform = `translateX(-${currentT * 100}%)`;
        }

        document.querySelectorAll('.t-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentT);
        });
    }

    window.changeTestimonial = function (dir) {
        goToTestimonial(currentT + dir);
        stopTAuto();
        setTimeout(startTAuto, 8000);
    };

    function startTAuto() {
        stopTAuto();
        if (totalT > 1) {
            tInterval = setInterval(() => {
                goToTestimonial(currentT + 1);
            }, 4500);
        }
    }

    function stopTAuto() {
        if (tInterval) {
            clearInterval(tInterval);
            tInterval = null;
        }
    }

    // Touch on testimonials
    const tSlider = document.querySelector('.testimonial-slider');
    if (tSlider && totalT > 1) {
        let tTouchX = 0;

        tSlider.addEventListener('touchstart', (e) => {
            tTouchX = e.touches[0].clientX;
        }, { passive: true });

        tSlider.addEventListener('touchend', (e) => {
            const diff = tTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                goToTestimonial(currentT + (diff > 0 ? 1 : -1));
                stopTAuto();
                setTimeout(startTAuto, 8000);
            }
        }, { passive: true });
    }

    startTAuto();

    // ========== STATS ANIMATION ON MOBILE ==========
    // Ensure stats animate when visible (backup)
    document.querySelectorAll('.stat-number').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !el.dataset.counted) {
                    el.dataset.counted = 'true';
                    // animateCounter is defined in common.js
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    // ========== SERVICE CARDS HOVER FIX (Mobile) ==========
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                card.classList.add('touched');
            }, { passive: true });

            card.addEventListener('touchend', () => {
                setTimeout(() => card.classList.remove('touched'), 300);
            }, { passive: true });
        });
    }

    // ========== SMOOTH ANCHOR SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar')?.offsetHeight || 60;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== LAZY LOAD IMAGES ==========
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imgObserver.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '200px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }

})();