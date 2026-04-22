const router = require("express").Router();

const { tao, xacNhan, layDanhSach, layChiTiet } = require("../controllers/hopdong.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// HOP DONG
router.post("/", authenticate, tao); // Nới lỏng auth cho phép cả CHU_TRO và NGUOI_THUE
router.get("/", authenticate, layDanhSach);
router.get("/:id", authenticate, layChiTiet);
router.patch("/:id/xac-nhan", authenticate, xacNhan);

module.exports = router;