const {
    taoThanhToan,
    thanhToan
} = require("../services/thanhtoan.service");

const tao = async (req, res) => {
    const { contract_id, amount } = req.body;

    await taoThanhToan(contract_id, amount);

    res.json({ message: "Tao thanh toan thanh cong" });
};

const thanhToanController = async (req, res) => {
    await thanhToan(req.params.id);
    res.json({ message: "Da thanh toan" });
};

module.exports = {
    tao,
    thanhToanController
};