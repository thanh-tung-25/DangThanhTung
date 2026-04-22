


const router = require("express").Router();

const { tao, gui, danhSach, lichSu } = require("../controllers/chat.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.post("/tao", authenticate, tao);
router.post("/gui", authenticate, gui);
router.get("/", authenticate, danhSach);
router.get("/:id", authenticate, lichSu);

module.exports = router;