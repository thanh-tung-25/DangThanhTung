const adminService = require("../services/admin.service");

const phatTien = async (req, res) => {
    try {
        const { user_id, amount, reason } = req.body;
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Không đủ thẩm quyền!" });
        }
        const fineId = await adminService.phatNguoiDung(req.user.id, user_id, amount, reason);
        res.json({ message: "Đã thiết lập mức phạt thành công!", fineId });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const layNguoiDung = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Không đủ thẩm quyền!" });
        const data = await adminService.layNguoiDung();
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const layPhieuPhat = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Không đủ thẩm quyền!" });
        const data = await adminService.layPhieuPhat();
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const danhDauDaNop = async (req, res) => {
    try {
        if (req.user.role !== "ADMIN") return res.status(403).json({ message: "Không đủ thẩm quyền!" });
        await adminService.danhDauDaNop(req.params.id);
        res.json({ message: "Đã cập nhật!" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = { phatTien, layNguoiDung, layPhieuPhat, danhDauDaNop };
