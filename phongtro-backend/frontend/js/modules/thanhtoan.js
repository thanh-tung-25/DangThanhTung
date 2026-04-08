import { request } from "../core/api.js";

export const thanhToan = (id) =>
    request(`/thanhtoan/${id}`, "PATCH");