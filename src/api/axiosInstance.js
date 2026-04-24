// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://ecommerce-backend-fi3h.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  // ❌ REMOVE withCredentials (important)
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);

    if (error?.response?.status === 403) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
