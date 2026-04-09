import { request } from "./api.js";
import { setToken, setUser, clearAuth } from "./storage.js";

export { getUser } from "./storage.js";

export const login = async (username, password) => {
    const res = await request("/auth/login", "POST", {
        username,
        password
    });

    if (res.accessToken) {
        setToken(res.accessToken);
        if (res.user) {
            setUser(res.user);
        }
        return { ok: true, user: res.user };
    }

    return { ok: false, message: res.message || "Đăng nhập thất bại" };
};

export const logout = () => {
    clearAuth();
    window.location.href = "dangnhap.html";
};