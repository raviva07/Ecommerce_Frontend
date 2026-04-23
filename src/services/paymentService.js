import axiosInstance from "../api/axiosInstance";

const createPaymentOrder = (orderId) =>
  axiosInstance.post("/api/payment/create-order", { orderId });

const verifyPayment = (payload) =>
  axiosInstance.post("/api/payment/verify", payload);

const getPaymentByOrder = (orderId) =>
  axiosInstance.get(`/api/payment/${orderId}`); // customer endpoint

// ✅ NEW: admin endpoint
const getPaymentByOrderAdmin = (orderId) =>
  axiosInstance.get(`/api/payment/admin/${orderId}`);

const getMyPaymentHistory = () =>
  axiosInstance.get("/api/payment/history/me");

const getAllPayments = () =>
  axiosInstance.get("/api/payment/history");

export default {
  createPaymentOrder,
  verifyPayment,
  getPaymentByOrder,
  getPaymentByOrderAdmin,
  getMyPaymentHistory,
  getAllPayments,
};
