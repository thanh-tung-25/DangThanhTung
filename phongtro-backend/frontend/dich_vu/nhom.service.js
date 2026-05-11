import { api } from '../../tai_nguyen/js/api.js';

export const nhomService = {
    // Lấy danh sách nhóm của tôi
    async layDanhSachNhom() {
        return await api.get('/nhom');
    },

    // Lấy tin nhắn trong nhóm
    async layTinNhanNhom(groupId) {
        return await api.get(`/nhom/${groupId}/messages`);
    },

    // Tạo nhóm mới
    async taoNhom(name) {
        return await api.post('/nhom/tao', { name });
    },

    // Thêm thành viên vào nhóm
    async themThanhVien(groupId, userId) {
        return await api.post('/nhom/them', { group_id: groupId, user_id: userId });
    },

    // Gửi tin nhắn nhóm
    async guiTinNhanNhom(groupId, content) {
        return await api.post('/nhom/gui', { group_id: groupId, content });
    }
};
