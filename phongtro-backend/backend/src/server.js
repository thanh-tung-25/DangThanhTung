require("dotenv").config();

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const { setIO } = require("./services/thongbao.service");
const { setChatIO } = require("./services/chat.service");

const sequelize = require("./config/db");

// DB connect
sequelize.authenticate()
    .then(() => console.log("Ket noi DB thanh cong"))
    .catch(err => console.error("Loi ket noi DB:", err));

// ❌ KHÔNG dùng app.listen nữa
// 👉 TẠO SERVER HTTP
const server = http.createServer(app);

// 👉 SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// 👉 GẮN IO VÀO SERVICE
setIO(io);
setChatIO(io);

// 👉 SOCKET EVENT
io.on("connection", (socket) => {

    
    console.log("User connected:", socket.id);

    // user join room theo user_id
    socket.on("join", (userId) => {
        socket.join(userId.toString());
        console.log("User join room:", userId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// 👉 CHẠY SERVER
server.listen(3000, () => {
    console.log("Server chay tai port 3000");
});