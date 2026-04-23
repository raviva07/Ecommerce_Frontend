import axiosInstance from "../api/axiosInstance";

const getMyOrders = () => axiosInstance.get("/api/orders/my");
const getAllOrders = () => axiosInstance.get("/api/orders/all");
const getOrderById = (id) => axiosInstance.get(`/api/orders/${id}`);
const createOrder = () => axiosInstance.post("/api/orders");
const cancelOrder = (id) => axiosInstance.put(`/api/orders/${id}/cancel`);
const adminCancelOrder = (id) => axiosInstance.put(`/api/orders/${id}/admin-cancel`);
const updateOrderStatus = (id, status) =>
  axiosInstance.put(`/api/orders/${id}/status?status=${encodeURIComponent(status)}`);

export default {
  getMyOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  adminCancelOrder,
  updateOrderStatus,
};
