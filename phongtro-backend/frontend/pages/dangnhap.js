import { auth } from '../js/auth.js';

// Init
document.addEventListener('DOMContentLoaded', async () => {
    // If already logged in, redirect to index
    if (localStorage.getItem('accessToken')) {
        window.location.href = '../index.html';
    }

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('btn-login');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang xử lý...';
        btn.disabled = true;

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const success = await auth.login(username, password);
        
        if (success) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Thành công!';
            btn.style.background = 'var(--clr-success)';
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        } else {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    });
});
