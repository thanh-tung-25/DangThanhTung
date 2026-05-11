import { api } from '../../tai_nguyen/js/api.js';

export const thongBaoService = {
    // Lấy danh sách thông báo
    async layDanhSach() {
        return await api.get('/thongbao');
    },

    // Đánh dấu thông báo là đã đọc
    async danhDauDaDoc(id) {
        return await api.patch(`/thongbao/${id}`);
    }
};
