import React, { useEffect, useState } from "react";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import ProductCard from "../../components/product/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: ""
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch {
      alert("Failed to load products");
    }
  };

  const handleSearch = async () => {
    try {
      if (!keyword) return fetchProducts();
      const productsData = await productService.searchProducts(keyword);
      setProducts(productsData);
    } catch {
      alert("Search failed");
    }
  };

  const addToCart = async (productId) => {
    try {
      await cartService.addToCart(productId, 1);
      alert("Added to cart");
    } catch {
      alert("Add to cart failed");
    }
  };

  const createProduct = async () => {
    try {
      await productService.createProduct(form, file);
      alert("Product created");
      fetchProducts();
      resetForm();
    } catch {
      alert("Create failed");
    }
  };

  const updateProduct = async () => {
    try {
      await productService.updateProduct(editingId, form);
      alert("Product updated");
      fetchProducts();
      resetForm();
    } catch {
      alert("Update failed");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      alert("Deleted");
      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category
    });
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", stock: "", category: "" });
    setEditingId(null);
    setFile(null);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛒 E-Commerce Home</h2>

      {/* Search */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="btn btn-secondary" onClick={fetchProducts}>
          Reset
        </button>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">Admin Product Management</h3>
            <div className="row g-2">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>
              <div className="col-md-12">
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>
            <div className="mt-3">
              {editingId ? (
                <button
                  className="btn btn-warning me-2"
                  onClick={updateProduct}
                >
                  Update Product
                </button>
              ) : (
                <button
                  className="btn btn-success me-2"
                  onClick={createProduct}
                >
                  Create Product
                </button>
              )}
              <button className="btn btn-secondary" onClick={resetForm}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-3 mb-4">
            <ProductCard
              product={p}
              refreshProducts={fetchProducts}
              addToCart={addToCart}
              editProduct={editProduct}
              deleteProduct={deleteProduct}
              isAdmin={isAdmin}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
