import { formatPrice } from "../utils/utilsformat.js";

const escapeHtml = (s) =>
    String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export const renderPhong = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return `<p class="empty-hint">Chưa có phòng nào được đăng.</p>`;
    }

    return data
        .map(
            (r) => `
        <article class="room-card">
            <div class="room-card__badge">${escapeHtml(r.status || "AVAILABLE")}</div>
            <h4 class="room-card__title">${escapeHtml(r.title)}</h4>
            <p class="room-card__desc">${escapeHtml(r.description || "")}</p>
            <p class="room-card__price">${formatPrice(Number(r.price) || 0)}</p>
            <button type="button" class="btn btn--primary" onclick="thue(${r.id})">Gửi yêu cầu thuê</button>
        </article>
    `
        )
        .join("");
};