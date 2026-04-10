const db = require("./src/config/db");

async function checkSchema() {
    try {
        const [tables] = await db.query("SHOW TABLES");
        for (const t of tables) {
            const tableName = Object.values(t)[0];
            const [columns] = await db.query(`SHOW COLUMNS FROM ${tableName}`);
            console.log(`Table: ${tableName}`);
            console.log(columns.map(c => `  - ${c.Field} (${c.Type})`).join("\n"));
        }
    } catch(err) {
        console.error(err);
    }
    process.exit(0);
}
checkSchema();
