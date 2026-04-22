const API = "http://localhost:3000/api";

const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

const fetchJson = async (path, init) => {
    const res = await fetch(API + path, init);
    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }
    return { ok: res.ok, status: res.status, data };
};

// Try multiple common admin user endpoints, return first success.
const tryEndpoints = async (candidates, initFactory) => {
    let last = null;
    for (const path of candidates) {
        // eslint-disable-next-line no-await-in-loop
        const r = await fetchJson(path, initFactory(path));
        last = { ...r, path };
        if (r.ok) return { ...r, path };
    }
    return last;
};

export const listUsers = () =>
    tryEndpoints(
        ["/users", "/user", "/nguoidung", "/admin/users", "/admin/nguoidung"],
        () => ({ method: "GET", headers: authHeaders() })
    );

export const createUser = (payload) =>
    tryEndpoints(
        ["/users", "/nguoidung", "/admin/users", "/admin/nguoidung"],
        () => ({ method: "POST", headers: authHeaders(), body: JSON.stringify(payload) })
    );

export const updateUser = (id, payload) =>
    tryEndpoints(
        [`/users/${id}`, `/nguoidung/${id}`, `/admin/users/${id}`, `/admin/nguoidung/${id}`],
        () => ({ method: "PATCH", headers: authHeaders(), body: JSON.stringify(payload) })
    );

export const deleteUser = (id) =>
    tryEndpoints(
        [`/users/${id}`, `/nguoidung/${id}`, `/admin/users/${id}`, `/admin/nguoidung/${id}`],
        () => ({ method: "DELETE", headers: authHeaders() })
    );

