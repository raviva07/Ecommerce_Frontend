// src/pages/user/PaymentHistory.jsx
import React, { useEffect, useState } from "react";
import paymentService from "../../services/paymentService";
import { useAuth } from "../../hooks/useAuth"; // ✅ to check if user is admin
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentHistory = () => {
  const { isAdmin } = useAuth(); // hook gives you role info
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = isAdmin
          ? await paymentService.getAllPayments()   // admin sees all
          : await paymentService.getMyPaymentHistory(); // user sees own
        setPayments(res.data?.data || []);
      } catch (err) {
        console.error("Failed to load payments", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [isAdmin]);

  const getStatusBadge = (status) => {
    const map = {
      SUCCESS: "success",
      FAILED: "danger",
      CREATED: "secondary",
    };
    return `badge bg-${map[status] || "dark"} px-3 py-2`;
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-primary">💳 Payment History</h3>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : payments.length === 0 ? (
          <div className="card shadow-sm border-0 text-center p-5">
            <h5 className="text-muted">No payments found</h5>
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            
            {/* TABLE HEADER */}
            <div className="card-header bg-white border-0 fw-semibold">
              {isAdmin ? "All Transactions" : "My Transactions"}
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.paymentId} className="border-bottom">
                      <td className="fw-semibold">#{p.orderId}</td>
                      <td className="text-muted">{p.razorpayPaymentId || "-"}</td>
                      <td className="fw-bold text-success">₹{p.amount}</td>
                      <td>
                        <span className="badge bg-info text-dark px-3 py-2">
                          {p.method || "Online"}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadge(p.status)}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
