const db = require("../config/db");

// TAO BAI DANG
const taoBaiDang = async (data, user) => {
    const { phong_id, noi_dung } = data;

    await db.query(
        "INSERT INTO posts (user_id, room_id, content) VALUES (?, ?, ?)",
        {
            replacements: [user.id, phong_id, noi_dung]
        }
    );
};

// LAY TAT CA
const layTatCa = async () => {
    const [rows] = await db.query(`
        SELECT p.*, u.username, r.title as ten_phong
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN rooms r ON p.room_id = r.id
        ORDER BY p.created_at DESC
    `);
    return rows;
};

// XOA
const xoaBaiDang = async (id, user) => {
    await db.query(
        "DELETE FROM posts WHERE id = ? AND user_id = ?",
        {
            replacements: [id, user.id]
        }
    );
};

module.exports = {
    taoBaiDang,
    layTatCa,
    xoaBaiDang
};