/* ============================================
   JAY AMBE DECORATORS - ABOUT PAGE JS
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // ========== TEAM CARD TOUCH ==========
        // Better hover support on touch devices
        if ('ontouchstart' in window) {
            document.querySelectorAll('.team-card').forEach(card => {
                card.addEventListener('touchstart', () => {
                    // Remove active from others
                    document.querySelectorAll('.team-card').forEach(c => {
                        c.classList.remove('touch-active');
                    });
                    card.classList.add('touch-active');
                }, { passive: true });
            });

            // Close on outside tap
            document.addEventListener('touchstart', (e) => {
                if (!e.target.closest('.team-card')) {
                    document.querySelectorAll('.team-card').forEach(c => {
                        c.classList.remove('touch-active');
                    });
                }
            }, { passive: true });
        }

        // ========== PROCESS STEPS ANIMATION ==========
        const processSteps = document.querySelectorAll('.process-step');
        if (processSteps.length) {
            const processObs = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, i * 150);
                        processObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            processSteps.forEach(step => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                processObs.observe(step);
            });
        }

        // ========== TIMELINE ANIMATION ==========
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length) {
            const tlObs = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, i * 120);
                        tlObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            timelineItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-15px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                tlObs.observe(item);
            });
        }

        // ========== REVIEW CARDS HOVER ==========
        document.querySelectorAll('.review-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = 'rgba(212,175,55,0.35)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '';
            });
        });

        // ========== MV CARDS HOVER ICON ==========
        document.querySelectorAll('.mv-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.mv-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.15) rotate(5deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.mv-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });

        // ========== WHY CARDS NUMBER EFFECT ==========
        document.querySelectorAll('.wa-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const num = card.querySelector('.wa-num');
                if (num) {
                    num.style.color = 'rgba(15,81,50,0.12)';
                    num.style.transition = 'color 0.3s ease';
                }
            });
            card.addEventListener('mouseleave', () => {
                const num = card.querySelector('.wa-num');
                if (num) {
                    num.style.color = '';
                }
            });
        });

    });

    // ========== TOUCH ACTIVE CSS ==========
    const style = document.createElement('style');
    style.textContent = `
        .team-card.touch-active .team-overlay {
            opacity: 1 !important;
        }
        .team-card.touch-active {
            transform: translateY(-6px);
            box-shadow: var(--shadow-lg);
        }
    `;
    document.head.appendChild(style);

})();