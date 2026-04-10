const {
    taoNhom,
    themThanhVien,
    guiTinNhan,
    layDanhSachNhom,
    layTinNhanNhom
} = require("../services/nhom.service");

const layNhom = async (req, res) => {
    try {
        const data = await layDanhSachNhom(req.user);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Loi server", error: error.message });
    }
};

const layTinNhan = async (req, res) => {
    try {
        const data = await layTinNhanNhom(req.params.id, req.user.id);
        res.json(data);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

const tao = async (req, res) => {
    try {
        const id = await taoNhom(req.body.name, req.user);
        res.json({ group_id: id });
    } catch (error) {
        console.error("Lỗi tạo nhóm:", error);
        res.status(500).json({ message: "Lỗi server khi tạo nhóm", error: error.message });
    }
};

const them = async (req, res) => {
    try {
        await themThanhVien(req.body.group_id, req.body.user_id);
        res.json({ message: "Da them" });
    } catch (error) {
        console.error("Lỗi thêm thành viên:", error);
        res.status(500).json({ message: "Lỗi server khi thêm thành viên", error: error.message });
    }
};

const gui = async (req, res) => {
    try {
        await guiTinNhan(
            req.body.group_id,
            req.user.id,
            req.body.message
        );
        res.json({ message: "Da gui" });
    } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
        res.status(500).json({ message: "Lỗi server khi gửi tin nhắn", error: error.message });
    }
};

module.exports = {
    tao,
    them,
    gui,
    layNhom,
    layTinNhan
};