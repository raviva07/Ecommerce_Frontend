import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders(); // ✅ /api/orders/all
      setOrders(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error loading orders", err);
      alert("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    if (!status) return;
    try {
      await orderService.updateOrderStatus(id, status); // ✅ /api/orders/{id}/status
      await loadOrders();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  const cancelOrderAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await orderService.adminCancelOrder(id); // ✅ /api/orders/{id}/admin-cancel
      await loadOrders();
    } catch (err) {
      console.error("Admin cancel failed", err);
      alert("Cancel failed");
    }
  };

  // Fetch payment details for an order and open modal
  // Fetch payment details for an order and open modal
const openPaymentDetails = async (orderId) => {
  setShowPaymentModal(true);
  setPaymentLoading(true);
  setPaymentData(null);
  try {
    const res = await paymentService.getPaymentByOrderAdmin(orderId); // ✅ admin endpoint
    setPaymentData(res?.data?.data || null);
  } catch (err) {
    console.error("Failed to fetch payment", err);
    alert("Failed to load payment details");
  } finally {
    setPaymentLoading(false);
  }
};


  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Order Management</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId}>
                  <td>{o.orderId}</td>
                  <td>{o.userId}</td>
                  <td>₹{o.totalAmount}</td>
                  <td>
                    <span className={`badge ${badgeClass(o.status)}`}>{o.status}</span>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td style={{ minWidth: 220 }}>
                    {o.items?.map((item, i) => (
                      <div key={i} className="small">
                        {item.productName} — {item.quantity} × ₹{item.price}
                      </div>
                    ))}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => openPaymentDetails(o.orderId)}
                    >
                      View Payment
                    </button>
                  </td>

                  <td style={{ minWidth: 260 }}>
                    <div className="d-flex gap-2">
                      <select
                        className="form-select form-select-sm"
                        defaultValue=""
                        onChange={(e) => updateStatus(o.orderId, e.target.value)}
                      >
                        <option value="" disabled>Update Status</option>
                        <option value="CREATED">CREATED</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cancelOrderAdmin(o.orderId)}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/admin/orders/${o.orderId}`)}
                      >
                        View Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPaymentModal(false)}
                />
              </div>
              <div className="modal-body">
                {paymentLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : paymentData ? (
                  <div>
                    <div className="mb-3">
                      <strong>Order ID:</strong> {paymentData.orderId}
                    </div>
                    <div className="mb-3">
                      <strong>Transaction ID:</strong> {paymentData.transactionId}
                    </div>
                    <div className="mb-3">
                      <strong>Amount:</strong> ₹{paymentData.amount}
                    </div>
                    <div className="mb-3">
                      <strong>Method:</strong> {paymentData.method || "N/A"}
                    </div>
                    <div className="mb-3">
                      <strong>Status:</strong> <span className={`badge ${badgeClass(paymentData.status)}`}>{paymentData.status}</span>
                    </div>
                    <div className="mb-3">
                      <strong>Paid At:</strong> {paymentData.createdAt ? new Date(paymentData.createdAt).toLocaleString() : "N/A"}
                    </div>
                    <pre className="bg-light p-2 small">{JSON.stringify(paymentData, null, 2)}</pre>
                  </div>
                ) : (
                  <div className="alert alert-warning">No payment details available for this order.</div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;

/* Helper */
function badgeClass(status) {
  switch (status) {
    case "CREATED": return "bg-secondary";
    case "PAID": return "bg-primary";
    case "SHIPPED": return "bg-info text-dark";
    case "DELIVERED": return "bg-success";
    case "CANCELLED": return "bg-danger";
    default: return "bg-dark";
  }
}
