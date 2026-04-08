const express = require("express");

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./routes/auth.routes");
const phongRoutes = require("./routes/phong.routes");
const hopdongRoutes = require("./routes/hopdong.routes");
const thanhtoanRoutes = require("./routes/thanhtoan.routes");
const chatRoutes = require("./routes/chat.routes");
const thongbaoRoutes = require("./routes/thongbao.routes");
const baidangRoutes = require("./routes/baidang.routes");
const nhomRoutes = require("./routes/nhom.routes");

app.use("/api/baidang", baidangRoutes);
app.use("/api/nhom", nhomRoutes);
// API
app.use("/api/auth", authRoutes);
app.use("/api/phong", phongRoutes);
app.use("/api/hopdong", hopdongRoutes);
app.use("/api/thanhtoan", thanhtoanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/thongbao", thongbaoRoutes);

// ================= TEST =================
app.get("/", (req, res) => {
    res.send("API dang chay");
});

// ================= EXPORT =================
module.exports = app;