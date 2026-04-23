import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // LOAD DATA (FIXED)
  // =========================
  const loadData = async () => {
  setLoading(true);
  try {
    const usersRes = await userService.getAllUsers();
    const productsRes = await productService.getAllProducts();
    const ordersRes = await orderService.getAllOrders();

    console.log("Users:", usersRes);
    console.log("Products:", productsRes);
    console.log("Orders:", ordersRes);

    // ✅ SAFE ARRAY EXTRACTION
    setUsers(Array.isArray(usersRes) ? usersRes : usersRes?.data || []);
    setProducts(Array.isArray(productsRes) ? productsRes : productsRes?.data || []);
    setOrders(
      Array.isArray(ordersRes)
        ? ordersRes
        : ordersRes?.data?.data || ordersRes?.data || []
    );

  } catch (err) {
    console.error("Dashboard load error:", err);
    alert("Failed to load dashboard data");
  } finally {
    setLoading(false);
  }
};


  // =========================
  // METRICS
  // =========================
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "ADMIN").length;
  const totalCustomers = users.filter(u => u.role === "CUSTOMER").length;

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "CREATED").length;
  const paidOrders = orders.filter(o => o.status === "PAID").length;
  const cancelledOrders = orders.filter(o => o.status === "CANCELLED").length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const topProducts = [...products]
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 5);

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-primary">Admin Dashboard</h2>

      {/* ========================= KPI CARDS ========================= */}
      <div className="row g-4">

        {/* USERS */}
        <div className="col-md-3">
          <div className="card shadow border-0 bg-primary text-white">
            <div className="card-body">
              <h5>Users</h5>
              <h3>{totalUsers}</h3>
              <small>Admins: {totalAdmins} | Customers: {totalCustomers}</small>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="col-md-3">
          <div className="card shadow border-0 bg-success text-white">
            <div className="card-body">
              <h5>Products</h5>
              <h3>{totalProducts}</h3>
              <small>Active: {activeProducts}</small>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="col-md-3">
          <div className="card shadow border-0 bg-warning text-dark">
            <div className="card-body">
              <h5>Orders</h5>
              <h3>{totalOrders}</h3>
              <small>Paid: {paidOrders} | Pending: {pendingOrders}</small>
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div className="col-md-3">
          <div className="card shadow border-0 bg-dark text-white">
            <div className="card-body">
              <h5>Revenue</h5>
              <h3>₹{totalRevenue}</h3>
              <small>Cancelled: {cancelledOrders}</small>
            </div>
          </div>
        </div>

      </div>

      {/* ========================= ALERTS ========================= */}
      <div className="mt-4">
        {lowStock.length > 0 && (
          <div className="alert alert-danger">
            ⚠️ Low Stock Products: {lowStock.length}
          </div>
        )}
      </div>

      {/* ========================= RECENT ORDERS ========================= */}
      <h4 className="mt-4">Recent Orders</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>{o.userId}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <span className={`badge ${
                    o.status === "PAID"
                      ? "bg-success"
                      : o.status === "CANCELLED"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= TOP PRODUCTS ========================= */}
      <h4 className="mt-4">Top Products</h4>
      <div className="row g-3">
        {topProducts.map(p => (
          <div key={p.id} className="col-md-3">
            <div className="card shadow-sm">
              {p.imageUrl && (
                <img
                  src={p.imageUrl}
                  className="card-img-top"
                  style={{ height: 150, objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h6>{p.name}</h6>
                <p className="mb-1">₹{p.price}</p>
                <small>Stock: {p.stock}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================= ACTION BUTTONS ========================= */}
      <div className="mt-5 d-flex gap-3">
        <button className="btn btn-primary" onClick={() => navigate("/admin/users")}>
          Manage Users
        </button>

        <button className="btn btn-success" onClick={() => navigate("/admin/products")}>
          Manage Products
        </button>

        <button className="btn btn-warning" onClick={() => navigate("/admin/orders")}>
          Manage Orders
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
