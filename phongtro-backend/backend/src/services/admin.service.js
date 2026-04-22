const db = require("../config/db");

const phatNguoiDung = async (admin_id, user_id, amount, reason) => {
    if (!amount || isNaN(amount) || amount <= 0) throw new Error("Số tiền phạt không hợp lệ");
    if (!reason || reason.trim() === "") throw new Error("Thiếu lý do phạt");
    
    const [u] = await db.query("SELECT id FROM users WHERE id = ?", { replacements: [user_id] });
    if (u.length === 0) throw new Error("Không tìm thấy người dùng này trong hệ thống");

    const [result] = await db.query(
        "INSERT INTO fines (user_id, admin_id, amount, reason, status) VALUES (?, ?, ?, ?, 'UNPAID')",
        { replacements: [user_id, admin_id, amount, reason] }
    );
    return result.insertId;
};

const layNguoiDung = async () => {
    const [rows] = await db.query(
        "SELECT id, username, email, role, phone, created_at FROM users ORDER BY created_at DESC"
    );
    return rows;
};

const layPhieuPhat = async () => {
    const [rows] = await db.query(`
        SELECT f.*, u.username as user_name, a.username as admin_name
        FROM fines f
        JOIN users u ON f.user_id = u.id
        JOIN users a ON f.admin_id = a.id
        ORDER BY f.created_at DESC
    `);
    return rows;
};

const danhDauDaNop = async (fine_id) => {
    await db.query(
        "UPDATE fines SET status = 'PAID' WHERE id = ?",
        { replacements: [fine_id] }
    );
};

module.exports = { phatNguoiDung, layNguoiDung, layPhieuPhat, danhDauDaNop };
