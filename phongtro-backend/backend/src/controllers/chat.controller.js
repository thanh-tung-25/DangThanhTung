


const {
    taoHoiThoai,
    guiTinNhan,
    layDanhSachHoiThoai,
    layLichSuTinNhan
} = require("../services/chat.service");

const tao = async (req, res) => {
    const { user_id } = req.body;

    const id = await taoHoiThoai(req.user.id, user_id);

    res.json({ conversation_id: id });
};

const gui = async (req, res) => {
    const { conversation_id, message } = req.body;

    await guiTinNhan(conversation_id, req.user.id, message);

    res.json({ message: "Da gui" });
};

const danhSach = async (req, res) => {
    const data = await layDanhSachHoiThoai(req.user.id);
    res.json(data);
};

const lichSu = async (req, res) => {
    const data = await layLichSuTinNhan(req.params.id);
    res.json(data);
};

module.exports = {
    tao,
    gui,
    danhSach,
    lichSu
};