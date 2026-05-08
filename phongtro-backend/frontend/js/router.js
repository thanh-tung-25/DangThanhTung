import { auth } from './auth.js';

const routes = {
    '/': { template: '/pages/home.html', title: 'Trang Chủ', init: () => import('./pages/home.js').then(m => m.init()) },
    '/rooms': { template: '/pages/home.html', title: 'Phòng Trọ', init: () => import('./pages/home.js').then(m => m.init()) },
    '/login': { template: '/pages/login.html', title: 'Đăng Nhập', init: () => import('./pages/login.js').then(m => m.init('login')) },
    '/register': { template: '/pages/login.html', title: 'Đăng Ký', init: () => import('./pages/login.js').then(m => m.init('register')) },
};

export const router = {
    async navigate(url) {
        window.history.pushState(null, null, url);
        await this.handleRoute();
    },

    async handleRoute() {
        let path = window.location.pathname;
        
        // Handle XAMPP subfolder path (if running from localhost/DangThanhTung/phongtro-backend/frontend/)
        const basePathMatch = path.match(/^(\/.*?\/frontend)/i);
        let basePath = '';
        if (basePathMatch) {
            basePath = basePathMatch[1];
            path = path.replace(basePath, '') || '/';
        }

        let route = routes[path];
        if (!route) {
            route = routes['/']; // Default to home
            path = '/';
        }

        // Fetch HTML template
        try {
            const templatePath = basePath ? `${basePath}${route.template}` : `.${route.template}`;
            const response = await fetch(templatePath);
            if (!response.ok) throw new Error('Cannot load template');
            const html = await response.text();
            
            const appDiv = document.getElementById('app');
            appDiv.style.opacity = 0;
            
            setTimeout(async () => {
                appDiv.innerHTML = html;
                document.title = `${route.title} - Futuristic Room`;
                appDiv.style.opacity = 1;
                
                // Update active nav link
                document.querySelectorAll('.nav-item').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === path) {
                        link.classList.add('active');
                    }
                });

                // Init page specific JS
                if (route.init) {
                    try {
                        await route.init();
                    } catch(e) {
                        console.error('Error init page script:', e);
                    }
                }
            }, 200);
            
            auth.updateNavbar();
            
        } catch (error) {
            console.error('Routing error:', error);
            document.getElementById('app').innerHTML = '<div class="container text-center"><h1>404 Not Found</h1></div>';
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
