const router = require("express").Router();
const { updateProfile, changePassword } = require("../controllers/nguoidung.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Cập nhật thông tin cá nhân
router.put("/profile", authenticate, updateProfile);

// Đổi mật khẩu
router.put("/password", authenticate, changePassword);

module.exports = router;
