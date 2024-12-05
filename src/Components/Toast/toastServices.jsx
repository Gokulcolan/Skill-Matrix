// toastService.js
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

export const showToast = (message, type = "success") => {
    switch (type) {
        case "success":
            toast.success(message, toastConfig);
            break;
        case "error":
            toast.error(message, toastConfig);
            break;
        // Add more cases for different toast types if needed
        default:
            toast(message, toastConfig);
    }
};
