const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const db = require("../config/db");
const bcrypt = require("bcrypt");

// GET all users
router.get("/users", authenticate, authorize("ADMIN"), async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC");
        res.json(rows);
    } catch(err) { res.status(500).json({ message: "Lỗi server" }); }
});

// UPDATE user role
router.put("/users/:id", authenticate, authorize("ADMIN"), async (req, res) => {
    const { role } = req.body;
    try {
        await db.query("UPDATE users SET role = ? WHERE id = ?", { replacements: [role, req.params.id] });
        res.json({ message: "Đã cập nhật" });
    } catch(err) { res.status(500).json({ message: "Lỗi server" }); }
});

// DELETE user
router.delete("/users/:id", authenticate, authorize("ADMIN"), async (req, res) => {
    try {
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ message: "Không thể xóa tài khoản đang đăng nhập" });
        }
        await db.query("DELETE FROM users WHERE id = ?", { replacements: [req.params.id] });
        res.json({ message: "Đã xóa" });
    } catch(err) { res.status(500).json({ message: "Lỗi server" }); }
});

module.exports = router;
