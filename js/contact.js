// URL Package Parameter
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const pkg = params.get('package');
    if (pkg) {
        const el = document.getElementById('pkgSelected');
        if (el) {
            el.style.display = 'block';
            el.textContent = `✅ Selected: ${pkg} Package`;
        }
    }
});

// Form Submit
function submitBooking() {
    const fields = [
        { id: 'cName', msg: 'Please enter your name!' },
        { id: 'cPhone', msg: 'Please enter phone number!', type: 'phone' },
        { id: 'cEvent', msg: 'Please select event type!' },
        { id: 'cDate', msg: 'Please select event date!', type: 'date' }
    ];

    if (!validateForm(fields)) return;

    document.getElementById('successBox').style.display = 'block';

    document.querySelectorAll(
        '#cName,#cPhone,#cEmail,#cEvent,#cDate,#cGuests,#cBudget,#cVenue,#cMsg'
    ).forEach(el => el.value = '');

    document.getElementById('successBox').scrollIntoView({ behavior: 'smooth' });
}