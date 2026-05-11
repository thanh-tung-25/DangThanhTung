const { updateProfileService, changePasswordService } = require("../services/nguoidung.service");

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await updateProfileService(userId, req.body);
        res.json({ message: "Cập nhật hồ sơ thành công", data: result });
    } catch (err) {
        console.error("Lỗi updateProfile:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Vui lòng nhập đủ mật khẩu cũ và mới" });
        }

        await changePasswordService(userId, currentPassword, newPassword);
        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (err) {
        console.error("Lỗi changePassword:", err);
        if (err.message === "SAI_MAT_KHAU_CU") {
            return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
        }
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    updateProfile,
    changePassword
};
