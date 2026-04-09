


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

module.exports = {
    taoNhom,
    themThanhVien,
    guiTinNhan
};