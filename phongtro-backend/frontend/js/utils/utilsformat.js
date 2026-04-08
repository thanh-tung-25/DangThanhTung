export const formatPrice = (price) => {
    return price.toLocaleString("vi-VN") + " VND";
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
};