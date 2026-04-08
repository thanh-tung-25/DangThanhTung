export const renderBaiDang = (data) => {
    return data.map(p => `
        <div class="post">
            <b>${p.username}</b>
            <p>${p.content}</p>
        </div>
    `).join("");
};