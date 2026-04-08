import { request } from "../core/api.js";

export const getHopDong = () => request("/hopdong");

export const xacNhanHopDong = (id) =>
    request(`/hopdong/${id}/xac-nhan`, "PATCH");