import { api, showToast } from './api.js';

export const auth = {
    user: null,

    async init() {
        // Decode token to get user info without API call if possible,
        // or just call an auth/me endpoint to verify.
        // For now, we will decode JWT locally for role checking
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                this.user = this.parseJwt(token);
                this.updateNavbar();
            } catch (e) {
                console.error("Invalid token");
                this.logout(false);
            }
        } else {
            this.updateNavbar();
        }

        // Setup global logout listener
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btn-logout' || e.target.closest('#btn-logout')) {
                this.logout();
            }
        });
    },

    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    },

    isAuthenticated() {
        return this.user !== null;
    },

    getRole() {
        return this.user ? this.user.role : null;
    },

    async login(username, password) {
        try {
            const response = await api.post('/auth/login', { username, password });
            
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            
            this.user = this.parseJwt(response.accessToken);
            this.updateNavbar();
            return true;
        } catch (error) {
            showToast(error.message || 'Đăng nhập thất bại', 'error');
            return false;
        }
    },

    async register(username, password, role) {
        try {
            await api.post('/auth/register', { username, password, role });
            return true;
        } catch (error) {
            showToast(error.message || 'Đăng ký thất bại', 'error');
            return false;
        }
    },

    async logout(callApi = true) {
        if (callApi && localStorage.getItem('refreshToken')) {
            try {
                await api.post('/auth/logout', { 
                    refreshToken: localStorage.getItem('refreshToken') 
                });
            } catch (e) { console.warn(e); }
        }
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.user = null;
        this.updateNavbar();
        
        const basePathMatch = window.location.pathname.match(/^(\/.*?\/frontend)/i);
        const basePath = basePathMatch ? basePathMatch[1] : '';
        window.location.href = basePath + '/pages/dangnhap.html';
    },

    updateNavbar() {
        const nav = document.getElementById('main-nav');
        const navLinks = document.getElementById('nav-links');
        const navUsername = document.getElementById('nav-username');

        if (!nav || !navLinks) return;

        // Hide navbar on auth pages
        const path = window.location.pathname;
        if (path.includes('dangnhap.html') || path.includes('dangky.html')) {
            nav.style.display = 'none';
            return;
        }

        nav.style.display = 'block';

        if (this.isAuthenticated()) {
            navUsername.textContent = this.user.username || (this.user.role === 'LANDLORD' ? 'Chủ Trọ' : 'Người Thuê');
            
            const basePathMatch = window.location.pathname.match(/^(\/.*?\/frontend)/i);
            const basePath = basePathMatch ? basePathMatch[1] : '';

            let linksHtml = '';
            if (this.user.role === 'LANDLORD') {
                linksHtml = `
                    <a href="${basePath}/pages/landlord/trangchu.html" class="nav-item"><i class="fa-solid fa-house"></i> Bảng điều khiển</a>
                    <a href="${basePath}/pages/landlord/tinnhan.html" class="nav-item"><i class="fa-solid fa-comments"></i> Tin nhắn</a>
                    <a href="${basePath}/pages/landlord/quanlyphong.html" class="nav-item"><i class="fa-solid fa-door-open"></i> Quản lý phòng</a>
                    <a href="${basePath}/pages/landlord/hopdong.html" class="nav-item"><i class="fa-solid fa-file-contract"></i> Hợp đồng</a>
                `;
            } else if (this.user.role === 'TENANT') {
                linksHtml = `
                    <a href="${basePath}/pages/tenant/feed.html" class="nav-item"><i class="fa-solid fa-house"></i> Trang chủ</a>
                    <a href="${basePath}/pages/tenant/tinnhan.html" class="nav-item"><i class="fa-solid fa-comments"></i> Tin nhắn</a>
                    <a href="${basePath}/pages/tenant/hopdong.html" class="nav-item"><i class="fa-solid fa-file-contract"></i> Hợp đồng</a>
                `;
            } else if (this.user.role === 'ADMIN') {
                linksHtml = `
                    <a href="${basePath}/pages/admin/quanlyuser.html" class="nav-item"><i class="fa-solid fa-users"></i> Quản lý User</a>
                `;
            }
            navLinks.innerHTML = linksHtml;
        } else {
            // Not authenticated, redirect to login
            const basePathMatch = window.location.pathname.match(/^(\/.*?\/frontend)/i);
            const basePath = basePathMatch ? basePathMatch[1] : '';
            window.location.href = basePath + '/pages/dangnhap.html';
        }
    }
};
