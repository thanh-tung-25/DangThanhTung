export const initSocket = (userId) => {
    const socket = io("http://localhost:3000");

    socket.emit("join", userId);

    socket.on("notification", (data) => {
        showToast(data.content);
    });
};

const showToast = (msg) => {
    const el = document.getElementById("toast");
    el.innerText = msg;
    el.style.display = "block";

    setTimeout(() => {
        el.style.display = "none";
    }, 3000);
};