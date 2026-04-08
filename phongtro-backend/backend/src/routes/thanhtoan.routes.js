const router = require("express").Router();

const {
    tao,
    thanhToanController
} = require("../controllers/thanhtoan.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.post("/", authenticate, tao);
router.patch("/:id", authenticate, thanhToanController);

module.exports = router;