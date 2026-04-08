import { request } from "../core/api.js";

export const taoCuocTroChuyen = (user_id) =>
    request("/chat/tao", "POST", { user_id });

export const guiTinNhan = (data) =>
    request("/chat/gui", "POST", data);