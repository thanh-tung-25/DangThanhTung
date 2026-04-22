


const db = require("../config/db");

// TAO HOI THOAI
const taoHoiThoai = async (user1, user2) => {
    // Check if convo already exists
    const [exist] = await db.query(`
        SELECT cm1.conversation_id as id
        FROM conversation_members cm1
        JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
        WHERE cm1.user_id = ? AND cm2.user_id = ?
    `, { replacements: [user1, user2] });

    if (exist.length > 0) return exist[0].id;

    const [res] = await db.query("INSERT INTO conversations () VALUES ()");
    const convoId = res; // MySQL Sequelize returns insertId directly as the first array item

    await db.query(
        "INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)",
        {
            replacements: [convoId, user1, convoId, user2]
        }
    );

    return convoId;
};

// ============= SOCKET IO =============
let io;
const setChatIO = (_io) => { io = _io; };

// GUI TIN NHAN
const guiTinNhan = async (conversation_id, sender_id, message) => {
    await db.query(
        "INSERT INTO messages (conversation_id, sender_id, message) VALUES (?, ?, ?)",
        {
            replacements: [conversation_id, sender_id, message]
        }
    );

    if (io) {
        // Emit to the opponent
        const [members] = await db.query(
            "SELECT user_id FROM conversation_members WHERE conversation_id = ? AND user_id != ?",
            { replacements: [conversation_id, sender_id] }
        );
        if(members.length > 0) {
            const opponentId = members[0].user_id;
            io.to(opponentId.toString()).emit("receiveMessage", {
                conversation_id,
                sender_id,
                message,
                created_at: new Date()
            });
        }
    }
};

const layDanhSachHoiThoai = async (user_id) => {
    const [rows] = await db.query(`
        SELECT c.id as conversation_id, COALESCE(u.fullname, u.username) as name, cm2.user_id as opponent_id
        FROM conversation_members cm1
        JOIN conversations c ON cm1.conversation_id = c.id
        JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id != cm1.user_id
        JOIN users u ON cm2.user_id = u.id
        WHERE cm1.user_id = ?
        ORDER BY c.created_at DESC
    `, { replacements: [user_id] });
    return rows;
};

const layLichSuTinNhan = async (conversation_id) => {
    const [rows] = await db.query(`
        SELECT m.*, COALESCE(u.fullname, u.username) as name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
    `, { replacements: [conversation_id] });
    return rows;
};

module.exports = {
    taoHoiThoai,
    guiTinNhan,
    layDanhSachHoiThoai,
    layLichSuTinNhan,
    setChatIO
};