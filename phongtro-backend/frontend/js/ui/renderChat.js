const escapeHtml = (s) =>
    String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export const renderChatMessages = (messages, currentUserId) => {
    if (!Array.isArray(messages) || messages.length === 0) {
        return `<p class="empty-hint">Chưa có tin nhắn.</p>`;
    }

    return messages
        .map((m) => {
            const mine = currentUserId != null && String(m.from_user_id ?? m.sender_id ?? "") === String(currentUserId);
            const content = m.content ?? m.message ?? "";
            const username = m.username ?? m.sender_username ?? "—";
            return `
                <div class="msg ${mine ? "msg--me" : ""}">
                    <div class="msg__bubble">
                        <div class="msg__meta">${escapeHtml(username)}</div>
                        <div class="msg__text">${escapeHtml(content)}</div>
                    </div>
                </div>
            `;
        })
        .join("");
};