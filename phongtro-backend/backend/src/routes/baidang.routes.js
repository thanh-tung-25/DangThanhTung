const router = require("express").Router();

const { tao, lay, xoa, sua } = require("../controllers/baidang.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/", authenticate, tao);
router.get("/", lay);
router.delete("/:id", authenticate, xoa);
router.put("/:id", authenticate, sua);

module.exports = router;