import CONFIG from '../../cau_hinh/cau_hinh.js';
import { auth } from './xac_thuc.js';

export const socketService = {
    socket: null,

    connect() {
        if (!auth.user) return; // Chỉ connect khi đã đăng nhập

        // Kết nối tới Socket.IO server
        this.socket = io(CONFIG.SOCKET_URL, {
            auth: {
                token: localStorage.getItem(CONFIG.TOKEN_KEY)
            },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity
        });

        this.socket.on('connect', () => {
            console.log('Đã kết nối Socket.IO');
            // Join vào room mang ID của mình để nhận tin nhắn cá nhân
            this.socket.emit('join', auth.user.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Mất kết nối Socket.IO');
        });

        this.socket.on('connect_error', (err) => {
            console.error('Lỗi kết nối Socket.IO:', err.message);
        });
    },

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    },

    // Đăng ký lắng nghe sự kiện nhắn tin
    onReceiveMessage(callback) {
        if (!this.socket) return;
        this.socket.on('receive_message', callback);
    },

    // Đăng ký lắng nghe sự kiện nhắn tin nhóm
    onReceiveGroupMessage(callback) {
        if (!this.socket) return;
        this.socket.on('receive_group_message', callback);
    },

    // Phát đi sự kiện đang gõ phím (Typing)
    emitTyping(receiverId) {
        if (this.socket) {
            this.socket.emit('typing', { receiverId, senderId: auth.user.id });
        }
    },

    // Lắng nghe sự kiện ai đó đang gõ phím
    onTyping(callback) {
        if (!this.socket) return;
        this.socket.on('user_typing', callback);
    }
};
