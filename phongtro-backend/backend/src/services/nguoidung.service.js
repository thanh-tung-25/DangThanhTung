const db = require("../config/db");
const bcrypt = require("bcrypt");

const updateProfileService = async (userId, data) => {
    // Đảm bảo các cột full_name, phone, email tồn tại trong DB (nếu chưa có thì bổ sung thủ công)
    // data có thể chứa: fullName, phone, email
    const { fullName, phone, email } = data;

    // Do MySQL Sequelize/raw query có thể báo lỗi nếu cột chưa có, ta cứ thử update
    try {
        await db.query(
            "UPDATE users SET full_name = ?, phone = ?, email = ? WHERE id = ?",
            { replacements: [fullName || null, phone || null, email || null, userId] }
        );
    } catch (error) {
        // Nếu lỗi do thiếu cột (ER_BAD_FIELD_ERROR), tự động thêm cột
        if (error.message.includes("Unknown column")) {
            console.log("Tự động thêm cột vào bảng users...");
            await db.query("ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NULL, ADD COLUMN phone VARCHAR(20) NULL, ADD COLUMN email VARCHAR(255) NULL");
            // Thử lại
            await db.query(
                "UPDATE users SET full_name = ?, phone = ?, email = ? WHERE id = ?",
                { replacements: [fullName || null, phone || null, email || null, userId] }
            );
        } else {
            throw error;
        }
    }

    // Lấy lại user sau khi update
    const [rows] = await db.query("SELECT id, username, role, full_name, phone, email FROM users WHERE id = ?", { replacements: [userId] });
    return rows[0];
};

const changePasswordService = async (userId, currentPassword, newPassword) => {
    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", { replacements: [userId] });
    
    if (rows.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    const user = rows[0];

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error("SAI_MAT_KHAU_CU");
    }

    // Mã hóa và cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT || 10));
    
    await db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        { replacements: [hashedPassword, userId] }
    );
};

module.exports = {
    updateProfileService,
    changePasswordService
};
