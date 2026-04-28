/* ============================================
   JAY AMBE DECORATORS - SERVICES PAGE JS
   ============================================ */

(function () {
    'use strict';

    // ========== SERVICE FILTER ==========
    let activeFilter = 'all';

    window.filterServices = function (cat, btn) {
        if (activeFilter === cat) return;
        activeFilter = cat;

        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
        });
        if (btn) btn.classList.add('active');

        const cards = document.querySelectorAll('.service-detailed-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCats = card.getAttribute('data-cat') || '';

            if (cat === 'all' || cardCats.includes(cat)) {
                card.style.display = '';
                card.classList.remove('hidden');
                visibleCount++;

                // Re-trigger reveal animation
                card.classList.remove('visible');
                setTimeout(() => {
                    card.classList.add('visible');
                }, 50);
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Show/hide no results
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Scroll to services
        const servicesSection = document.getElementById('services');
        if (servicesSection && cat !== 'all') {
            const filterBar = document.querySelector('.services-filter-bar');
            const offset = (filterBar?.offsetHeight || 0) + 70;
            const top = servicesSection.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    // ========== INIT ON DOM READY ==========
    document.addEventListener('DOMContentLoaded', () => {

        // Check URL filter param
        const urlParams = new URLSearchParams(window.location.search);
        const catParam = urlParams.get('cat');
        if (catParam) {
            const btn = document.querySelector(`[data-filter="${catParam}"]`);
            if (btn) filterServices(catParam, btn);
        }

        // ========== WHATSAPP QUICK LINK ==========
        // Add event name to WhatsApp messages
        document.querySelectorAll('.service-detailed-card').forEach(card => {
            const waBtn = card.querySelector('.btn-wa');
            const serviceName = card.querySelector('h3')?.textContent?.trim();

            if (waBtn && serviceName) {
                const msg = encodeURIComponent(
                    `Hi Jay Ambe Decorators! I'm interested in ${serviceName}. Please share details and pricing.`
                );
                waBtn.href = `https://wa.me/916358111321?text=${msg}`;
            }
        });

        // ========== PROCESS STEPS ANIMATION ==========
        const processSteps = document.querySelectorAll('.process-step');
        if (processSteps.length) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, i * 120);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            processSteps.forEach(step => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                obs.observe(step);
            });
        }

        // ========== WHY STRIP ITEMS ==========
        const wsItems = document.querySelectorAll('.ws-item');
        if (wsItems.length) {
            const wsObs = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, i * 80);
                        wsObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            wsItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(15px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                wsObs.observe(item);
            });
        }

        // ========== CARD TOUCH SUPPORT ==========
        if ('ontouchstart' in window) {
            document.querySelectorAll('.service-detailed-card').forEach(card => {
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'translateY(-4px)';
                    card.style.boxShadow = 'var(--shadow-lg)';
                }, { passive: true });

                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.style.transform = '';
                        card.style.boxShadow = '';
                    }, 200);
                }, { passive: true });
            });
        }

        // ========== SERVICE CARD FEATURE EXPAND (Mobile) ==========
        // On mobile, clicking card shows features
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.service-detailed-card').forEach(card => {
                const features = card.querySelector('.service-features');
                const body = card.querySelector('.service-body');
                if (!features || !body) return;

                // Add expand button
                const expandBtn = document.createElement('button');
                expandBtn.className = 'feature-expand-btn';
                expandBtn.textContent = '▼ View Features';
                expandBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: var(--primary);
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    padding: 4px 0;
                    font-family: var(--font);
                    display: block;
                    margin-bottom: 8px;
                `;

                features.style.display = 'none';
                body.insertBefore(expandBtn, features);

                let expanded = false;
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    expanded = !expanded;
                    features.style.display = expanded ? 'block' : 'none';
                    expandBtn.textContent = expanded ? '▲ Hide Features' : '▼ View Features';
                });
            });
        }

    });

})();