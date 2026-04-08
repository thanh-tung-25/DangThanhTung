import { request } from "../core/api.js";

export const getThongBao = () => request("/thongbao");

export const markAsRead = (id) =>
    request(`/thongbao/${id}`, "PATCH");