import { api } from '../../tai_nguyen/js/api.js';

export const baiVietService = {
    // Lấy danh sách bài viết
    async layDanhSach() {
        return await api.get('/baidang');
    },

    // Tạo bài viết mới
    async taoBai(data) {
        // data cần có: { content, price, area }
        // Lưu ý: Backend hiện tại chưa hỗ trợ upload ảnh và cập nhật (PUT), nên ta chỉ gọi POST
        return await api.post('/baidang', data);
    },

    // Xóa bài viết
    async xoaBai(id) {
        return await api.delete(`/baidang/${id}`);
    }
};
