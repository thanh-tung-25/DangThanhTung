import { api } from '../../tai_nguyen/js/api.js';

export const hopDongService = {
    // Lấy danh sách hợp đồng (Của tôi)
    async layDanhSach() {
        return await api.get('/hopdong');
    },

    // Tạo hợp đồng mới (Thường do Người thuê gọi API này)
    async taoHopDong(data) {
        // data: { room_id, start_date, end_date }
        return await api.post('/hopdong', data);
    },

    // Xác nhận hợp đồng
    async xacNhan(id) {
        return await api.patch(`/hopdong/${id}/xac-nhan`);
    }
};
