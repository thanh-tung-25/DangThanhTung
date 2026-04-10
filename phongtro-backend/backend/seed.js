const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
    try {
        const conn = await mysql.createConnection({host: 'localhost', user: 'root', password: '123456', database: 'phongtro_db'});
        await conn.query(`
            CREATE TABLE IF NOT EXISTS fines (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                admin_id BIGINT NOT NULL,
                amount DECIMAL(15,2) NOT NULL,
                reason TEXT NOT NULL,
                status ENUM('UNPAID', 'PAID') DEFAULT 'UNPAID',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (admin_id) REFERENCES users(id)
            );
        `);
        console.log('Table fines ensured.');

        const hashedPassword = await bcrypt.hash('08042005a@', 10);
        
        await conn.query("DELETE FROM users WHERE email = 'admin@gmail.com' OR username = 'admin@gmail.com'");
        await conn.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)", ['admin@gmail.com', 'admin@gmail.com', hashedPassword, 'ADMIN']);
        console.log('Admin account created/re-created successfully.');
        
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
})();
