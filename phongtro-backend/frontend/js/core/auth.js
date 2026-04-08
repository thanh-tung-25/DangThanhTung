import { request } from "./api.js";
import { setToken, setUser, clearAuth } from "./storage.js";

export const login = async (email, password) => {
    const res = await request("/auth/login", "POST", {
        email,
        password
    });

    if (res.accessToken) {
        setToken(res.accessToken);
        setUser(res.user);
        return true;
    }

    return false;
};

export const logout = () => {
    clearAuth();
    window.location.href = "dangnhap.html";
};