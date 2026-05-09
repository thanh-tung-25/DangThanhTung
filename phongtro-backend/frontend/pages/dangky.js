import { auth } from '../js/auth.js';
import { showToast } from '../js/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('accessToken')) {
        window.location.href = '../index.html';
    }

    const regForm = document.getElementById('register-form');
    if (!regForm) return;

    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('btn-register');
        const originalContent = btn.innerHTML;
        
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        // Get selected role
        const roleRadios = document.getElementsByName('role');
        let role = 'TENANT';
        for (const radio of roleRadios) {
            if (radio.checked) {
                role = radio.value;
                break;
            }
        }

        if (password !== confirm) {
            showToast('Mật khẩu xác nhận không khớp', 'error');
            document.getElementById('reg-confirm').focus();
            return;
        }

        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang khởi tạo...';
        btn.disabled = true;

        const success = await auth.register(username, password, role);
        
        if (success) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Tạo thành công!';
            btn.style.background = 'var(--clr-success)';
            setTimeout(() => {
                window.location.href = 'dangnhap.html';
            }, 1500);
        } else {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    });
});
