require('dotenv').config();
const db = require("./src/config/db");

async function testQuery() {
    try {
        const result = await db.query("INSERT INTO conversations () VALUES ()");
        console.log("Full Result array length:", result.length);
        console.log("Result[0]:", result[0]);
        console.log("Result[1]:", result[1]);
    } catch(err) {
        console.error("Error taoHoiThoai:", err.message);
    }
    process.exit(0);
}

testQuery();
