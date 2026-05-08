import { router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo router
    router.init();

    // Mobile menu toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = navLinks.style.display === 'flex';
            if (isExpanded) {
                navLinks.style.display = 'none';
                navActions.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(10, 14, 23, 0.95)';
                navLinks.style.padding = '1rem';
                navLinks.style.backdropFilter = 'blur(10px)';
                
                navActions.style.display = 'flex';
                navActions.style.flexDirection = 'column';
                navActions.style.position = 'absolute';
                navActions.style.top = 'calc(100% + 150px)';
                navActions.style.left = '0';
                navActions.style.width = '100%';
                navActions.style.background = 'rgba(10, 14, 23, 0.95)';
                navActions.style.padding = '1rem';
            }
        });
    }

    // Khởi tạo Socket.io
    try {
        const socket = io('http://localhost:3000');
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                socket.emit('join', user.id);
            }
        });

        socket.on('notification', (data) => {
            // import { showToast } from './api.js';
            // showToast(data.message, 'success');
            console.log('New notification:', data);
        });
    } catch (e) {
        console.warn('Socket.io error:', e);
    }
});
