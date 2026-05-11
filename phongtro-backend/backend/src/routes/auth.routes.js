const router = require("express").Router();

const {
    register,
    login,
    refreshToken,
    logout
} = require("../controllers/auth.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticate, async (req, res) => {
    try {
        const db = require("../config/db");
        const [rows] = await db.query("SELECT id, username, role, full_name, phone, email FROM users WHERE id = ?", [req.user.id]);
        if (rows.length > 0) {
            const user = rows[0];
            res.json({
                id: user.id,
                username: user.username,
                role: user.role,
                fullName: user.full_name || null,
                phone: user.phone || null,
                email: user.email || null
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    (req, res) => {
        res.json({ message: "Admin access" });
    }
);
console.log("refreshToken:", refreshToken);
console.log("logout:", logout);
module.exports = router;

