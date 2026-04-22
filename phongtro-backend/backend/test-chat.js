require('dotenv').config();
const db = require("./src/config/db");

async function testQuery() {
    try {
        console.log("Testing fetch convos list...");
        const [rows] = await db.query(`
            SELECT c.id as conversation_id, u.username as name, cm2.user_id as opponent_id
            FROM conversation_members cm1
            JOIN conversations c ON cm1.conversation_id = c.id
            JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id != cm1.user_id
            JOIN users u ON cm2.user_id = u.id
            WHERE cm1.user_id = 1
            ORDER BY c.created_at DESC
        `);
        console.log("Convos List:", rows);
    } catch(err) {
        console.error("Error layDanhSachHoiThoai:", err.message);
    }

    try {
        console.log("Testing search convo existence...");
        const user1 = 1; const user2 = 2;
        const [exist] = await db.query(`
            SELECT cm1.conversation_id as id
            FROM conversation_members cm1
            JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
            WHERE cm1.user_id = ? AND cm2.user_id = ?
        `, { replacements: [user1, user2] });
        console.log("Exist:", exist);
    } catch(err) {
        console.error("Error search convo:", err.message);
    }

    try {
        console.log("Testing taoHoiThoai...");
        const [res] = await db.query("INSERT INTO conversations () VALUES ()");
        console.log("Insert ID:", res.insertId);
    } catch(err) {
        console.error("Error taoHoiThoai:", err.message);
    }

    try {
        console.log("Testing layLichSuTinNhan...");
        const [rows2] = await db.query(`
            SELECT m.*, u.username as name
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = 1
            ORDER BY m.created_at ASC
        `);
        console.log("History:", rows2);
    } catch(err) {
        console.error("Error layLichSuTinNhan:", err.message);
    }

    process.exit(0);
}

testQuery();
