// ========== HERO SLIDER ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dotsContainer = document.getElementById('heroDots');

slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
});

function goToSlide(n) {
    currentSlide = n;
    document.getElementById('heroSlides').style.transform = `translateX(-${n * 100}%)`;
    document.querySelectorAll('.hero-dot').forEach((d, i) => {
        d.classList.toggle('active', i === n);
    });
}

function changeSlide(dir) {
    currentSlide = (currentSlide + dir + slides.length) % slides.length;
    goToSlide(currentSlide);
}

setInterval(() => changeSlide(1), 5000);

// ========== TESTIMONIAL SLIDER ==========
let currentT = 0;
const tCards = document.querySelectorAll('.testimonial-card');
const tDots = document.getElementById('testimonialDots');

tCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToTestimonial(i);
    tDots.appendChild(dot);
});

function goToTestimonial(n) {
    currentT = n;
    document.getElementById('testimonialTrack').style.transform = `translateX(-${n * 100}%)`;
    document.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === n);
    });
}

setInterval(() => {
    currentT = (currentT + 1) % tCards.length;
    goToTestimonial(currentT);
}, 4500);