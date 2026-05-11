import { api } from '../../tai_nguyen/js/api.js';
import CONFIG from '../../cau_hinh/cau_hinh.js';
import { auth } from '../../tai_nguyen/js/xac_thuc.js';

export const nguoiDungService = {
    // Bước 23: Lấy thông tin user
    async layThongTin() {
        // Hiện tại backend chưa có route GET /nguoidung/me
        // Tạm thời lấy trực tiếp từ phiên đăng nhập (LocalStorage)
        return auth.user; 
    },

    // Bước 23: Cập nhật Profile
    async capNhatProfile(data) {
        const result = await api.put('/nguoidung/profile', data);
        const updatedUser = result.data;
        // Cập nhật trực tiếp vào bộ nhớ cục bộ để UI thay đổi ngay
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(updatedUser));
        auth.user = updatedUser;
        return updatedUser;
    },

    // Bước 24: Đổi mật khẩu
    async doiMatKhau(oldPassword, newPassword) {
        // Kiểm tra validate cơ bản
        if (!oldPassword || !newPassword) throw new Error("Vui lòng nhập đầy đủ mật khẩu");
        if (newPassword.length < 6) throw new Error("Mật khẩu mới phải dài hơn 6 ký tự");
        
        // Gọi API thật
        return await api.put('/nguoidung/password', { currentPassword: oldPassword, newPassword });
    }
};
