const normalizeRole = (user) => {
    const r = user?.role ?? user?.vaiTro ?? user?.authority ?? user?.authorities;
    if (!r) return null;
    if (Array.isArray(r)) return String(r[0] ?? "").toUpperCase();
    return String(r).toUpperCase();
};

const itemsForRole = (role) => {
    if (role === "ADMIN") {
        return [
            { href: "trangchu.html", label: "Trang chủ", icon: "⌂" },
            { href: "quanlynguoidung.html", label: "Người dùng", icon: "👤" },
            { href: "thongbao.html", label: "Thông báo", icon: "🔔" }
        ];
    }

    if (role === "CHU_TRO" || role === "CHỦ TRỌ" || role === "CHUTRO") {
        return [
            { href: "trangchu.html", label: "Trang chủ", icon: "⌂" },
            { href: "tinnhan.html", label: "Tin nhắn", icon: "💬" },
            { href: "quanlyphong.html", label: "Quản lý phòng", icon: "🏠" },
            { href: "hopdong.html", label: "Hợp đồng", icon: "📝" },
            { href: "nhom.html", label: "Nhóm", icon: "👥" },
            { href: "thongbao.html", label: "Thông báo", icon: "🔔" }
        ];
    }

    // NGUOI_THUE (default)
    return [
        { href: "trangchu.html", label: "Bài viết", icon: "⌂" },
        { href: "tinnhan.html", label: "Tin nhắn", icon: "💬" },
        { href: "hopdong.html", label: "Hợp đồng", icon: "📝" },
        { href: "nhom.html", label: "Nhóm", icon: "👥" },
        { href: "thongbao.html", label: "Thông báo", icon: "🔔" }
    ];
};

const escapeHtml = (s) =>
    String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export const renderSidebar = (containerEl, user, activeHref) => {
    if (!containerEl) return;

    const role = normalizeRole(user) || "NGUOI_THUE";
    const items = itemsForRole(role);

    containerEl.innerHTML = `
        <div class="sidebar__section">
            <div class="sidebar__label">Menu</div>
            <div class="sidebar__list">
                ${items
                    .map((it) => {
                        const isActive = it.href === activeHref;
                        return `
                            <a class="nav-item ${isActive ? "is-active" : ""}" href="${escapeHtml(it.href)}">
                                <span class="nav-item__icon" aria-hidden="true">${escapeHtml(it.icon)}</span>
                                <span class="nav-item__label">${escapeHtml(it.label)}</span>
                            </a>
                        `;
                    })
                    .join("")}
            </div>
        </div>
    `;
};

