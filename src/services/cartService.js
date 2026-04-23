// src/services/cartService.js
import axiosInstance from "../api/axiosInstance";

const getCart = () => axiosInstance.get("/api/cart");
const addToCart = (productId, quantity) =>
  axiosInstance.post(`/api/cart/add?productId=${productId}&quantity=${quantity}`);
const updateCart = (productId, quantity) =>
  axiosInstance.put(`/api/cart/update?productId=${productId}&quantity=${quantity}`);
const removeFromCart = (productId) =>
  axiosInstance.delete(`/api/cart/remove?productId=${productId}`);
const clearCart = () => axiosInstance.delete("/api/cart/clear");

export default { getCart, addToCart, updateCart, removeFromCart, clearCart };
