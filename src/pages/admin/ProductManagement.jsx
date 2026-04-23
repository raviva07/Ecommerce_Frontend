// src/pages/admin/ProductManagement.jsx
import React, { useEffect, useState } from "react";
import productService from "../../services/productService";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  // ================================
  // LOAD PRODUCTS
  // ================================
  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await productService.getAllProducts();
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Failed to load products", err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // HANDLE INPUT
  // ================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================================
  // SUBMIT PRODUCT
  // ================================
  const submitProduct = async () => {
    try {
      if (!form.name || !form.price || !form.stock || !form.category) {
        alert("Please fill all required fields");
        return;
      }

      setSubmitting(true);

      console.log("Submitting:", { form, file, editingId });

      if (editingId) {
        // ✅ UPDATE
        await productService.updateProduct(editingId, form);
        alert("Product updated successfully ✅");
      } else {
        // ✅ CREATE
        await productService.createProduct(form, file);
        alert("Product created successfully ✅");
      }

      resetForm();
      loadProducts();

    } catch (err) {
      console.error("Submit failed", err);
      alert("Submit failed: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // ================================
  // EDIT PRODUCT (FIXED)
  // ================================
  const editProduct = (p) => {
    console.log("Editing:", p);

    const productId = p.id ?? p._id;

    if (!productId) {
      alert("Product ID missing ❌");
      return;
    }

    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      stock: p.stock || "",
      category: p.category || "",
      imageUrl: p.imageUrl || "",
    });

    setEditingId(productId);

    // ✅ clear file when editing
    setFile(null);

    // scroll to form (nice UX)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================================
  // DELETE PRODUCT
  // ================================
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await productService.deleteProduct(id);
      alert("Product deleted ✅");
      loadProducts();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  // ================================
  // SEARCH
  // ================================
  const search = async () => {
    try {
      if (!keyword) return loadProducts();
      const productsData = await productService.searchProducts(keyword);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed");
    }
  };

  // ================================
  // RESET FORM
  // ================================
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      imageUrl: "",
    });
    setEditingId(null);
    setFile(null);
  };

  // ================================
  // UI
  // ================================
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product Management</h2>

      {/* SEARCH */}
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={search}>
          Search
        </button>
        <button className="btn btn-outline-secondary" onClick={loadProducts}>
          Reset
        </button>
      </div>

      {/* EDIT MODE ALERT */}
      {editingId && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          {/*<span>Editing product ID: {editingId}</span>*/}
          <button className="btn btn-sm btn-dark" onClick={resetForm}>
            Cancel Edit
          </button>
        </div>
      )}

      {/* FORM */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5>{editingId ? "Edit Product" : "Add Product"}</h5>

          <div className="row g-2">
            <div className="col-md-6">
              <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Name" />
            </div>

            <div className="col-md-6">
              <input name="category" value={form.category} onChange={handleChange} className="form-control" placeholder="Category" />
            </div>

            <div className="col-md-6">
              <input name="price" value={form.price} onChange={handleChange} className="form-control" placeholder="Price" type="number" />
            </div>

            <div className="col-md-6">
              <input name="stock" value={form.stock} onChange={handleChange} className="form-control" placeholder="Stock" type="number" />
            </div>

            <div className="col-12">
              <textarea name="description" value={form.description} onChange={handleChange} className="form-control" placeholder="Description" rows="3" />
            </div>

            <div className="col-md-6">
              <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
            </div>

            <div className="col-md-6">
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="form-control" placeholder="Image URL (optional)" />
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={submitProduct} disabled={submitting}>
              {submitting ? "Processing..." : editingId ? "Update Product" : "Add Product"}
            </button>

            <button className="btn btn-secondary" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <h5>All Products</h5>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No products found.</div>
      ) : (
        <div className="row g-3">
          {products.map((p) => (
            <div key={p.id ?? p._id} className="col-md-4">
              <div className="card h-100 shadow-sm">

                {p.imageUrl && (
                  <img src={p.imageUrl} className="card-img-top" alt={p.name} style={{ height: 180, objectFit: "cover" }} />
                )}

                <div className="card-body d-flex flex-column">
                  <h6>{p.name}</h6>
                  <p className="text-muted small">{p.description?.substring(0, 80)}...</p>
                  <p className="fw-bold">₹{p.price}</p>
                  <p className="small">Stock: {p.stock}</p>

                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/product/${p.id ?? p._id}`)}>
                      View
                    </button>

                    <button className="btn btn-sm btn-warning" onClick={() => editProduct(p)}>
                      Edit
                    </button>

                    <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id ?? p._id)}>
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
