import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const CartItem = ({ item, token, refreshCart }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateQuantity = async (newQty) => {
    if (newQty < 1) return;
    try {
      setLoading(true);
      setError("");
      await axios.put(
        `${API_BASE_URL}/cart/update`,
        {},
        { params: { productId: item.productId, quantity: newQty }, headers: { Authorization: `Bearer ${token}` } }
      );
      setQuantity(newQty);
      refreshCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.delete(`${API_BASE_URL}/cart/remove`, {
        params: { productId: item.productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center border-bottom py-3">
      {/* LEFT INFO */}
      <div>
        <h5 className="mb-1">{item.productName}</h5>
        <p className="text-muted mb-0">Price: ₹{item.price}</p>
      </div>

      {/* QUANTITY CONTROL */}
      <div className="d-flex align-items-center">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(quantity - 1)} disabled={loading || quantity <= 1}>-</button>
        <span className="mx-2">{quantity}</span>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(quantity + 1)} disabled={loading}>+</button>
      </div>

      {/* TOTAL + REMOVE */}
      <div className="text-end">
        <p className="fw-bold mb-2">Total: ₹{item.price * quantity}</p>
        <button className="btn btn-danger btn-sm" onClick={removeItem} disabled={loading}>Remove</button>
      </div>

      {error && <p className="text-danger mt-2 w-100">{error}</p>}
    </div>
  );
};

export default CartItem;
