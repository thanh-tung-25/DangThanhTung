import { auth } from './auth.js';

const routes = [
    { path: '/', redirect: true }, // Will handle redirect in logic
    { path: '/login', template: '/pages/dangnhap.html', title: 'Đăng Nhập', init: () => import('../pages/dangnhap.js').then(m => m.init()) },
    { path: '/register', template: '/pages/dangky.html', title: 'Đăng Ký', init: () => import('../pages/dangky.js').then(m => m.init()) },
    
    // Landlord routes
    { path: '/landlord', template: '/pages/landlord/trangchu.html', title: 'Chủ Trọ - Bảng điều khiển', role: 'LANDLORD' },
    
    // Tenant routes
    { path: '/tenant', template: '/pages/tenant/feed.html', title: 'Người Thuê - Trang chủ', role: 'TENANT' },
    
    // Admin routes
    { path: '/admin', template: '/pages/admin/quanlyuser.html', title: 'Admin - Quản lý', role: 'ADMIN' },
    
    // 404
    { path: '/404', template: '/pages/404.html', title: '404 - Không Tìm Thấy Trang' }
];

function matchRoute(path) {
    for (let route of routes) {
        const routePathRegex = new RegExp('^' + route.path.replace(/:[^\s/]+/g, '([\\w-]+)') + '$');
        const match = path.match(routePathRegex);
        if (match) {
            const params = {};
            const paramNames = route.path.match(/:[^\s/]+/g);
            if (paramNames) {
                paramNames.forEach((name, index) => {
                    params[name.substring(1)] = match[index + 1];
                });
            }
            return { route, params };
        }
    }
    return null;
}

export const router = {
    async navigate(url) {
        window.history.pushState(null, null, url);
        await this.handleRoute();
    },

    async handleRoute() {
        let path = window.location.pathname;
        
        // Handle XAMPP subfolder
        const basePathMatch = path.match(/^(\/.*?\/frontend)/i);
        let basePath = '';
        if (basePathMatch) {
            basePath = basePathMatch[1];
            path = path.replace(basePath, '') || '/';
        }

        // Redirect logic based on auth
        if (path === '/') {
            if (auth.isAuthenticated()) {
                const role = auth.getRole();
                if (role === 'LANDLORD') return this.navigate(basePath + '/landlord');
                if (role === 'TENANT') return this.navigate(basePath + '/tenant');
                if (role === 'ADMIN') return this.navigate(basePath + '/admin');
            } else {
                return this.navigate(basePath + '/login');
            }
        }

        let match = matchRoute(path);
        let route, params;

        if (!match) {
            route = routes.find(r => r.path === '/404') || routes[0];
            params = {};
        } else {
            route = match.route;
            params = match.params;
        }

        // Role protection
        if (route.role && (!auth.isAuthenticated() || auth.getRole() !== route.role)) {
            // Unauthorized access to role-specific route
            return this.navigate(basePath + '/');
        }

        try {
            const templatePath = basePath ? `${basePath}${route.template}` : `.${route.template}`;
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error('Template not found');
            const html = await response.text();
            
            const appDiv = document.getElementById('app');
            appDiv.style.opacity = 0;
            
            setTimeout(async () => {
                appDiv.innerHTML = html;
                document.title = `${route.title} - RoomManager`;
                appDiv.style.opacity = 1;
                
                // Update active nav link
                document.querySelectorAll('.nav-item').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === path) {
                        link.classList.add('active');
                    }
                });

                auth.updateNavbar(); // refresh UI based on page

                // Init page specific JS
                if (route.init) {
                    try {
                        await route.init(params);
                    } catch(e) {
                        console.error('Error init page script:', e);
                    }
                }
            }, 200);
            
        } catch (error) {
            console.error('Routing error:', error);
            document.getElementById('app').innerHTML = '<div class="container text-center" style="margin-top: 5rem;"><h1>404 Not Found</h1><p>Template file is missing.</p></div>';
            auth.updateNavbar();
        }
    },

    init() {
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
                e.preventDefault();
                const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
                let url = link.getAttribute('href');
                
                const basePathMatch = window.location.pathname.match(/^(\/.*?\/frontend)/i);
                if (basePathMatch && !url.startsWith(basePathMatch[1])) {
                    url = basePathMatch[1] + (url === '/' ? '' : url);
                }
                
                this.navigate(url);
            }
        });

        window.addEventListener('popstate', () => this.handleRoute());
        this.handleRoute();
    }
};
