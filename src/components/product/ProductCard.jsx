import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";

const API_BASE = "http://localhost:8080/api";

const ProductCard = ({ product, refreshProducts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "ADMIN";

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError("");
      await axios.post(
        `${API_BASE}/cart/add?productId=${product.id}&quantity=1`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to cart");
    } catch {
      setError("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/products/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product deleted successfully");
      if (refreshProducts) refreshProducts();
    } catch {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm h-100">
      <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/250"}
          className="card-img-top"
          alt={product.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted">{product.description?.substring(0, 60)}...</p>
        <p className="card-text"><strong>₹{product.price}</strong></p>
        <p className={product.stock > 0 ? "text-success" : "text-danger"}>
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </p>

        {error && <p className="text-danger">{error}</p>}
        {loading && <Loader />}

        {!isAdmin && (
          <>
            <Link to={`/product/${product.id}`} className="btn btn-outline-primary mb-2">
              View Details
            </Link>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || loading}
            >
              Add to Cart
            </button>
          </>
        )}

        {isAdmin && (
          <div className="d-flex justify-content-between mt-auto">
            <button className="btn btn-warning">Update</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
