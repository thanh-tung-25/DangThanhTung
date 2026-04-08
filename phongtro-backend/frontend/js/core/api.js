const API = "http://localhost:3000/api";

export const request = async (url, method = "GET", body = null) => {
    const token = localStorage.getItem("token");

    const res = await fetch(API + url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        },
        body: body ? JSON.stringify(body) : null
    });

    return res.json();
};