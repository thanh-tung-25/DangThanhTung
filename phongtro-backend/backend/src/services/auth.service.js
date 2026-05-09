
const db = require("../config/db");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const registerService = async ({ username, password, role }) => {
    const [existing] = await db.query(
        "SELECT id FROM users WHERE username = ?",
        [username]
    );

    if (existing.length > 0) {
        throw new Error("USER_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT)
    );

    const userRole = role === 'LANDLORD' ? 'LANDLORD' : 'TENANT';

    const [result] = await db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashedPassword, userRole]
    );

    return { id: result.insertId, username, role: userRole };
};

const loginService = async ({ username, password }) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );

    if (rows.length === 0) {
        throw new Error("USER_NOT_FOUND");
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("INVALID_PASSWORD");
    }

    const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const accessToken = generateAccessToken({
    id: user.id,
    role: user.role
});

const refreshToken = generateRefreshToken({
    id: user.id
});

// lưu refresh token
await db.query(
    "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
    {
        replacements: [user.id, refreshToken]
    }
);

return { accessToken, refreshToken };
};

module.exports = {
    registerService,
    loginService
};


