const router = require("express").Router();

const {
    tao,
    layTatCa,
    layCuaToi,
    xoa,
    capNhatTrangThaiPhong,
    sua
} = require("../controllers/phong.controller");

const {
    authenticate,
    authorize
} = require("../middleware/auth.middleware");

// TẠO PHÒNG
router.post("/", authenticate, authorize("CHU_TRO", "ADMIN"), tao);

// LẤY TẤT CẢ
router.get("/", layTatCa);

// LẤY PHÒNG CỦA TÔI
router.get("/me", authenticate, authorize("CHU_TRO"), layCuaToi);

// XOÁ PHÒNG
router.delete("/:id", authenticate, authorize("CHU_TRO", "ADMIN"), xoa);

// SỬA PHÒNG
router.put("/:id", authenticate, authorize("CHU_TRO", "ADMIN"), sua);

// CẬP NHẬT TRẠNG THÁI
router.patch(
    "/:id/status",
    authenticate,
    authorize("CHU_TRO", "ADMIN"),
    capNhatTrangThaiPhong
);

module.exports = router;


