import { request } from "../core/api.js";

export const getBaiDang = () => request("/baidang");

export const taoBaiDang = (data) =>
    request("/baidang", "POST", data);

export const xoaBaiDang = (id) =>
    request(`/baidang/${id}`, "DELETE");