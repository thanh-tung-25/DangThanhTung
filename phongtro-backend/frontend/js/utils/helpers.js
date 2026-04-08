export const showError = (msg) => {
    alert("❌ " + msg);
};

export const showSuccess = (msg) => {
    alert("✅ " + msg);
};

export const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};