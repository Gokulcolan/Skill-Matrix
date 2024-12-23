import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
};

const getToastStyle = (type) => {
    switch (type) {
        case "success":
            return { backgroundColor: "#4caf50", color: "#fff" }; // Green background
        case "error":
            return { backgroundColor: "#f44336", color: "#fff" }; // Red background
        case "info":
            return { backgroundColor: "#2196f3", color: "#fff" }; // Blue background
        case "warning":
            return { backgroundColor: "#ff9800", color: "#fff" }; // Orange background
        default:
            return { backgroundColor: "#333", color: "#fff" }; // Default background
    }
};

export const showToast = (message, type = "success") => {
    const toastStyle = getToastStyle(type);
    toast(message, { ...toastConfig, style: toastStyle });
};
