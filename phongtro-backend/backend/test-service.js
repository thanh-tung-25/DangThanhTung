require('dotenv').config();
const { registerService } = require("./src/services/auth.service");

async function test() {
    try {
        await registerService({ username: 'testuser2', password: '123', role: 'CHU_TRO' });
        console.log("Success");
    } catch(err) {
        console.error("DB Error:", err);
    }
    process.exit(0);
}
test();
