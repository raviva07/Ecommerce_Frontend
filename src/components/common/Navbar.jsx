import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/products" className="nav-link">Products</Link>
          <Link to="/admin/orders" className="nav-link">Orders</Link>
          <Link to="/admin/users" className="nav-link">Users</Link>
        </>
      );
    }

    return (
      <>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <Link to="/orders" className="nav-link">My Orders</Link>
        <Link to="/payments" className="nav-link">Payment History</Link> {/* ✅ new */}
        <Link to="/profile" className="nav-link">Profile</Link>
      </>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container-fluid">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold" to="/">🛒 E-Commerce</Link>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {renderLinks()}
          </ul>

          {/* USER INFO + LOGOUT */}
          {user && (
            <div className="d-flex align-items-center">
              <span className="text-light me-3">
                Hi, {user.name}{" "}
                <span className="badge bg-info text-dark">{user.role}</span>
              </span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
