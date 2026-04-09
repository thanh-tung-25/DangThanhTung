export const formatPrice = (price) => {
    const n = Number(price);
    if (Number.isNaN(n)) return "—";
    return n.toLocaleString("vi-VN") + " đ";
};

export const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("vi-VN");
};

export const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short"
    });
};