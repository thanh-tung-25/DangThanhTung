import { auth } from '../js/auth.js';
import { router } from '../js/router.js';

export function init(mode = 'login') {
    const isLogin = mode === 'login';
    
    // Cập nhật UI theo mode
    document.getElementById('auth-title').innerText = isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản';
    document.getElementById('auth-submit-btn').innerHTML = isLogin ? '<i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập' : '<i class="fa-solid fa-user-plus"></i> Tạo Tài Khoản';
    document.getElementById('auth-switch-text').innerText = isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?';
    
    const switchLink = document.getElementById('auth-switch-link');
    switchLink.innerText = isLogin ? 'Đăng ký ngay' : 'Đăng nhập';
    switchLink.setAttribute('href', isLogin ? '/register' : '/login');

    const form = document.getElementById('auth-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('auth-submit-btn');
        
        // Loading state
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Đang xử lý...';
        btn.disabled = true;

        try {
            if (isLogin) {
                const success = await auth.login(username, password);
                if (success) {
                    router.navigate('/');
                }
            } else {
                const success = await auth.register(username, password);
                if (success) {
                    router.navigate('/login');
                }
            }
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}
