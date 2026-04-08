export const renderPhong = (data) => {
    return data.map(r => `
        <div class="card">
            <h4>${r.title}</h4>
            <p>${formatPrice(r.price)}</p>
            <button onclick="thue(${r.id})">Thuê</button>
        </div>
    `).join("");
};

const formatPrice = (p) => p.toLocaleString() + " VND";