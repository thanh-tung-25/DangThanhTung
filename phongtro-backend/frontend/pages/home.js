import { api } from '../js/api.js';

export async function init() {
    await loadRooms();
}

async function loadRooms() {
    const grid = document.getElementById('rooms-grid');
    
    try {
        const rooms = await api.get('/phong');
        
        if (!rooms || rooms.length === 0) {
            grid.innerHTML = '<div class="col-span-3 text-center text-muted" style="grid-column: span 3;">Chưa có phòng trọ nào.</div>';
            return;
        }

        let html = '';
        rooms.forEach(room => {
            const price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price);
            
            html += `
                <div class="card-3d" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="height: 200px; background: rgba(0,255,255,0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--clr-cyan);">
                        <i class="fa-solid fa-house-chimney"></i>
                    </div>
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                            <h3 style="font-size: 1.25rem; font-weight: 700; color: white;">${room.title}</h3>
                            <span style="background: rgba(0,255,255,0.1); color: var(--clr-cyan); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">
                                ${room.status === 'AVAILABLE' ? 'CÒN TRỐNG' : 'ĐÃ THUÊ'}
                            </span>
                        </div>
                        <p style="color: var(--clr-text-muted); font-size: 0.9rem; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${room.description || 'Không có mô tả'}
                        </p>
                        <div style="font-size: 1.5rem; font-weight: 900; color: var(--clr-cyan); margin-bottom: 1.5rem;">
                            ${price}<span style="font-size: 0.9rem; font-weight: normal; color: var(--clr-text-muted);">/tháng</span>
                        </div>
                        <button class="btn btn-outline" style="width: 100%;" onclick="alert('Chức năng đang phát triển!')">
                            Xem Chi Tiết
                        </button>
                    </div>
                </div>
            `;
        });
        
        grid.innerHTML = html;
        
    } catch (error) {
        console.error('Lỗi tải danh sách phòng:', error);
        grid.innerHTML = `
            <div style="grid-column: span 3; text-align: center; color: #ef4444; padding: 2rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 1rem;"></i><br>
                Không thể tải dữ liệu phòng: ${error.message}
            </div>
        `;
    }
}
