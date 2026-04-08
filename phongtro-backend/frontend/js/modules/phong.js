import { request } from "../core/api.js";

export const getPhong = async () => {
    return await request("/phong");
};

export const taoPhong = async (data) => {
    return await request("/phong", "POST", data);
};

export const thuePhong = async (room_id) => {
    return await request("/hopdong", "POST", {
        room_id,
        start_date: "2026-01-01",
        end_date: "2026-12-31"
    });
};