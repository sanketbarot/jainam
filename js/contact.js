/* ============================================
   JAY AMBE DECORATORS — CONTACT PAGE JS
   Green Glassmorphism Theme
   Emerald #10B981 + Forest #022C22 + Mint #6EE7B7
   ============================================ */

'use strict';

(function () {

    /* ============================================
       INIT
       ============================================ */
    document.addEventListener('DOMContentLoaded', () => {
        initPackageParam();
        initCharCounter();
        initDateMin();
        initFormEnhancements();
        initPhoneFormat();
        initQuickCardEffects();
    });

    /* ============================================
       URL PACKAGE PARAM
       ============================================ */
    function initPackageParam() {
        const params = new URLSearchParams(window.location.search);
        const pkg    = params.get('package');

        if (!pkg) return;

        /* Show selected package tag */
        const el = document.getElementById('pkgSelected');
        if (el) {
            el.style.display = 'flex';
            el.innerHTML = `
                🌿 Selected Package:
                <strong style="-webkit-text-fill-color:rgba(255,255,255,0.92);
                               margin-left:4px;">${pkg}</strong>
            `;
        }

        /* Pre-select in dropdown */
        const pkgSelect = document.getElementById('cPackage');
        if (pkgSelect) {
            Array.from(pkgSelect.options).forEach(opt => {
                if (
                    opt.value.toLowerCase() === pkg.toLowerCase() ||
                    opt.text.toLowerCase().includes(pkg.toLowerCase())
                ) {
                    opt.selected = true;
                }
            });
        }

        /* Pre-select event type if provided */
        const eventParam = params.get('event');
        if (eventParam) {
            const eventSelect = document.getElementById('cEvent');
            if (eventSelect) {
                Array.from(eventSelect.options).forEach(opt => {
                    if (opt.value.toLowerCase() === eventParam.toLowerCase()) {
                        opt.selected = true;
                    }
                });
            }
        }

        /* Scroll to form */
        setTimeout(() => {
            const formWrap = document.getElementById('bookingForm');
            if (formWrap) {
                formWrap.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 600);
    }

    /* ============================================
       CHAR COUNTER — Green feedback
       ============================================ */
    function initCharCounter() {
        const textarea = document.getElementById('cMsg');
        const counter  = document.getElementById('charCount');
        if (!textarea || !counter) return;

        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            counter.textContent = len;

            if (len > 450) {
                /* Red error */
                counter.style.color                  = 'var(--red-err)';
                counter.style.background             = '';
                counter.style.webkitBackgroundClip   = '';
                counter.style.webkitTextFillColor    = '';
                counter.style.backgroundClip         = '';
            } else if (len > 350) {
                /* Green gradient warning */
                counter.style.color                  = '';
                counter.style.background             = 'var(--gradient)';
                counter.style.webkitBackgroundClip   = 'text';
                counter.style.webkitTextFillColor    = 'transparent';
                counter.style.backgroundClip         = 'text';
            } else {
                /* Reset */
                counter.style.color                  = '';
                counter.style.background             = '';
                counter.style.webkitBackgroundClip   = '';
                counter.style.webkitTextFillColor    = '';
                counter.style.backgroundClip         = '';
            }
        });
    }

    /* ============================================
       SET MIN/MAX DATE
       ============================================ */
    function initDateMin() {
        const dateInput = document.getElementById('cDate');
        if (!dateInput) return;

        /* Tomorrow as minimum */
        const today = new Date();
        today.setDate(today.getDate() + 1);
        dateInput.min = today.toISOString().split('T')[0];

        /* 2 years max */
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }

    /* ============================================
       PHONE FORMAT — numbers only
       ============================================ */
    function initPhoneFormat() {
        const phoneInput = document.getElementById('cPhone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+\-\s]/g, '');
        });
    }

    /* ============================================
       FORM ENHANCEMENTS — Green focus/filled states
       ============================================ */
    function initFormEnhancements() {
        document.querySelectorAll(
            '.booking-form-wrap input, ' +
            '.booking-form-wrap select, ' +
            '.booking-form-wrap textarea'
        ).forEach(input => {
            input.addEventListener('focus', () => {
                input.closest('.form-group')?.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                input.closest('.form-group')?.classList.remove('focused');
                if (input.value) {
                    input.closest('.form-group')?.classList.add('filled');
                } else {
                    input.closest('.form-group')?.classList.remove('filled');
                }
            });
        });

        /* Green theme focus/filled styles */
        if (!document.getElementById('contact-form-style')) {
            const style = document.createElement('style');
            style.id = 'contact-form-style';
            style.textContent = `
                /* Label turns green on focus */
                .form-group.focused label {
                    background: var(--gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    transition: all 0.2s ease;
                }

                /* Emerald glow on focus */
                .booking-form-wrap input:focus,
                .booking-form-wrap select:focus,
                .booking-form-wrap textarea:focus {
                    border-color: var(--emerald) !important;
                    box-shadow: 0 0 0 3px rgba(5,150,105,0.10) !important;
                    background: var(--white) !important;
                }

                /* Soft green border when filled */
                .form-group.filled input:not(:focus),
                .form-group.filled select:not(:focus),
                .form-group.filled textarea:not(:focus) {
                    border-color: rgba(16,185,129,0.22) !important;
                }

                /* Submit button hover glow — green */
                .submit-btn:not(:disabled):hover {
                    box-shadow: 0 10px 30px rgba(5,150,105,0.45) !important;
                }

                /* Quick card touch active — green */
                .quick-card.touch-active {
                    transform: translateY(-5px);
                    border-color: rgba(16,185,129,0.30);
                    box-shadow: 0 12px 36px rgba(5,150,105,0.16),
                                var(--sh-green);
                }
            `;
            document.head.appendChild(style);
        }

        /* Touch support for quick cards */
        if ('ontouchstart' in window) {
            document.querySelectorAll('.quick-card').forEach(card => {
                card.addEventListener('touchstart', () => {
                    document.querySelectorAll('.quick-card')
                             .forEach(c => c.classList.remove('touch-active'));
                    card.classList.add('touch-active');
                }, { passive: true });
            });

            document.addEventListener('touchstart', e => {
                if (!e.target.closest('.quick-card')) {
                    document.querySelectorAll('.quick-card')
                             .forEach(c => c.classList.remove('touch-active'));
                }
            }, { passive: true });
        }
    }

    /* ============================================
       QUICK CARD EFFECTS — Green glow (desktop)
       ============================================ */
    function initQuickCardEffects() {
        if ('ontouchstart' in window) return;
        if (window.innerWidth < 768) return;

        document.querySelectorAll('.quick-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x    = e.clientX - rect.left;
                const y    = e.clientY - rect.top;

                /* Green spotlight */
                card.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(16,185,129,0.06) 0%,
                        transparent 60%
                    ),
                    rgba(255,255,255,0.85)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    }

    /* ============================================
       FORM SUBMISSION
       ============================================ */
    window.submitBooking = function () {
        const fields = [
            { id: 'cName',  msg: 'Please enter your name!' },
            {
                id: 'cPhone',
                msg: 'Please enter your phone number!',
                type: 'phone'
            },
            { id: 'cEvent', msg: 'Please select your event type!' },
            {
                id: 'cDate',
                msg: 'Please select your event date!',
                type: 'date'
            }
        ];

        if (!validateForm(fields)) return;

        /* Button loading state */
        const btn       = document.getElementById('submitBtn');
        const btnText   = btn?.querySelector('.btn-text');
        const btnLoader = btn?.querySelector('.btn-loader');

        if (btn) {
            btn.disabled = true;
            if (btnText)   btnText.style.display  = 'none';
            if (btnLoader) btnLoader.style.display = 'flex';
        }

        /* 1.2s simulate processing */
        setTimeout(() => {

            /* Collect data */
            const name   = document.getElementById('cName')?.value?.trim()  || '';
            const phone  = document.getElementById('cPhone')?.value?.trim() || '';
            const event  = document.getElementById('cEvent')?.value         || '';
            const date   = document.getElementById('cDate')?.value          || '';
            const guests = document.getElementById('cGuests')?.value        || '';
            const budget = document.getElementById('cBudget')?.value        || '';
            const pkg    = document.getElementById('cPackage')?.value       || '';
            const venue  = document.getElementById('cVenue')?.value?.trim() || '';
            const msg    = document.getElementById('cMsg')?.value?.trim()   || '';

            /* Show success box */
            const successBox = document.getElementById('successBox');
            if (successBox) {
                successBox.style.display = 'block';
                successBox.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }

            /* Clear form */
            clearAllFields();

            /* Reset button */
            if (btn) {
                btn.disabled = false;
                if (btnText)   btnText.style.display  = 'flex';
                if (btnLoader) btnLoader.style.display = 'none';
            }

            /* Send WhatsApp */
            sendWhatsAppMessage({
                name, phone, event, date,
                guests, budget, pkg, venue, msg
            });

            /* Auto-hide success after 10s */
            setTimeout(() => {
                if (!successBox) return;
                successBox.style.transition = 'opacity 0.5s ease';
                successBox.style.opacity    = '0';
                setTimeout(() => {
                    successBox.style.display = 'none';
                    successBox.style.opacity = '';
                }, 500);
            }, 10000);

        }, 1200);
    };

    /* ============================================
       SEND WHATSAPP — Green theme message
       ============================================ */
    function sendWhatsAppMessage(data) {
        const formatDate = (dateStr) => {
            if (!dateStr) return 'Not specified';
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        };

        const lines = [
            '🌿 *New Booking Request - Jay Ambe Decorators*',
            '',
            `👤 *Name:*    ${data.name}`,
            `📱 *Phone:*   ${data.phone}`,
            `🎉 *Event:*   ${data.event  || 'Not specified'}`,
            `📅 *Date:*    ${formatDate(data.date)}`,
            `👥 *Guests:*  ${data.guests || 'Not specified'}`,
            `💰 *Budget:*  ${data.budget || 'Not specified'}`,
            `📦 *Package:* ${data.pkg    || 'Not specified'}`,
            `📍 *Venue:*   ${data.venue  || 'Not specified'}`,
            `💬 *Message:* ${data.msg    || 'No special requirements'}`,
            '',
            '📲 _Sent from jayambedecorators.com_'
        ];

        const waUrl =
            `https://wa.me/916358111321?text=` +
            encodeURIComponent(lines.join('\n'));

        /* Small delay so success box shows first */
        setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }, 1500);
    }

    /* ============================================
       CLEAR ALL FORM FIELDS
       ============================================ */
    function clearAllFields() {
        const ids = [
            'cName', 'cPhone', 'cEmail', 'cEvent',
            'cDate', 'cGuests', 'cBudget', 'cPackage',
            'cVenue', 'cMsg'
        ];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.value = '';
            el.closest?.('.form-group')
              ?.classList.remove('filled', 'focused');
        });

        /* Reset char counter */
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent              = '0';
            charCount.style.color              = '';
            charCount.style.background         = '';
            charCount.style.webkitTextFillColor = '';
            charCount.style.backgroundClip      = '';
            charCount.style.webkitBackgroundClip = '';
        }

        /* Hide package tag */
        const pkgTag = document.getElementById('pkgSelected');
        if (pkgTag) pkgTag.style.display = 'none';
    }

})(); /* End IIFE */