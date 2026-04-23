import axios from "axios";
import { BASE_URL, STORAGE_KEYS } from "./constants";

// ==============================
// AXIOS INSTANCE
// ==============================
const api = axios.create({
  baseURL: BASE_URL,
});

// ==============================
// REQUEST INTERCEPTOR (JWT)
// ==============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR (ERROR)
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ==============================
// GENERIC API METHODS
// ==============================
export const getRequest = async (url) => {
  const response = await api.get(url);
  return response.data;
};

export const postRequest = async (url, data) => {
  const response = await api.post(url, data);
  return response.data;
};

export const putRequest = async (url, data) => {
  const response = await api.put(url, data);
  return response.data;
};

export const deleteRequest = async (url) => {
  const response = await api.delete(url);
  return response.data;
};

// ==============================
// FILE UPLOAD (MULTIPART)
// ==============================
export const uploadFile = async (url, formData) => {
  const response = await api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// ==============================
// LOCAL STORAGE HELPERS
// ==============================
export const saveToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// ==============================
// AUTH HELPERS
// ==============================
export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = "/login";
};

// ==============================
// FORMATTERS
// ==============================
export const formatPrice = (price) => {
  return `₹${price.toFixed(2)}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN");
};

// ==============================
// VALIDATIONS
// ==============================
export const isEmailValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isPasswordStrong = (password) => {
  return password.length >= 6;
};

// ==============================
// ROLE CHECK
// ==============================
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "ADMIN";
};

// ==============================
// RAZORPAY HANDLER
// ==============================
export const openRazorpay = ({
  key,
  amount,
  orderId,
  onSuccess,
}) => {
  const options = {
    key,
    amount,
    currency: "INR",
    name: "E-Commerce App",
    description: "Order Payment",
    order_id: orderId,
    handler: function (response) {
      onSuccess(response);
    },
    theme: {
      color: "#3399cc",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
