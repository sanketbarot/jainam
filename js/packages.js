// ========== BILLING TOGGLE ==========
let isYearly = false;
const basePrices = [15000, 35000, 75000, 150000];

function toggleBilling() {
    isYearly = !isYearly;
    document.getElementById('billingToggle').classList.toggle('active');
    ['price1','price2','price3','price4'].forEach((id, i) => {
        const price = isYearly
            ? Math.round(basePrices[i] * 0.8)
            : basePrices[i];
        const el = document.getElementById(id);
        if (el) el.textContent = '₹' + price.toLocaleString('en-IN');
    });
}

// ========== PACKAGE FILTER ==========
function filterPackages(type, btn) {
    document.querySelectorAll('.pkg-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.package-card').forEach(card => {
        const cats = card.dataset.pkg || 'all';
        card.style.display = (type === 'all' || cats.includes(type)) ? 'block' : 'none';
    });
}