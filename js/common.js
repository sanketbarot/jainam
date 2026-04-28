// ========== LOADER ==========
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 2000);
});

// ========== CURSOR ==========
document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursorDot');
    if (cursor) cursor.style.cssText = `left:${e.clientX-10}px;top:${e.clientY-10}px`;
    if (dot) dot.style.cssText = `left:${e.clientX-3}px;top:${e.clientY-3}px`;
});

// ========== COOKIE ==========
function closeCookie() {
    const b = document.getElementById('cookieBanner');
    if (b) {
        b.style.display = 'none';
        localStorage.setItem('cookie_jay_ambe', 'true');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('cookie_jay_ambe')) {
        const b = document.getElementById('cookieBanner');
        if (b) b.style.display = 'none';
    }

    // Active nav
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });

    // Close menu on click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('navLinks').classList.remove('active');
        });
    });

    // Reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Counter
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animateCounter(e.target);
                counterObs.unobserve(e.target);
            }
        });
    });
    document.querySelectorAll('.stat-number').forEach(n => counterObs.observe(n));
});

// ========== NAVBAR SCROLL ==========
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    const btn = document.getElementById('scrollTop');
    if (btn) btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

// ========== SCROLL TOP ==========
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== COUNTER ==========
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '+';
    let current = 0;
    const step = target / 80;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target + suffix;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 20);
}

// ========== FAQ ==========
function toggleFaq(question) {
    const item = question.parentElement;
    const isOpen = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
    if (!isOpen) item.classList.add('active');
}

// ========== MENU ==========
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

// ========== PACKAGE BOOKING ==========
function bookPackage(pkg) {
    window.location.href = `contact.html?package=${encodeURIComponent(pkg)}`;
}

// ========== NEWSLETTER ==========
function subscribeNewsletter() {
    const input = document.getElementById('newsletterEmail');
    if (!input || !input.value.includes('@')) {
        alert('⚠️ Please enter valid email!');
        return;
    }
    alert('🎉 Thank you for subscribing to Jay Ambe Decorators!');
    input.value = '';
}

// ========== FORM VALIDATE ==========
function validateForm(fields) {
    for (const f of fields) {
        const el = document.getElementById(f.id);
        if (!el) continue;
        const val = el.value.trim();
        if (!val) { alert('⚠️ ' + f.msg); el.focus(); return false; }
        if (f.type === 'phone' && val.replace(/\D/g,'').length < 10) {
            alert('⚠️ Please enter valid 10-digit phone!'); el.focus(); return false;
        }
        if (f.type === 'email' && !val.includes('@')) {
            alert('⚠️ Please enter valid email!'); el.focus(); return false;
        }
        if (f.type === 'date') {
            const today = new Date().toISOString().split('T')[0];
            if (val < today) { alert('⚠️ Please select future date!'); el.focus(); return false; }
        }
    }
    return true;
}