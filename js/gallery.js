// ========== GALLERY FILTER ==========
function filterGallery(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

// ========== LIGHTBOX ==========
let currentLightbox = 0;
let visibleItems = [];

function openLightbox(el) {
    visibleItems = Array.from(document.querySelectorAll('.gallery-item[style="display: block;"], .gallery-item:not([style*="display: none"])'));
    currentLightbox = visibleItems.indexOf(el);

    const img = el.querySelector('img');
    const caption = el.querySelector('.gallery-overlay span');
    document.getElementById('lightboxImg').src = img.src;
    document.getElementById('lbCaption').textContent = caption ? caption.textContent : '';
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxNav(dir) {
    currentLightbox = (currentLightbox + dir + visibleItems.length) % visibleItems.length;
    const el = visibleItems[currentLightbox];
    const img = el.querySelector('img');
    const caption = el.querySelector('.gallery-overlay span');
    document.getElementById('lightboxImg').src = img.src;
    document.getElementById('lbCaption').textContent = caption ? caption.textContent : '';
}

document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
    }
});