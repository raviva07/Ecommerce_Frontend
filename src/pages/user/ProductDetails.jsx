import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import { useAuth } from "../../hooks/useAuth";   // ✅ import auth

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();   // ✅ check role

  useEffect(() => { fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const found = await productService.getProductById(id);
      setProduct(found);
    } catch {
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await cartService.addToCart(product.id, 1);
      alert("Added to cart");
    } catch {
      alert("Add to cart failed");
    }
  };

  const buyNow = async () => {
    try {
      const res = await orderService.createOrder(product.id, 1);
      const order = res.data?.data;
      if (!order) throw new Error("Order creation failed");

      alert(`Order created (ID: ${order.orderId}). Proceed to Orders to pay.`);
      navigate("/orders");
    } catch (err) {
      console.error("Buy Now failed", err);
      alert(err.response?.data?.message || "Buy Now failed");
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (!product) return <h2 className="text-center mt-5">Product not found</h2>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
      <div className="row">
        {/* ✅ Image carousel always visible */}
        <div className="col-md-6">
          <div id="productCarousel" className="carousel slide">
            <div className="carousel-inner">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
                    <img src={img} className="d-block w-100" alt="Product" />
                  </div>
                ))
              ) : (
                <div className="carousel-item active">
                  <img src={product.imageUrl} className="d-block w-100" alt="Product" />
                </div>
              )}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>

        {/* ✅ Product info */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <h4 className="text-success">₹{product.price}</h4>
          <p>{product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          {product.rating && <p><strong>Rating:</strong> ⭐ {product.rating.toFixed(1)}</p>}

          {/* ✅ Purchase buttons only for customers */}
          {!isAdmin && (
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
              <button className="btn btn-warning" onClick={buyNow}>Buy Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
