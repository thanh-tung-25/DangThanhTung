import { api } from '../../tai_nguyen/js/api.js';

export const thanhToanService = {
    // Lấy lịch sử thanh toán / hóa đơn
    async layDanhSach() {
        return await api.get('/thanhtoan');
    },

    // Tạo hóa đơn mới (Dành cho Chủ trọ)
    async taoHoaDon(contractId, amount) {
        return await api.post('/thanhtoan', { contract_id: contractId, amount });
    },

    // Xác nhận đã thanh toán (Gọi khi người thuê báo đã chuyển khoản thành công)
    async thanhToanHoaDon(id) {
        return await api.patch(`/thanhtoan/${id}`);
    }
};
