import { api, showToast } from './api.js';

export const auth = {
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
    
    getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    async login(username, password) {
        try {
            const data = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            showToast('Đăng nhập thành công!', 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    },

    async register(username, password) {
        try {
            await api.post('/auth/register', { username, password });
            showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            return true;
        } catch (error) {
            showToast(error.message, 'error');
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast('Đã đăng xuất', 'success');
        window.location.href = '/';
    },
    
    updateNavbar() {
        const navSection = document.getElementById('nav-auth-section');
        if (!navSection) return;
        
        if (this.isAuthenticated()) {
            const user = this.getUser();
            navSection.innerHTML = `
                <span class="text-cyan" style="margin-right: 1rem;"><i class="fa-solid fa-user"></i> ${user?.username || 'User'}</span>
                <a href="/dashboard" class="btn btn-outline" data-link>Dashboard</a>
                <button id="btn-logout" class="btn btn-primary">Đăng Xuất</button>
            `;
            
            document.getElementById('btn-logout')?.addEventListener('click', () => {
                this.logout();
            });
        } else {
            navSection.innerHTML = `
                <a href="/login" class="btn btn-outline" data-link>Đăng Nhập</a>
                <a href="/register" class="btn btn-primary" data-link>Đăng Ký</a>
            `;
        }
    }
};
