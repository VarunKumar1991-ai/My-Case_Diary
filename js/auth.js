// Auth logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const otpSection = document.getElementById('otpSection');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const mobileInput = document.getElementById('mobileNumber');
    const otpInput = document.getElementById('otpInput');
    const logoutBtn = document.getElementById('logoutBtn');

    // Protect routes
    const currentPage = window.location.pathname.split('/').pop();
    const isAuthPage = currentPage === 'login.html' || currentPage === 'index.html' || currentPage === '';
    
    const user = Storage.get(Storage.KEYS.USER);

    if (!user && !isAuthPage) {
        window.location.href = 'login.html';
    } else if (user && isAuthPage) {
        window.location.href = 'dashboard.html';
    }

    if (loginForm) {
        sendOtpBtn.addEventListener('click', () => {
            if (mobileInput.value.length >= 10) {
                mobileInput.disabled = true;
                sendOtpBtn.classList.add('d-none');
                otpSection.classList.remove('d-none');
                // Mock OTP sent
                alert("OTP sent to " + mobileInput.value + ". Use any 4 digit OTP.");
            } else {
                alert("Please enter a valid mobile number.");
            }
        });

        verifyOtpBtn.addEventListener('click', () => {
            if (otpInput.value.length >= 4) {
                // Mock successful login
                Storage.set(Storage.KEYS.USER, { mobile: mobileInput.value, loggedIn: true });
                window.location.href = 'dashboard.html';
            } else {
                alert("Please enter a valid OTP.");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Storage.remove(Storage.KEYS.USER);
            window.location.href = 'login.html';
        });
    }
});
