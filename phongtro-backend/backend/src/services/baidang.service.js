const db = require("../config/db");

// TAO BAI DANG
const taoBaiDang = async (data, user) => {
    const { phong_id, noi_dung, province, district, ward } = data;

    await db.query(
        "INSERT INTO posts (user_id, room_id, content, province, district, ward) VALUES (?, ?, ?, ?, ?, ?)",
        {
            replacements: [user.id, phong_id, noi_dung, province || null, district || null, ward || null]
        }
    );
};

// LAY TAT CA
const layTatCa = async () => {
    const [rows] = await db.query(`
        SELECT p.*, COALESCE(u.fullname, u.username) as username, r.title as ten_phong
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN rooms r ON p.room_id = r.id
        ORDER BY p.created_at DESC
    `);
    return rows;
};

// XOA
const xoaBaiDang = async (id, user) => {
    if (user.role === 'ADMIN') {
        await db.query("DELETE FROM posts WHERE id = ?", { replacements: [id] });
    } else {
        await db.query("DELETE FROM posts WHERE id = ? AND user_id = ?", { replacements: [id, user.id] });
    }
};

// SUA
const suaBaiDang = async (id, data, user) => {
    const { noi_dung, province, district, ward } = data;
    if (user.role === 'ADMIN') {
        await db.query(
            "UPDATE posts SET content = ?, province = ?, district = ?, ward = ? WHERE id = ?",
            { replacements: [noi_dung, province || null, district || null, ward || null, id] }
        );
    } else {
        await db.query(
            "UPDATE posts SET content = ?, province = ?, district = ?, ward = ? WHERE id = ? AND user_id = ?",
            { replacements: [noi_dung, province || null, district || null, ward || null, id, user.id] }
        );
    }
};

module.exports = {
    taoBaiDang,
    layTatCa,
    xoaBaiDang,
    suaBaiDang
};