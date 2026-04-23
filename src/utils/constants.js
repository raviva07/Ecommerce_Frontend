// ==============================
// API BASE CONFIG
// ==============================
export const BASE_URL = "http://localhost:8080";

// ==============================
// AUTH ENDPOINTS
// ==============================
export const AUTH_API = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
};

// ==============================
// USER ENDPOINTS
// ==============================
export const USER_API = {
  PROFILE: "/api/users/profile",
  UPDATE_PROFILE: "/api/users/profile",
  GET_ALL_USERS: "/api/users/all",
  DELETE_USER: (id) => `/api/users/${id}`,
};

// ==============================
// PRODUCT ENDPOINTS
// ==============================
export const PRODUCT_API = {
  GET_ALL: "/api/products",
  CREATE: "/api/products",
  UPDATE: (id) => `/api/products/${id}`,
  DELETE: (id) => `/api/products/${id}`,
  SEARCH: (keyword) => `/api/products/search?keyword=${keyword}`,
  UPLOAD: "/api/products/upload",
};

// ==============================
// CART ENDPOINTS
// ==============================
export const CART_API = {
  GET_CART: "/api/cart",
  ADD_TO_CART: (productId, quantity) =>
    `/api/cart/add?productId=${productId}&quantity=${quantity}`,
  UPDATE_CART: (productId, quantity) =>
    `/api/cart/update?productId=${productId}&quantity=${quantity}`,
  REMOVE_ITEM: (productId) =>
    `/api/cart/remove?productId=${productId}`,
  CLEAR_CART: "/api/cart/clear",
};

// ==============================
// ORDER ENDPOINTS
// ==============================
export const ORDER_API = {
  CREATE_ORDER: "/api/orders",
  MY_ORDERS: "/api/orders/my",
  ALL_ORDERS: "/api/orders/all",
  UPDATE_STATUS: (id, status) =>
    `/api/orders/${id}/status?status=${status}`,
  CANCEL_ORDER: (id) => `/api/orders/${id}/cancel`,
};

// ==============================
// PAYMENT ENDPOINTS
// ==============================
export const PAYMENT_API = {
  CREATE_PAYMENT_ORDER: "/api/payment/create-order",
  VERIFY_PAYMENT: "/api/payment/verify",
};

// ==============================
// LOCAL STORAGE KEYS
// ==============================
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// ==============================
// USER ROLES
// ==============================
export const ROLES = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
};

// ==============================
// ORDER STATUS
// ==============================
export const ORDER_STATUS = {
  CREATED: "CREATED",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
};

// ==============================
// COMMON MESSAGES
// ==============================
export const MESSAGES = {
  LOADING: "Loading...",
  ERROR: "Something went wrong!",
  SUCCESS: "Success!",
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS: "Registration successful",
};

// ==============================
// RAZORPAY CONFIG
// ==============================
export const RAZORPAY_CONFIG = {
  KEY: "rzp_test_xxxxxxxxxxxxx", // replace with your real key
  CURRENCY: "INR",
};
