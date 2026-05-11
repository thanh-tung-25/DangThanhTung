import { api } from '../../tai_nguyen/js/api.js';

export const phongTroService = {
    // Lấy tất cả phòng của chủ trọ hiện tại
    async layDanhSachCuaToi() {
        return await api.get('/phong/me');
    },

    // Thêm phòng mới
    async themPhong(data) {
        // data: { name, description, price }
        return await api.post('/phong', data);
    },

    // Cập nhật trạng thái phòng (AVAILABLE / RENTED)
    async capNhatTrangThai(id, status) {
        return await api.patch(`/phong/${id}/status`, { status });
    },

    // Xóa phòng
    async xoaPhong(id) {
        return await api.delete(`/phong/${id}`);
    }
};
