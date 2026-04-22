import { getRole, getUser } from "../utils/config.js";

const renderLayout = () => {
    const role = getRole();
    const user = getUser();
    
    if (!role) {
        window.location.href = "dangnhap.html";
        return;
    }

    const appShell = document.getElementById("app-root");
    if (!appShell) return;

    let navItems = "";

    if (role === "ADMIN") {
        navItems = `
            <a href="trangchu.html" class="nav-item">
                <span class="nav-item__icon">📋</span>
                <span class="nav-item__label">Bài Đăng (Feed)</span>
            </a>
            <a href="admin.html" class="nav-item">
                <span class="nav-item__icon">👮</span>
                <span class="nav-item__label">Bảng Điều Khiển</span>
            </a>
            <a href="quanlynguoidung.html" class="nav-item">
                <span class="nav-item__icon">👥</span>
                <span class="nav-item__label">Người Dùng</span>
            </a>
        `;
    } else if (role === "CHU_TRO") {
        navItems = `
            <a href="trangchu.html" class="nav-item">
                <span class="nav-item__icon">🏠</span>
                <span class="nav-item__label">Trang chủ / Đăng bài</span>
            </a>
            <a href="tinnhan.html" class="nav-item">
                <span class="nav-item__icon">💬</span>
                <span class="nav-item__label">Tin nhắn</span>
            </a>
            <a href="quanlyphong.html" class="nav-item">
                <span class="nav-item__icon">🔑</span>
                <span class="nav-item__label">Quản lý phòng</span>
            </a>
            <a href="quanlyhopdong.html" class="nav-item">
                <span class="nav-item__icon">📜</span>
                <span class="nav-item__label">Quản lý hợp đồng</span>
            </a>
            <a href="nhom.html" class="nav-item">
                <span class="nav-item__icon">👥</span>
                <span class="nav-item__label">Nhóm phòng</span>
            </a>
            <a href="thongbao.html" class="nav-item">
                <span class="nav-item__icon">🔔</span>
                <span class="nav-item__label">Thông báo</span>
            </a>
        `;
    } else {
        // NGUOI_THUE
        navItems = `
            <a href="trangchu.html" class="nav-item">
                <span class="nav-item__icon">🔍</span>
                <span class="nav-item__label">Tìm phòng</span>
            </a>
            <a href="tinnhan.html" class="nav-item">
                <span class="nav-item__icon">💬</span>
                <span class="nav-item__label">Tin nhắn</span>
            </a>
            <a href="quanlyhopdong.html" class="nav-item">
                <span class="nav-item__icon">📜</span>
                <span class="nav-item__label">Hợp đồng của tôi</span>
            </a>
            <a href="nhom.html" class="nav-item">
                <span class="nav-item__icon">👥</span>
                <span class="nav-item__label">Nhóm phòng</span>
            </a>
            <a href="thongbao.html" class="nav-item">
                <span class="nav-item__icon">🔔</span>
                <span class="nav-item__label">Thông báo</span>
            </a>
        `;
    }

    const layoutHtml = `
        <header class="topbar">
            <div class="topbar__brand">
                <div class="topbar__logo">🏢</div>
                <div>
                    <div class="topbar__title">SmartRoom</div>
                    <div class="topbar__tagline">Quản lý trọ thông minh</div>
                </div>
            </div>
            <div class="topbar__actions">
                <span class="user-pill">Xin chào, ${user.fullname || user.username || role}</span>
                <button id="btnLogout" class="btn btn--ghost btn--sm">Đăng xuất</button>
            </div>
        </header>
        <div class="app-shell layout--with-sidebar">
            <aside class="sidebar">
                <nav class="sidebar__nav">
                    <div class="sidebar__label">Menu Truy Cập</div>
                    <div class="sidebar__list" id="sidebar-menu">
                        ${navItems}
                    </div>
                </nav>
            </aside>
            <main class="main-content" id="main-content">
                <!-- Nội dung trang sẽ được render hoặc ghép ở đây -->
            </main>
        </div>
    `;

    // Giữ nguyên các Element (để không mất event lister)
    const fragment = document.createDocumentFragment();
    while (appShell.firstChild) {
        fragment.appendChild(appShell.firstChild);
    }
    
    // Thay the HTML cua Root
    appShell.innerHTML = layoutHtml;
    
    // Đổ content cũ vào <main>
    document.getElementById("main-content").appendChild(fragment);

    // Active menu tuỳ vào URL hiện tại
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-item").forEach(item => {
        if (item.getAttribute("href") === currentPath || (currentPath === "" && item.getAttribute("href") === "trangchu.html")) {
            item.classList.add("is-active");
        }
    });

    // Đăng xuất
    document.getElementById("btnLogout").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "dangnhap.html";
    });
};

document.addEventListener("DOMContentLoaded", renderLayout);
