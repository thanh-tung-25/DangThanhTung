const router = require("express").Router();

const { tao, them, gui, layNhom, layTinNhan } = require("../controllers/nhom.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, layNhom);
router.get("/:id/messages", authenticate, layTinNhan);

router.post("/tao", authenticate, tao);
router.post("/them", authenticate, them);
router.post("/gui", authenticate, gui);

module.exports = router;