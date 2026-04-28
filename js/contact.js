/* ============================================
   JAY AMBE DECORATORS — CONTACT PAGE JS
   Lavender #EDE7F6 + Blue #60A5FA + Violet #8B5CF6
   Glassmorphism Theme
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
                ✅ Selected Package:
                <strong style="-webkit-text-fill-color:rgba(255,255,255,0.9);
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
                formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 600);
    }

    /* ============================================
       CHAR COUNTER
       ============================================ */
    function initCharCounter() {
        const textarea = document.getElementById('cMsg');
        const counter  = document.getElementById('charCount');
        if (!textarea || !counter) return;

        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            counter.textContent = len;

            /* Color feedback using violet theme */
            if (len > 450) {
                counter.style.color = 'var(--red-err)';
            } else if (len > 350) {
                /* Gradient text warning */
                counter.style.background = 'var(--gradient)';
                counter.style.webkitBackgroundClip = 'text';
                counter.style.webkitTextFillColor = 'transparent';
                counter.style.backgroundClip = 'text';
            } else {
                counter.style.color = '';
                counter.style.background = '';
                counter.style.webkitBackgroundClip = '';
                counter.style.webkitTextFillColor = '';
                counter.style.backgroundClip = '';
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
       FORM ENHANCEMENTS — focus / filled states
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

        /* Inject Lavender + Violet focus styles */
        if (!document.getElementById('contact-form-style')) {
            const style = document.createElement('style');
            style.id = 'contact-form-style';
            style.textContent = `
                /* Label turns violet on focus */
                .form-group.focused label {
                    background: var(--gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    transition: all 0.2s ease;
                }

                /* Violet glow on focus */
                .booking-form-wrap input:focus,
                .booking-form-wrap select:focus,
                .booking-form-wrap textarea:focus {
                    border-color: var(--violet);
                    box-shadow: 0 0 0 3px rgba(139,92,246,0.08);
                    background: var(--white);
                }

                /* Soft violet border when filled */
                .form-group.filled input:not(:focus),
                .form-group.filled select:not(:focus),
                .form-group.filled textarea:not(:focus) {
                    border-color: rgba(139,92,246,0.2);
                }

                /* Submit button hover glow */
                .submit-btn:not(:disabled):hover {
                    box-shadow: 0 10px 30px rgba(139,92,246,0.4);
                }

                /* Quick card touch active */
                .quick-card.touch-active {
                    transform: translateY(-5px);
                    border-color: rgba(139,92,246,0.3);
                    box-shadow: var(--sh-lg), var(--sh-violet);
                }
            `;
            document.head.appendChild(style);
        }
    }

    /* ============================================
       QUICK CARD EFFECTS (desktop glow)
       ============================================ */
    function initQuickCardEffects() {
        if ('ontouchstart' in window) return;

        document.querySelectorAll('.quick-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x    = e.clientX - rect.left;
                const y    = e.clientY - rect.top;

                card.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(139,92,246,0.04) 0%,
                        transparent 60%
                    ),
                    #FFFFFF
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
            { id: 'cPhone', msg: 'Please enter your phone number!', type: 'phone' },
            { id: 'cEvent', msg: 'Please select your event type!' },
            { id: 'cDate',  msg: 'Please select your event date!',  type: 'date' }
        ];

        if (!validateForm(fields)) return;

        /* Button loading state */
        const btn       = document.getElementById('submitBtn');
        const btnText   = btn?.querySelector('.btn-text');
        const btnLoader = btn?.querySelector('.btn-loader');

        if (btn) {
            btn.disabled = true;
            if (btnText)   btnText.style.display   = 'none';
            if (btnLoader) btnLoader.style.display  = 'flex';
        }

        /* 1.2s delay → simulate processing */
        setTimeout(() => {
            /* Collect data */
            const name   = document.getElementById('cName')?.value?.trim()   || '';
            const phone  = document.getElementById('cPhone')?.value?.trim()  || '';
            const event  = document.getElementById('cEvent')?.value          || '';
            const date   = document.getElementById('cDate')?.value           || '';
            const guests = document.getElementById('cGuests')?.value         || '';
            const budget = document.getElementById('cBudget')?.value         || '';
            const pkg    = document.getElementById('cPackage')?.value        || '';
            const venue  = document.getElementById('cVenue')?.value?.trim()  || '';
            const msg    = document.getElementById('cMsg')?.value?.trim()    || '';

            /* Show success box */
            const successBox = document.getElementById('successBox');
            if (successBox) {
                successBox.style.display = 'block';
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            /* Clear form */
            clearAllFields();

            /* Reset button */
            if (btn) {
                btn.disabled = false;
                if (btnText)   btnText.style.display   = 'flex';
                if (btnLoader) btnLoader.style.display  = 'none';
            }

            /* Send WhatsApp */
            sendWhatsAppMessage({ name, phone, event, date, guests, budget, pkg, venue, msg });

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
       SEND WHATSAPP MESSAGE
       ============================================ */
    function sendWhatsAppMessage(data) {
        const formatDate = (dateStr) => {
            if (!dateStr) return 'Not specified';
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        };

        const lines = [
            '🎊 *New Booking Request - Jay Ambe Decorators*',
            '',
            `👤 *Name:* ${data.name}`,
            `📱 *Phone:* ${data.phone}`,
            `🎉 *Event:* ${data.event  || 'Not specified'}`,
            `📅 *Date:* ${formatDate(data.date)}`,
            `👥 *Guests:* ${data.guests || 'Not specified'}`,
            `💰 *Budget:* ${data.budget || 'Not specified'}`,
            `📦 *Package:* ${data.pkg   || 'Not specified'}`,
            `📍 *Venue:* ${data.venue  || 'Not specified'}`,
            `💬 *Message:* ${data.msg   || 'No special requirements'}`,
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
            el.closest?.('.form-group')?.classList.remove('filled', 'focused');
        });

        /* Reset char counter */
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent            = '0';
            charCount.style.color            = '';
            charCount.style.background       = '';
            charCount.style.webkitTextFillColor = '';
        }

        /* Hide package tag */
        const pkgTag = document.getElementById('pkgSelected');
        if (pkgTag) pkgTag.style.display = 'none';
    }

})(); /* End IIFE */