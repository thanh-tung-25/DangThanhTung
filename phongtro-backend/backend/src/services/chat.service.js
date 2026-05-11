const db = require("../config/db");

// TAO HOI THOAI - hoặc lấy nếu đã tồn tại
const taoHoiThoai = async (user1, user2) => {
    // Kiểm tra đã có hội thoại chưa
    const [existing] = await db.query(
        `SELECT c.id FROM conversations c
         JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = ?
         JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id = ?
         LIMIT 1`,
        { replacements: [user1, user2] }
    );

    if (existing.length > 0) {
        return { id: existing[0].id, existed: true };
    }

    const [res] = await db.query("INSERT INTO conversations () VALUES ()");
    const convoId = res.insertId;

    await db.query(
        "INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)",
        { replacements: [convoId, user1, convoId, user2] }
    );

    return { id: convoId, existed: false };
};

// GUI TIN NHAN
const guiTinNhan = async (conversation_id, sender_id, content) => {
    await db.query(
        "INSERT INTO messages (conversation_id, sender_id, message) VALUES (?, ?, ?)",
        { replacements: [conversation_id, sender_id, content] }
    );
};

// LAY DANH SACH HOI THOAI CUA USER
const layDanhSachHoiThoai = async (userId) => {
    const [rows] = await db.query(
        `SELECT 
            c.id,
            c.created_at,
            u.id as other_user_id,
            u.username as other_username,
            (SELECT m.message FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
            (SELECT m.created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_time
         FROM conversations c
         JOIN conversation_members cm ON c.id = cm.conversation_id AND cm.user_id = ?
         JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id != ?
         JOIN users u ON u.id = cm2.user_id
         ORDER BY last_time DESC`,
        { replacements: [userId, userId] }
    );

    return rows.map(r => ({
        id: r.id,
        created_at: r.created_at,
        last_message: r.last_message,
        last_time: r.last_time,
        other_user: { id: r.other_user_id, username: r.other_username }
    }));
};

// LAY TIN NHAN TRONG HOI THOAI
const layTinNhan = async (conversationId, userId) => {
    // Verify user is member
    const [member] = await db.query(
        "SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?",
        { replacements: [conversationId, userId] }
    );
    if (!member.length) throw new Error("Unauthorized");

    const [rows] = await db.query(
        `SELECT m.id, m.conversation_id, m.sender_id, m.message as content, m.created_at, u.username as sender_name
         FROM messages m
         JOIN users u ON u.id = m.sender_id
         WHERE m.conversation_id = ?
         ORDER BY m.created_at ASC`,
        { replacements: [conversationId] }
    );

    return rows;
};

module.exports = {
    taoHoiThoai,
    guiTinNhan,
    layDanhSachHoiThoai,
    layTinNhan
};