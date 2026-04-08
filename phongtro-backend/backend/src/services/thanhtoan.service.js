const db = require("../config/db");

// TAO PAYMENT
const taoThanhToan = async (contract_id, amount) => {
    await db.query(
        "INSERT INTO payments (contract_id, amount) VALUES (?, ?)",
        {
            replacements: [contract_id, amount]
        }
    );
};

// THANH TOAN
const thanhToan = async (id) => {
    // lấy payment
    const [rows] = await db.query(
        "SELECT * FROM payments WHERE id = ?",
        { replacements: [id] }
    );

    const payment = rows[0];

    // update paid
    await db.query(
        "UPDATE payments SET status = 'PAID' WHERE id = ?",
        { replacements: [id] }
    );

    // 👉 ADD thông báo
    await taoThongBao(
        payment.contract_id, // tạm dùng (sau nâng cấp sẽ join user)
        "Thanh toan thanh cong",
        "PAYMENT"
    );
};

module.exports = {
    taoThanhToan,
    thanhToan
};