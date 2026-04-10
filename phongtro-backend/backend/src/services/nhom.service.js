


const db = require("../config/db");

// TAO NHOM
const taoNhom = async (name, user) => {
    const [res] = await db.query(
        "INSERT INTO chat_groups (name, owner_id) VALUES (?, ?)",
        {
            replacements: [name, user.id]
        }
    );

    // res trong Sequelize với MySQL insert đã là number (insertId)
    const groupId = res;

    // thêm owner vào nhóm
    await db.query(
        "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
        {
            replacements: [groupId, user.id]
        }
    );

    return groupId;
};

// THEM THANH VIEN
const themThanhVien = async (group_id, user_id) => {
    await db.query(
        "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
        {
            replacements: [group_id, user_id]
        }
    );
};

// GUI TIN NHAN NHOM
const guiTinNhan = async (group_id, sender_id, message) => {
    await db.query(
        "INSERT INTO group_messages (group_id, sender_id, message) VALUES (?, ?, ?)",
        {
            replacements: [group_id, sender_id, message]
        }
    );
};

// LẤY DANH SÁCH NHÓM
const layDanhSachNhom = async (user) => {
    const [rows] = await db.query(`
        SELECT g.* 
        FROM chat_groups g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
        ORDER BY g.created_at DESC
    `, { replacements: [user.id] });
    return rows;
};

// LẤY TIN NHẮN NHÓM
const layTinNhanNhom = async (group_id, user_id) => {
    const [members] = await db.query(`
        SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?
    `, { replacements: [group_id, user_id] });
    if (members.length === 0) throw new Error("Ban khong thuoc nhom nay");

    const [rows] = await db.query(`
        SELECT m.*, u.username, u.fullname, u.role
        FROM group_messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.group_id = ?
        ORDER BY m.created_at ASC
    `, { replacements: [group_id] });
    return rows;
};

module.exports = {
    taoNhom,
    themThanhVien,
    guiTinNhan,
    layDanhSachNhom,
    layTinNhanNhom
};