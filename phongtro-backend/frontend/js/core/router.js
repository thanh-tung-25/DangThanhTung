import { getToken } from "./storage.js";

export const requireAuth = () => {
    const token = getToken();

    if (!token) {
        window.location.href = "dangnhap.html";
    }
};

export const redirectIfLoggedIn = () => {
    const token = getToken();

    if (token) {
        window.location.href = "trangchu.html";
    }
};