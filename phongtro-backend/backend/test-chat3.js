require('dotenv').config();
const db = require("./src/config/db");

async function cleanupDB() {
    try {
        const res1 = await db.query("DELETE FROM conversation_members WHERE conversation_id IS NULL");
        const res2 = await db.query("DELETE FROM conversations WHERE id NOT IN (SELECT conversation_id FROM conversation_members)");
        console.log("Cleanup:", res1, res2);
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}

cleanupDB();
