import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";

const AdminOrdersPage = () => {
  const { id } = useParams(); // orderId from route
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
    fetchPayment();
  }, [id]);

  const fetchOrder = async () => {
  try {
    setLoading(true);
    const res = await orderService.getOrderById(id); // ✅ now exists
    setOrder(res?.data?.data || null);
  } catch (err) {
    console.error("Failed to load order", err);
    alert("Failed to load order");
  } finally {
    setLoading(false);
  }
};

const fetchPayment = async () => {
  try {
    const res = await paymentService.getPaymentByOrderAdmin(id); // ✅ admin endpoint
    setPayment(res?.data?.data || null);
  } catch (err) {
    console.error("Failed to load payment", err);
  }
};



  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!order) {
    return <h2 className="text-center mt-5">Order not found</h2>;
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="mb-4">Order Details (Admin)</h2>

      <div className="card mb-4">
        <div className="card-body">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>User ID:</strong> {order.userId}</p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Status:</strong> <span className={`badge ${badgeClass(order.status)}`}>{order.status}</span></p>
          <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <h5>Items</h5>
      <ul className="list-group mb-4">
        {order.items?.map((item, idx) => (
          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{item.productName} — {item.quantity} × ₹{item.price}</span>
            <span className="badge bg-secondary">Subtotal: ₹{item.quantity * item.price}</span>
          </li>
        ))}
      </ul>

      <h5>Payment</h5>
      {payment ? (
        <div className="card">
          <div className="card-body">
            <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
            <p><strong>Amount:</strong> ₹{payment.amount}</p>
            <p><strong>Method:</strong> {payment.method || "N/A"}</p>
            <p><strong>Status:</strong> <span className={`badge ${badgeClass(payment.status)}`}>{payment.status}</span></p>
            <p><strong>Paid At:</strong> {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}</p>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No payment details available for this order.</div>
      )}
    </div>
  );
};

export default AdminOrdersPage;

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
