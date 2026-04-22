const { taoHopDong } = require("../services/hopdong.service");

// THUE PHONG (TAO HOP DONG)
const tao = async (req, res) => {
    try {
        await taoHopDong(req.body, req.user);
        res.json({ message: "Tao hop dong thanh cong" });
    } catch (err) {
        if (err.message === "ROOM_NOT_AVAILABLE") {
            return res.status(400).json({ message: "Phong da duoc thue" });
        }
        res.status(500).json({ message: "Server error" });
    }
};
//xac nhan hợp đồng 
const { xacNhanHopDong } = require("../services/hopdong.service");

const xacNhan = async (req, res) => {
    try {
        await xacNhanHopDong(req.params.id, req.user);
        res.json({ message: "Xac nhan thanh cong" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const layDanhSach = async (req, res) => {
    try {
        const { layDanhSachHopDong } = require("../services/hopdong.service");
        const data = await layDanhSachHopDong(req.user);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const layChiTiet = async (req, res) => {
    try {
        const { layChiTietHopDong } = require("../services/hopdong.service");
        const data = await layChiTietHopDong(req.params.id, req.user);
        res.json(data);
    } catch (err) {
        if(err.message === "NOT_FOUND") return res.status(404).json({message: "Not found"});
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.xacNhan = xacNhan;
module.exports = {
    tao, xacNhan, layDanhSach, layChiTiet
};