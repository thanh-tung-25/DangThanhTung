const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/phat", authenticate, adminController.phatTien);
router.get("/users", authenticate, adminController.layNguoiDung);
router.get("/phieu-phat", authenticate, adminController.layPhieuPhat);
router.put("/phieu-phat/:id/da-nop", authenticate, adminController.danhDauDaNop);

module.exports = router;
