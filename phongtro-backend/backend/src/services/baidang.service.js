const db = require("../config/db");

// TAO BAI DANG
const taoBaiDang = async (data, user) => {
    const { content, price, area } = data;

    const [result] = await db.query(
        "INSERT INTO posts (user_id, room_id, content, price, area) VALUES (?, NULL, ?, ?, ?)",
        { replacements: [user.id, content, price || null, area || null] }
    );
    return result.insertId;
};

// LAY TAT CA - join username và user_id để frontend dùng liên hệ
const layTatCa = async () => {
    const [rows] = await db.query(`
        SELECT p.*, u.username, u.id as user_id
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `);
    return rows;
};

// XOA
const xoaBaiDang = async (id, user) => {
    const [result] = await db.query(
        "DELETE FROM posts WHERE id = ? AND user_id = ?",
        { replacements: [id, user.id] }
    );
    if (result.affectedRows === 0) throw new Error("Không tìm thấy bài viết hoặc bạn không có quyền xóa");
};

module.exports = {
    taoBaiDang,
    layTatCa,
    xoaBaiDang
};