const {
    taoHoiThoai,
    guiTinNhan,
    layDanhSachHoiThoai,
    layTinNhan
} = require("../services/chat.service");

const tao = async (req, res) => {
    const receiver_id = req.body.receiver_id || req.body.user_id;
    try {
        const data = await taoHoiThoai(req.user.id, receiver_id);
        res.json({ success: true, data });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi tạo cuộc hội thoại' });
    }
};

const gui = async (req, res) => {
    const { conversation_id, content, message } = req.body;
    const msgContent = content || message;
    try {
        await guiTinNhan(conversation_id, req.user.id, msgContent);
        // Broadcast qua socket
        const io = req.app.get('io');
        if (io) {
            io.to(conversation_id.toString()).emit('receive_message', {
                conversation_id, sender_id: req.user.id, content: msgContent, created_at: new Date()
            });
        }
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi gửi tin nhắn' });
    }
};

const layConversations = async (req, res) => {
    try {
        const list = await layDanhSachHoiThoai(req.user.id);
        res.json(list);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi lấy hội thoại' });
    }
};

const layMessages = async (req, res) => {
    try {
        const msgs = await layTinNhan(req.params.id, req.user.id);
        res.json(msgs);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi lấy tin nhắn' });
    }
};

module.exports = { tao, gui, layConversations, layMessages };