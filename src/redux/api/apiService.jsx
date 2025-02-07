
import { ADMIN_BASE_URL } from "./configURL";
import axios from "axios";

console.log(ADMIN_BASE_URL, "ADMIN_BASE_URL");

export const Apiservice = async (method, url, body, params) => {
  if (window.navigator.onLine || !window.navigator.onLine) {
    try {
      // Determine if the body is FormData (for file uploads)
      const isFormData = body instanceof FormData;

      // Prepare headers based on the request body type
      const headers = isFormData
        ? {
            "Content-Type": "multipart/form-data",
            "Access-Control-Allow-Origin": "*",
          }
        : {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          };

      const response = await axios({
        method: method,
        baseURL: ADMIN_BASE_URL,
        url: url,
        headers: headers,
        data: body,
        params: params || null,
      });

      if (response.status === 200 || response.status === 201) {
        return {
          status: "success",
          data: response.data,
        };
      } else {
        return {
          status: "error",
          message: response.status && response.statusText,
        };
      }
    } catch (error) {
      if (error.message === "Network Error") {
        // showToast("Network Error", "error");
        return Promise.reject();
      } else if (error.response?.status === 400) {
        // showToast("Please Check the Credentials", "error");
        return Promise.reject();
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        // Handle unauthorized or forbidden access
        console.log("Unauthorized or Forbidden Access", "error");
      } else {
        // showToast("An unexpected error occurred", "error");
        return Promise.reject(error);
      }
    }
  } else {
    // showToast("You are offline. Please check your internet connection.", "error");
  }
};
