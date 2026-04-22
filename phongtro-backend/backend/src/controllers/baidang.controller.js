


const {
    taoBaiDang,
    layTatCa,
    xoaBaiDang,
    suaBaiDang
} = require("../services/baidang.service");

const tao = async (req, res) => {
    await taoBaiDang(req.body, req.user);
    res.json({ message: "Tao bai dang thanh cong" });
};

const lay = async (req, res) => {
    const data = await layTatCa();
    res.json(data);
};

const xoa = async (req, res) => {
    await xoaBaiDang(req.params.id, req.user);
    res.json({ message: "Da xoa" });
};

const sua = async (req, res) => {
    await suaBaiDang(req.params.id, req.body, req.user);
    res.json({ message: "Da cap nhat" });
};

module.exports = {
    tao,
    lay,
    xoa,
    sua
};