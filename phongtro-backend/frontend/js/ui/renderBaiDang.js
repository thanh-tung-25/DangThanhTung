import { formatDateTime } from "../utils/utilsformat.js";

export const renderBaiDang = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return `<p class="empty-hint">Chưa có bài đăng nào.</p>`;
    }

    return data
        .map(
            (p) => `
        <article class="post-card">
            <div class="post-card__head">
                <span class="post-card__author">${escapeHtml(p.username || "Người dùng")}</span>
                <span class="post-card__meta">Phòng #${p.room_id ?? "—"} · ${formatDateTime(p.created_at)}</span>
            </div>
            <p class="post-card__body">${escapeHtml(p.content || "")}</p>
        </article>
    `
        )
        .join("");
};

const escapeHtml = (s) =>
    String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
