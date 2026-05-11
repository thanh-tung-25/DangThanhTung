import { api } from './api.js';
import CONFIG from '../../cau_hinh/cau_hinh.js';

export const auth = {
    user: JSON.parse(localStorage.getItem(CONFIG.USER_KEY)) || null,

    async login(username, password) {
        try {
            const data = await api.post('/auth/login', { username, password });
            
            if (data.accessToken) {
                localStorage.setItem(CONFIG.TOKEN_KEY, data.accessToken);
                localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
                this.user = data.user;
                this.redirectByRole(data.user.role);
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    },

    async register(username, password, role) {
        try {
            await api.post('/auth/register', { username, password, role });
            return true;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
        this.user = null;
        const basePath = window.location.pathname.split('../../')[0] + '../../trang';
        window.location.href = basePath + '/xac_thuc/dang_nhap.html';
    },

    redirectByRole(role) {
        // Lấy đúng đường dẫn gốc (giữ lại phần /DangThanhTung/phongtro-backend nếu có)
        const basePath = window.location.pathname.split('../../')[0] + '../../trang';
        
        switch (role) {
            case 'ADMIN':
            case 'admin':
                window.location.href = basePath + '/admin/bang_dieu_khien.html';
                break;
            case 'LANDLORD':
            case 'CHU_TRO':
                window.location.href = basePath + '/chu_tro/bang_dieu_khien.html';
                break;
            case 'TENANT':
            case 'NGUOI_THUE':
                window.location.href = basePath + '/nguoi_thue/bang_tin.html';
                break;
            default:
                window.location.href = basePath + '/xac_thuc/dang_nhap.html';
        }
    },

    // Kiểm tra quyền truy cập route
    checkAuth(requiredRole = null) {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        const currentUser = this.user;
        const basePath = window.location.pathname.split('../../')[0] + '../../trang';

        // Chưa đăng nhập -> đá về trang đăng nhập
        if (!token || !currentUser) {
            window.location.href = basePath + '/xac_thuc/dang_nhap.html';
            return false;
        }

        // Đã đăng nhập nhưng sai Role -> đá về trang chủ của Role đó
        if (requiredRole) {
            let roleMatch = false;
            const r = currentUser.role;
            if (requiredRole === 'LANDLORD' && (r === 'LANDLORD' || r === 'CHU_TRO')) roleMatch = true;
            if (requiredRole === 'TENANT' && (r === 'TENANT' || r === 'NGUOI_THUE')) roleMatch = true;
            if (requiredRole === 'ADMIN' && (r === 'ADMIN' || r === 'admin')) roleMatch = true;
            
            if (!roleMatch && currentUser.role === requiredRole) roleMatch = true; // For generic match

            if (!roleMatch) {
                alert('Bạn không có quyền truy cập trang này!');
                this.redirectByRole(currentUser.role);
                return false;
            }
        }

        return true;
    },
    
    // Ngăn chặn người dùng ĐÃ đăng nhập vào lại trang Login / Register
    checkGuest() {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        if (token && this.user) {
            this.redirectByRole(this.user.role);
            return false;
        }
        return true;
    }
};
