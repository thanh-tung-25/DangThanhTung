const {
    taoPhong,
    layTatCaPhong,
    layPhongCuaToi,
    xoaPhong,
    capNhatTrangThai
} = require("../services/phong.service");

// TẠO PHÒNG
const tao = async (req, res) => {
    try {
        await taoPhong(req.body, req.user);
        res.json({ message: "Tao phong thanh cong" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// LẤY TẤT CẢ
const layTatCa = async (req, res) => {
    const data = await layTatCaPhong();
    res.json(data);
};

// LẤY PHÒNG CỦA TÔI
const layCuaToi = async (req, res) => {
    const data = await layPhongCuaToi(req.user);
    res.json(data);
};

// XOÁ
const xoa = async (req, res) => {
    await xoaPhong(req.params.id, req.user);
    res.json({ message: "Da xoa phong" });
};

// CẬP NHẬT TRẠNG THÁI
const capNhatTrangThaiPhong = async (req, res) => {
    const { status } = req.body;

    if (!["AVAILABLE", "OCCUPIED"].includes(status)) {
        return res.status(400).json({ message: "Status khong hop le" });
    }

    await capNhatTrangThai(req.params.id, status, req.user);

    res.json({ message: "Cap nhat thanh cong" });
};

// SỬA
const sua = async (req, res) => {
    try {
        const { suaPhong } = require("../services/phong.service");
        await suaPhong(req.params.id, req.body, req.user);
        res.json({ message: "Cap nhat thong tin phong thanh cong" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    tao,
    layTatCa,
    layCuaToi,
    xoa,
    capNhatTrangThaiPhong,
    sua
};


