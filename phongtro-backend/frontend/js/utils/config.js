const CONFIG = {
    API_URL: "http://localhost:3000/api", // Cấu hình port tuỳ vào Backend
    WS_URL: "http://localhost:3000"
};

const getToken = () => localStorage.getItem("access_token");
const getRole = () => localStorage.getItem("role");
const getUser = () => {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.fullname && user.fullname.includes("Ä")) {
        try {
            user.fullname = decodeURIComponent(escape(user.fullname));
            localStorage.setItem("user", JSON.stringify(user));
        } catch(e) {}
    }
    return user;
};

const fetchAPI = async (endpoint, method = "GET", body = null) => {
    const headers = {
        "Content-Type": "application/json"
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${CONFIG.API_URL}${endpoint}`, options);
    const data = await res.json();
    
    if (!res.ok) {
        if (res.status === 401) {
            localStorage.clear();
            window.location.href = "dangnhap.html";
        }
        throw new Error(data.message || "Lỗi giao tiếp máy chủ");
    }

    return data;
};

// Toast Notification
const showToast = (message, type = "success") => {
    let toast = document.getElementById("app-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "app-toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    if (type === "error") {
        toast.style.borderColor = "var(--danger)";
        toast.style.color = "var(--danger)";
    } else {
        toast.style.borderColor = "var(--success)";
        toast.style.color = "var(--success)";
    }

    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
};

export { CONFIG, fetchAPI, getToken, getRole, getUser, showToast };
