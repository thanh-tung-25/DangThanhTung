const {
    registerService,
    loginService
} = require("../services/auth.service");

const jwt = require("jsonwebtoken");
const db = require("../config/db"); // 👉 ADD
const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/jwt");

// ================= REGISTER =================
const register = async (req, res) => {
    try {
        const data = await registerService(req.body);
        res.json({ message: "Register success", data });
    } catch (err) {
        console.error("Register error:", err);
        if (err.message === "USER_EXISTS") {
            return res.status(400).json({ message: "User đã tồn tại" });
        }
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error", detail: err.message });
    }
};

// ================= LOGIN =================
const login = async (req, res) => {
    const { username, password } = req.body;

    // 👉 HARDEN AUTH
    if (!username || !password) {
        return res.status(400).json({ message: "Missing username or password" });
    }

    try {
        const data = await loginService(req.body);
        res.json({ message: "Login success", ...data });
    } catch (err) {
        console.error("Login error:", err);
        if (err.message === "USER_NOT_FOUND") {
            return res.status(400).json({ message: "User không tồn tại" });
        }
        if (err.message === "INVALID_PASSWORD") {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

// ================= REFRESH TOKEN =================
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const [rows] = await db.query(
            "SELECT * FROM refresh_tokens WHERE token = ?",
            { replacements: [refreshToken] }
        );

        if (rows.length === 0) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // 👉 xoá token cũ (rotate)
        await db.query(
            "DELETE FROM refresh_tokens WHERE token = ?",
            { replacements: [refreshToken] }
        );

        // 👉 tạo token mới
        const newAccessToken = generateAccessToken({
            id: decoded.id
        });

        const newRefreshToken = generateRefreshToken({
            id: decoded.id
        });

        // 👉 lưu lại
        await db.query(
            "INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)",
            {
                replacements: [decoded.id, newRefreshToken]
            }
        );

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

// ================= LOGOUT =================
const logout = async (req, res) => {
    const { refreshToken } = req.body;

    await db.query(
        "DELETE FROM refresh_tokens WHERE token = ?",
        { replacements: [refreshToken] }
    );

    res.json({ message: "Logged out" });
};

// ================= EXPORT =================
module.exports = {
    register,
    login,
    refreshToken,
    logout
};