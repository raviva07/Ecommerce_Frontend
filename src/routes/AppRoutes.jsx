import { Routes, Route } from "react-router-dom";

// ================= PUBLIC PAGES =================
import Login from "../pages/auth/LoginPage";
import Register from "../pages/auth/RegisterPage";

// ================= USER PAGES =================
import Home from "../pages/user/HomePage";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/CartPage";
import Orders from "../pages/user/OrdersPage";
import Profile from "../pages/user/Profile";
import PaymentHistory from "../pages/user/PaymentHistory";
// ================= ADMIN PAGES =================
import AdminDashboard from "../pages/admin/Dashboard";
import ManageProducts from "../pages/admin/ProductManagement";
import ManageOrders from "../pages/admin/OrderManagement";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
// ================= ROUTE GUARDS =================
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// ================= COMMON COMPONENTS =================
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER ROUTES */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetails /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/payments" element={<PrivateRoute><PaymentHistory /></PrivateRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
