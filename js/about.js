/* ============================================
   JAY AMBE DECORATORS — ABOUT PAGE JS
   Lavender + Blue + Violet | Glassmorphism
   ============================================ */

'use strict';

(function () {

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initTimeline();
        initProcessSteps();
        initTeamTouch();
        initCardHovers();
        initCounterBackup();
        initGlassCards();
    }

    /* ============================================
       TIMELINE — stagger slide-in from left
       ============================================ */
    function initTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('visible'));
            return;
        }

        const obs = new IntersectionObserver(
            (entries) => {
                let delay = 0;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                        delay += 130;
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -20px 0px' }
        );

        items.forEach(item => obs.observe(item));
    }

    /* ============================================
       PROCESS STEPS — stagger animation
       ============================================ */
    function initProcessSteps() {
        const steps = document.querySelectorAll('.process-step');
        if (!steps.length) return;

        if (!('IntersectionObserver' in window)) {
            steps.forEach(step => {
                step.style.opacity = '1';
                step.style.transform = 'none';
            });
            return;
        }

        steps.forEach(step => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(22px)';
            step.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        });

        const obs = new IntersectionObserver(
            (entries) => {
                let i = 0;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, i * 140);
                        i++;
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18 }
        );

        steps.forEach(step => obs.observe(step));
    }

    /* ============================================
       TEAM CARDS — touch device hover fix
       ============================================ */
    function initTeamTouch() {
        if (!('ontouchstart' in window)) return;

        const cards = document.querySelectorAll('.team-card');

        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                cards.forEach(c => c.classList.remove('touch-active'));
                card.classList.add('touch-active');
            }, { passive: true });
        });

        document.addEventListener('touchstart', (e) => {
            if (!e.target.closest('.team-card')) {
                cards.forEach(c => c.classList.remove('touch-active'));
            }
        }, { passive: true });

        /* Violet theme touch styles */
        const s = document.createElement('style');
        s.textContent = `
            .team-card.touch-active {
                transform: translateY(-5px);
                box-shadow: 0 12px 36px rgba(139,92,246,0.2),
                            0 4px 18px rgba(0,0,0,0.1);
                border-color: rgba(139,92,246,0.3);
            }
            .team-card.touch-active .team-overlay {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(s);
    }

    /* ============================================
       CARD HOVER MICRO-ANIMATIONS
       ============================================ */
    function initCardHovers() {
        /* MV card icon spin */
        document.querySelectorAll('.mv-card').forEach(card => {
            const icon = card.querySelector('.mv-icon');
            if (!icon) return;
            card.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.18) rotate(8deg)';
                icon.style.transition = 'transform 0.3s ease';
            });
            card.addEventListener('mouseleave', () => {
                icon.style.transform = '';
            });
        });

        /* WA card number grow */
        document.querySelectorAll('.wa-card').forEach(card => {
            const num = card.querySelector('.wa-num');
            if (!num) return;
            card.addEventListener('mouseenter', () => {
                num.style.opacity = '0.12';
                num.style.transform = 'scale(1.15)';
                num.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
            card.addEventListener('mouseleave', () => {
                num.style.opacity = '';
                num.style.transform = '';
            });
        });

        /* Review cards quote highlight */
        document.querySelectorAll('.review-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const quote = card.querySelector('.rc-quote');
                if (quote) {
                    quote.style.opacity = '0.35';
                    quote.style.transition = 'opacity 0.3s ease';
                }
            });
            card.addEventListener('mouseleave', () => {
                const quote = card.querySelector('.rc-quote');
                if (quote) quote.style.opacity = '';
            });
        });

        /* Achievement card icon bounce */
        document.querySelectorAll('.achievement-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.ach-icon');
                if (!icon) return;
                icon.style.animation = 'bounceIcon 0.4s ease';
                icon.style.display = 'inline-block';
            });
            card.addEventListener('animationend', () => {
                const icon = card.querySelector('.ach-icon');
                if (icon) icon.style.animation = '';
            });
        });

        /* Inject bounce keyframe */
        if (!document.getElementById('bounce-icon-style')) {
            const s = document.createElement('style');
            s.id = 'bounce-icon-style';
            s.textContent = `
                @keyframes bounceIcon {
                    0%   { transform: translateY(0) scale(1); }
                    40%  { transform: translateY(-8px) scale(1.15); }
                    70%  { transform: translateY(-3px) scale(1.05); }
                    100% { transform: translateY(0) scale(1); }
                }
            `;
            document.head.appendChild(s);
        }
    }

    /* ============================================
       GLASS CARD SUBTLE 3D EFFECT
       ============================================ */
    function initGlassCards() {
        if ('ontouchstart' in window) return;
        if (window.innerWidth < 768) return;

        document.querySelectorAll('.wa-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x    = e.clientX - rect.left;
                const y    = e.clientY - rect.top;
                const xPct = (x / rect.width  - 0.5) * 15;
                const yPct = (y / rect.height - 0.5) * 15;

                card.style.transform =
                    `perspective(600px) rotateX(${-yPct * 0.3}deg) rotateY(${xPct * 0.3}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ============================================
       COUNTER BACKUP
       ============================================ */
    function initCounterBackup() {
        if ('IntersectionObserver' in window) return;
        document.querySelectorAll('.stat-number').forEach(el => {
            el.textContent = (el.dataset.target || '0') + (el.dataset.suffix || '+');
        });
    }

})();