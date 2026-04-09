require('dotenv').config();
const db = require("./src/config/db");

async function test() {
    try {
        const [rows] = await db.query("SELECT * FROM users LIMIT 1");
        console.log("Users exist:", rows);
    } catch(err) {
        console.error("DB Error:", err);
    }
    process.exit(0);
}
test();
