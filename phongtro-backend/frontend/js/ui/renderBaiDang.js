import { formatDateTime } from "../utils/utilsformat.js";

export const renderBaiDang = (data, currentUser) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return `<p class="empty-hint">Chưa có bài đăng nào.</p>`;
    }

    return data
        .map(
            (p) => `
        <article class="post-card post">
            <div class="post__head">
                <div class="post__avatar" aria-hidden="true">${escapeHtml(getInitials(p.username))}</div>
                <div class="post__who">
                    <div class="post__author">${escapeHtml(p.username || "Người dùng")}</div>
                    <div class="post__meta">
                        <span class="post__time">${escapeHtml(formatDateTime(p.created_at))}</span>
                        ${
                            p.room_id != null
                                ? `<span class="post__sep" aria-hidden="true">·</span><span class="post__room">Phòng #${escapeHtml(p.room_id)}</span>`
                                : ""
                        }
                    </div>
                </div>
            </div>
            <div class="post__body">${escapeHtml(p.content || "")}</div>
            <div class="post__actions">
                ${canDelete(p, currentUser)
                    ? `
                    <button type="button" class="btn btn--ghost btn--sm js-delete-post" data-post-id="${escapeHtml(p.id ?? "")}">
                        Xóa
                    </button>
                `
                    : ""}
                <button
                    type="button"
                    class="btn btn--ghost btn--sm js-contact"
                    data-to-user-id="${escapeHtml(p.user_id ?? p.owner_id ?? p.chu_tro_id ?? "")}"
                    data-post-id="${escapeHtml(p.id ?? "")}"
                    data-username="${escapeHtml(p.username ?? "")}"
                >
                    Liên hệ
                </button>
            </div>
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

const getInitials = (username) => {
    const raw = String(username || "").trim();
    if (!raw) return "U";

    const parts = raw.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (first + last).toUpperCase();
};

const normalizeRole = (user) => {
    const r = user?.role ?? user?.vaiTro ?? user?.authority ?? user?.authorities;
    if (!r) return null;
    if (Array.isArray(r)) return String(r[0] ?? "").toUpperCase();
    return String(r).toUpperCase();
};

const canDelete = (post, currentUser) => {
    if (!currentUser) return false;
    const role = normalizeRole(currentUser);
    if (role === "ADMIN") return true;

    const postUserId = post?.user_id ?? post?.owner_id ?? post?.chu_tro_id ?? null;
    if (postUserId != null && currentUser.id != null) {
        return String(postUserId) === String(currentUser.id);
    }

    const postUsername = String(post?.username ?? "").trim();
    const me = String(currentUser.username ?? "").trim();
    return Boolean(postUsername && me && postUsername === me);
};
