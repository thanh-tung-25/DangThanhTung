import CONFIG from '../../cau_hinh/cau_hinh.js';

export const api = {
    getHeaders() {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    },

    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_URL}${endpoint}`;
        const headers = this.getHeaders();
        
        try {
            const response = await fetch(url, { ...options, headers });
            
            // Xử lý lỗi Unauthorized (Token hết hạn hoặc không hợp lệ)
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem(CONFIG.TOKEN_KEY);
                localStorage.removeItem(CONFIG.USER_KEY);
                window.location.href = '../../trang/xac_thuc/dang_nhap.html';
                throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            }

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.message || 'Có lỗi xảy ra từ máy chủ';
                window.dispatchEvent(new CustomEvent('apiError', { detail: errorMsg }));
                throw new Error(errorMsg);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            if (!error.message.includes("Phiên đăng nhập")) {
                window.dispatchEvent(new CustomEvent('apiError', { detail: error.message }));
            }
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
    },

    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
    },

    patch(endpoint, body) {
        return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};
