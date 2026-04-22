
const db = require("../config/db");

// TẠO PHÒNG
const taoPhong = async (data, user) => {
    const { title, description, price } = data;

    await db.query(
        "INSERT INTO rooms (title, description, price, owner_id) VALUES (?, ?, ?, ?)",
        {
            replacements: [title, description, price, user.id]
        }
    );
};

// LẤY TẤT CẢ PHÒNG
const layTatCaPhong = async () => {
    const [rows] = await db.query("SELECT * FROM rooms");
    return rows;
};

// LẤY PHÒNG CỦA TÔI
const layPhongCuaToi = async (user) => {
    const [rows] = await db.query(
        "SELECT * FROM rooms WHERE owner_id = ?",
        {
            replacements: [user.id]
        }
    );
    return rows;
};

// XOÁ PHÒNG
const xoaPhong = async (id, user) => {
    await db.query(
        "DELETE FROM rooms WHERE id = ? AND owner_id = ?",
        {
            replacements: [id, user.id]
        }
    );
};

// CẬP NHẬT TRẠNG THÁI
const capNhatTrangThai = async (id, status, user) => {
    await db.query(
        "UPDATE rooms SET status = ? WHERE id = ? AND owner_id = ?",
        {
            replacements: [status, id, user.id]
        }
    );
};

// SỬA THÔNG TIN PHÒNG
const suaPhong = async (id, data, user) => {
    const { title, description, price } = data;
    await db.query(
        "UPDATE rooms SET title = ?, description = ?, price = ? WHERE id = ? AND owner_id = ?",
        {
            replacements: [title, description, price, id, user.id]
        }
    );
};

module.exports = {
    taoPhong,
    layTatCaPhong,
    layPhongCuaToi,
    xoaPhong,
    capNhatTrangThai,
    suaPhong
};

