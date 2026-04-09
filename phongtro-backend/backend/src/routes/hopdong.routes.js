const router = require("express").Router();

const { tao, xacNhan } = require("../controllers/hopdong.controller");
const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

// NGUOI THUE TAO HOP DONG
router.post("/", authenticate, authorize("NGUOI_THUE"), tao);

router.patch("/:id/xac-nhan", authenticate, xacNhan);
module.exports = router;