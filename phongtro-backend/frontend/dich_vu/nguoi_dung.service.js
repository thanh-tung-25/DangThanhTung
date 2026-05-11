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
        // Mô phỏng việc gọi API thành công (do backend chưa hỗ trợ PUT)
        // Cập nhật trực tiếp vào bộ nhớ cục bộ để UI thay đổi ngay
        const updatedUser = { ...auth.user, ...data };
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(updatedUser));
        auth.user = updatedUser;
        return updatedUser;
    },

    // Bước 24: Đổi mật khẩu
    async doiMatKhau(oldPassword, newPassword) {
        // Kiểm tra validate cơ bản
        if (!oldPassword || !newPassword) throw new Error("Vui lòng nhập đầy đủ mật khẩu");
        if (newPassword.length < 6) throw new Error("Mật khẩu mới phải dài hơn 6 ký tự");
        
        // Mô phỏng gọi API thành công (do backend chưa có route đổi pass)
        return { success: true, message: "Đổi mật khẩu thành công" };
    }
};
