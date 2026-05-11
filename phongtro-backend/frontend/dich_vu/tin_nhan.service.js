import { api } from '../../tai_nguyen/js/api.js';

export const tinNhanService = {
    // Lấy danh sách các cuộc trò chuyện (Conversations)
    async layDanhSachHoiThoai() {
        return await api.get('/chat/conversations');
    },

    // Lấy lịch sử tin nhắn của một cuộc trò chuyện
    async layTinNhan(conversationId) {
        return await api.get(`/chat/messages/${conversationId}`);
    },

    // Tạo cuộc trò chuyện mới với một người (hoặc trả về ID nếu đã có)
    async taoHoiThoai(receiverId) {
        return await api.post('/chat/tao', { receiver_id: receiverId });
    },

    // Gửi tin nhắn
    async guiTinNhan(conversationId, content) {
        return await api.post('/chat/gui', { conversation_id: conversationId, content });
    }
};
