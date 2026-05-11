import { auth } from './xac_thuc.js';
import { socketService } from './socket.js';
import { thongBaoService } from '../../dich_vu/thong_bao.service.js';

export const app = {
    unreadCount: 0,

    async init(pageTitle, requiredRole) {
        // Protect route
        const isAuthenticated = await auth.checkAuth(requiredRole);
        if (!isAuthenticated) return;

        // Load components (relative from HTML files inside trang/role/)
        await this.loadComponent('sidebar-container', '../../thanh_phan/sidebar.html');
        await this.loadComponent('navbar-container', '../../thanh_phan/navbar.html');

        // Thêm Toast Container (Bước 20)
        this.initToastContainer();

        // Setup UI
        document.getElementById('page-title').textContent = pageTitle;
        if (auth.user) {
            document.getElementById('user-name').textContent = auth.user.username;
            document.getElementById('user-avatar').textContent = auth.user.username[0].toUpperCase();
        }

        // Setup logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => auth.logout());
        }

        // Highlight active menu
        const currentPath = window.location.pathname;
        document.querySelectorAll('.sidebar-menu a').forEach(a => {
            if (a.getAttribute('href') === currentPath) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });

        // Cấu hình Nút Mobile Menu
        const btnMenu = document.getElementById('btn-mobile-menu');
        if (btnMenu) {
            btnMenu.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('open');
                    
                    // Thêm/Xóa overlay
                    let overlay = document.querySelector('.sidebar-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.className = 'sidebar-overlay';
                        document.body.appendChild(overlay);
                        overlay.addEventListener('click', () => {
                            sidebar.classList.remove('open');
                            overlay.classList.remove('open');
                        });
                    }
                    if (sidebar.classList.contains('open')) {
                        overlay.classList.add('open');
                    } else {
                        overlay.classList.remove('open');
                    }
                }
            });
        }

        // Lắng nghe Lỗi Toàn Cục (Bước 26)
        window.addEventListener('apiError', (e) => {
            this.showToast('Lỗi Hệ Thống', e.detail || 'Có lỗi xảy ra', 'error');
        });

        // Kết nối Socket và lắng nghe Thông báo (Bước 19 & 20)
        this.setupGlobalNotifications();
    },

    async loadComponent(containerId, url) {
        const container = document.getElementById(containerId);
        if (!container) return;
        try {
            const res = await fetch(url);
            if (res.ok) {
                let html = await res.text();
                // Tự động sửa lại các link /frontend/ cho chuẩn với thư mục gốc của XAMPP
                const rootPath = window.location.pathname.split('../../')[0];
                html = html.replace(/href="\/frontend\//g, `href="${rootPath}/frontend/`);
                container.innerHTML = html;
            }
        } catch (e) {
            console.error(`Failed to load ${url}`, e);
        }
    },

    initToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    },

    showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        
        let icon = 'fa-info-circle';
        if (type === 'CONTRACT') icon = 'fa-file-signature';
        else if (type === 'CHAT') icon = 'fa-comment-dots';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-times"></i></button>
        `;

        container.appendChild(toast);

        // Hiệu ứng slide in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto hide sau 4 giây (Bước 20)
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    async setupGlobalNotifications() {
        if (!socketService.socket) {
            socketService.connect();
        }

        // Đếm số lượng chưa đọc ban đầu (Bước 19)
        try {
            const res = await thongBaoService.layDanhSach();
            const notifs = Array.isArray(res) ? res : (res.data || []);
            this.unreadCount = notifs.filter(n => !n.is_read).length;
            this.updateBadge();
        } catch (error) {
            console.error("Lỗi lấy thông báo ban đầu", error);
        }

        // Lắng nghe sự kiện notification từ backend socket
        socketService.socket.on('notification', (data) => {
            // Bước 20: Hiện Toast popup
            this.showToast('Thông báo mới', data.content, data.type);
            
            // Bước 19: Tăng số lượng badge
            this.unreadCount++;
            this.updateBadge();

            // Nếu đang đứng ở trang Thông Báo thì reload lại list
            if (window.location.pathname.includes('/thong_bao.html') && typeof window.loadNotifications === 'function') {
                window.loadNotifications();
            }
        });
    },

    updateBadge() {
        // Cập nhật tất cả các thẻ có id="notif-badge" hoặc cấu trúc tương tự trong menu
        const menuItems = document.querySelectorAll('.sidebar-menu a[href*="thong_bao.html"]');
        menuItems.forEach(item => {
            let badge = item.querySelector('.badge-unread');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge-unread';
                item.appendChild(badge);
            }
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        });
    }
};
