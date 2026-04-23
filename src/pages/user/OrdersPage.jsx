// src/pages/user/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import { useAuth } from "../../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

const OrdersPage = () => {
  const { initialized, isAdmin, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

  useEffect(() => {
    if (!initialized) return;
    if (isAdmin) loadAllOrders();
    else loadMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isAdmin]);

  // Sort newest first
  const sortOrdersDesc = (data) =>
    [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const loadMyOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      const data = res.data?.data || [];
      setOrders(sortOrdersDesc(data));
    } catch (err) {
      console.error("loadMyOrders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders();
      const data = res.data?.data || [];
      setOrders(sortOrdersDesc(data));
    } catch (err) {
      console.error("loadAllOrders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await orderService.updateOrderStatus(id, status);
      await loadAllOrders();
    } catch (err) {
      console.error("updateStatus:", err);
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelOrderCustomer = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    setActionLoading(true);
    try {
      await orderService.cancelOrder(id);
      await loadMyOrders();
    } catch (err) {
      console.error("cancelOrderCustomer:", err);
      alert("Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelOrderAdmin = async (id) => {
    if (!window.confirm("Admin cancel order?")) return;
    setActionLoading(true);
    try {
      await orderService.adminCancelOrder(id);
      await loadAllOrders();
    } catch (err) {
      console.error("cancelOrderAdmin:", err);
      alert("Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  // Load Razorpay script on demand (idempotent)
  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true);
      // Prevent adding multiple script tags
      if (document.getElementById("razorpay-checkout-js")) {
        // wait a short time for it to load
        const checkInterval = setInterval(() => {
          if (window.Razorpay) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
        // timeout fallback
        setTimeout(() => {
          clearInterval(checkInterval);
          if (window.Razorpay) resolve(true);
          else reject(new Error("Razorpay script load timeout"));
        }, 10000);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-checkout-js";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay script failed to load"));
      document.body.appendChild(script);
    });

  // Create payment order and open Razorpay checkout (isolated)
  const createPaymentAndOpen = async (order) => {
    setActionLoading(true);
    try {
      // 1) Create server-side Razorpay order
      const res = await paymentService.createPaymentOrder(order.orderId);
      const payment = res?.data?.data;
      if (!payment || !payment.razorpayOrderId) {
        throw new Error("Invalid payment order from server");
      }

      // 2) Load Razorpay script only when needed
      await loadRazorpayScript();

      // 3) Prepare options
      const amountInPaise = Math.round((payment.amount || order.totalAmount || 0) * 100);
      const options = {
        key: RAZORPAY_KEY,
        amount: amountInPaise,
        currency: "INR",
        name: "Your Store",
        description: `Order #${order.orderId}`,
        order_id: payment.razorpayOrderId,
        handler: async function (response) {
          // Handler runs after successful payment in Razorpay UI
          try {
            const payload = {
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };
            const verifyRes = await paymentService.verifyPayment(payload);
            const success = verifyRes?.data?.success ?? verifyRes?.data?.data?.success;
            if (success) {
              alert("Payment Successful");
              // refresh orders depending on role
              if (isAdmin) await loadAllOrders();
              else await loadMyOrders();
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Razorpay handler error:", err);
            alert("Payment verification error");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2874f0" },
      };

      // 4) Open checkout (guard against multiple opens)
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("createPaymentAndOpen:", err);
      alert(err?.message || "Payment Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const viewPayment = async (orderId) => {
    try {
      const res = await paymentService.getPaymentByOrder(orderId);
      setPaymentDetails(res.data?.data || null);
      setPaymentModalOpen(true);
    } catch (err) {
      console.error("viewPayment:", err);
      alert("No payment found");
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <div className="container">
        <h3 className="mb-4 fw-bold">{isAdmin ? "All Orders" : "My Orders"}</h3>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info">No orders found</div>
        ) : (
          <div className="row g-3">
            {orders.map((order) => (
              <div className="col-md-6" key={order.orderId}>
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    {/* HEADER */}
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold">Order #{order.orderId}</h6>
                      <span className={`badge ${order.status === "PAID" ? "bg-success" : "bg-warning text-dark"}`}>
                        {order.status}
                      </span>
                    </div>
                    <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
                    <hr />

                    {/* ITEMS */}
                    {order.items?.map((item, i) => (
                      <div key={i} className="d-flex justify-content-between mb-2">
                        <span>{item.productName}</span>
                        <span>{item.quantity} × ₹{item.price}</span>
                      </div>
                    ))}

                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-3 d-flex flex-wrap gap-2">
                      {!isAdmin && order.status === "CREATED" && (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => createPaymentAndOpen(order)}
                            disabled={actionLoading}
                          >
                            {actionLoading ? (
                              <span className="spinner-border spinner-border-sm me-2" />
                            ) : null}
                            Pay Now
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => cancelOrderCustomer(order.orderId)}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => viewPayment(order.orderId)}
                        disabled={actionLoading}
                      >
                        View Payment
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => updateStatus(order.orderId, "DELIVERED")}
                            disabled={actionLoading}
                          >
                            Deliver
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => cancelOrderAdmin(order.orderId)}
                            disabled={actionLoading}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAYMENT MODAL */}
        {paymentModalOpen && paymentDetails && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Payment Details</h5>
                  <button type="button" className="btn-close" onClick={() => setPaymentModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <p><b>Payment ID:</b> {paymentDetails.paymentId}</p>
                  <p><b>Razorpay Order ID:</b> {paymentDetails.razorpayOrderId}</p>
                  <p><b>Razorpay Payment ID:</b> {paymentDetails.razorpayPaymentId || "-"}</p>
                  <p><b>Amount:</b> ₹{paymentDetails.amount}</p>
                  <p><b>Status:</b> {paymentDetails.status}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setPaymentModalOpen(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
