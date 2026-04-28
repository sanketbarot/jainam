// About page specific JS
console.log('About page loaded');

// Animate team cards on hover
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});