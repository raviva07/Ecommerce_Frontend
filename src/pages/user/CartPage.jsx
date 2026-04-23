import React, { useEffect, useState } from "react";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

const CartPage = () => {
  const { initialized } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await cartService.getCart();
      setCart(res.data?.data || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Failed to load cart", err);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeItem(productId);
    try {
      await cartService.updateCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("Update failed", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
      alert(err.response?.data?.message || "Remove failed");
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Clear entire cart?")) return;
    try {
      await cartService.clearCart();
      await fetchCart();
    } catch (err) {
      console.error("Clear cart failed", err);
      alert(err.response?.data?.message || "Clear cart failed");
    }
  };

  const checkout = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Cart is empty");
      return;
    }
    setProcessing(true);
    try {
      const res = await orderService.createOrder();
      const order = res.data?.data;
      if (!order) throw new Error("Order creation failed");

      alert(`Order created (ID: ${order.orderId}). Proceed to Orders to pay.`);
      navigate("/orders");
    } catch (err) {
      console.error("Checkout failed", err);
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setProcessing(false);
      await fetchCart();
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mt-5 text-center text-muted">
        <h2>🛒 Your Cart is Empty</h2>
        <p>Add products to see them here</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 My Cart</h2>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          {cart.items.map((item) => (
            <div key={item.productId} className="card mb-3 shadow-sm">
              <div className="card-body row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title">{item.productName}</h5>
                  <p className="text-muted mb-1">₹{item.price} each</p>
                  <p className="fw-bold mb-1">
                    Total: ₹{item.totalPrice ?? item.price * item.quantity}
                  </p>
                </div>

                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <div className="input-group input-group-sm" style={{ width: "120px" }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      readOnly
                      className="form-control text-center"
                      value={item.quantity}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-md-2 text-end">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <div className="mt-3 d-grid gap-2">
                <button
                  className="btn btn-success"
                  onClick={checkout}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Checkout"}
                </button>
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
              <small className="text-muted d-block mt-2">
                Secure checkout. You will be redirected to Orders to complete payment.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
