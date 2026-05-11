const router = require("express").Router();
const { tao, gui, layConversations, layMessages } = require("../controllers/chat.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Lấy danh sách hội thoại
router.get("/conversations", authenticate, layConversations);

// Lấy tin nhắn trong hội thoại
router.get("/messages/:id", authenticate, layMessages);

// Tạo hội thoại
router.post("/tao", authenticate, tao);

// Gửi tin nhắn
router.post("/gui", authenticate, gui);

module.exports = router;