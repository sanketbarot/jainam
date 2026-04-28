/* ============================================
   JAY AMBE DECORATORS - CONTACT PAGE JS
   Emerald Green + Gold + Cream Theme
   ============================================ */

(function () {
    'use strict';

    // ========== INIT ==========
    document.addEventListener('DOMContentLoaded', () => {
        initPackageParam();
        initCharCounter();
        initDateMin();
        initFormEnhancements();
        initPhoneFormat();
    });

    // ========== URL PACKAGE PARAM ==========
    function initPackageParam() {
        const params = new URLSearchParams(window.location.search);
        const pkg = params.get('package');

        if (pkg) {
            // Show selected package tag
            const el = document.getElementById('pkgSelected');
            if (el) {
                el.style.display = 'flex';
                el.innerHTML = `✅ Selected Package: <strong style="color:var(--accent);margin-left:4px;">${pkg}</strong>`;
            }

            // Pre-select in dropdown
            const pkgSelect = document.getElementById('cPackage');
            if (pkgSelect) {
                Array.from(pkgSelect.options).forEach(opt => {
                    if (opt.value.toLowerCase() === pkg.toLowerCase() ||
                        opt.text.toLowerCase().includes(pkg.toLowerCase())) {
                        opt.selected = true;
                    }
                });
            }

            // Pre-select event type if provided
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

            // Scroll to form
            setTimeout(() => {
                const formWrap = document.getElementById('bookingForm');
                if (formWrap) {
                    formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 600);
        }
    }

    // ========== CHAR COUNTER ==========
    function initCharCounter() {
        const textarea = document.getElementById('cMsg');
        const counter = document.getElementById('charCount');
        if (!textarea || !counter) return;

        textarea.addEventListener('input', () => {
            const len = textarea.value.length;
            counter.textContent = len;

            // Color feedback
            if (len > 450) {
                counter.style.color = 'var(--red)';
            } else if (len > 350) {
                counter.style.color = 'var(--accent-dark)';
            } else {
                counter.style.color = '';
            }
        });
    }

    // ========== SET MIN DATE ==========
    function initDateMin() {
        const dateInput = document.getElementById('cDate');
        if (!dateInput) return;

        const today = new Date();
        // Allow booking from tomorrow
        today.setDate(today.getDate() + 1);
        dateInput.min = today.toISOString().split('T')[0];

        // Set max date (1 year from now)
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }

    // ========== PHONE FORMAT ==========
    function initPhoneFormat() {
        const phoneInput = document.getElementById('cPhone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^\d+\-\s]/g, '');
            e.target.value = val;
        });
    }

    // ========== FORM ENHANCEMENTS ==========
    function initFormEnhancements() {
        // Focus animation on inputs
        document.querySelectorAll(
            '.booking-form-wrap input, .booking-form-wrap select, .booking-form-wrap textarea'
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

        // Add CSS for focused state
        const style = document.createElement('style');
        style.textContent = `
            .form-group.focused label {
                color: var(--primary);
                transition: color 0.2s ease;
            }
            .form-group.filled input:not(:focus),
            .form-group.filled select:not(:focus),
            .form-group.filled textarea:not(:focus) {
                border-color: rgba(var(--primary-rgb), 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // ========== FORM SUBMISSION ==========
    window.submitBooking = function () {
        const fields = [
            { id: 'cName', msg: 'Please enter your name!' },
            { id: 'cPhone', msg: 'Please enter your phone number!', type: 'phone' },
            { id: 'cEvent', msg: 'Please select your event type!' },
            { id: 'cDate', msg: 'Please select your event date!', type: 'date' }
        ];

        if (!validateForm(fields)) return;

        // Button loading state
        const btn = document.getElementById('submitBtn');
        const btnText = btn?.querySelector('.btn-text');
        const btnLoader = btn?.querySelector('.btn-loader');

        if (btn) {
            btn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'flex';
        }

        // Simulate API call delay
        setTimeout(() => {
            // Collect form data for WhatsApp
            const name = document.getElementById('cName')?.value?.trim() || '';
            const phone = document.getElementById('cPhone')?.value?.trim() || '';
            const event = document.getElementById('cEvent')?.value || '';
            const date = document.getElementById('cDate')?.value || '';
            const guests = document.getElementById('cGuests')?.value || '';
            const budget = document.getElementById('cBudget')?.value || '';
            const pkg = document.getElementById('cPackage')?.value || '';
            const venue = document.getElementById('cVenue')?.value?.trim() || '';
            const msg = document.getElementById('cMsg')?.value?.trim() || '';

            // Show success
            const successBox = document.getElementById('successBox');
            if (successBox) {
                successBox.style.display = 'block';
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Clear form
            clearAllFields();

            // Reset button
            if (btn) {
                btn.disabled = false;
                if (btnText) btnText.style.display = 'flex';
                if (btnLoader) btnLoader.style.display = 'none';
            }

            // Send WhatsApp message
            sendWhatsAppMessage({
                name, phone, event, date,
                guests, budget, pkg, venue, msg
            });

            // Hide success after 10 seconds
            setTimeout(() => {
                if (successBox) {
                    successBox.style.opacity = '0';
                    successBox.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        successBox.style.display = 'none';
                        successBox.style.opacity = '';
                    }, 500);
                }
            }, 10000);

        }, 1200);
    };

    // ========== SEND WHATSAPP ==========
    function sendWhatsAppMessage(data) {
        const formatDate = (dateStr) => {
            if (!dateStr) return 'Not specified';
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
        };

        const message = [
            `🎊 *New Booking Request - Jay Ambe Decorators*`,
            ``,
            `👤 *Name:* ${data.name}`,
            `📱 *Phone:* ${data.phone}`,
            `🎉 *Event:* ${data.event || 'Not specified'}`,
            `📅 *Date:* ${formatDate(data.date)}`,
            `👥 *Guests:* ${data.guests || 'Not specified'}`,
            `💰 *Budget:* ${data.budget || 'Not specified'}`,
            `📦 *Package:* ${data.pkg || 'Not specified'}`,
            `📍 *Venue:* ${data.venue || 'Not specified'}`,
            `💬 *Message:* ${data.msg || 'No special requirements'}`,
            ``,
            `📲 _Sent from jayambedecorators.com_`
        ].join('\n');

        const waUrl = `https://wa.me/916358111321?text=${encodeURIComponent(message)}`;

        // Open WhatsApp after short delay
        setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }, 1500);
    }

    // ========== CLEAR ALL FIELDS ==========
    function clearAllFields() {
        const ids = ['cName', 'cPhone', 'cEmail', 'cEvent',
                     'cDate', 'cGuests', 'cBudget', 'cPackage',
                     'cVenue', 'cMsg'];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = '';
                el.closest?.('.form-group')?.classList.remove('filled', 'focused');
            }
        });

        // Reset char counter
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = '';
        }

        // Hide package tag
        const pkgTag = document.getElementById('pkgSelected');
        if (pkgTag) pkgTag.style.display = 'none';
    }

})();