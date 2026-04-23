import axiosInstance from "../api/axiosInstance";

// GET all products
const getAllProducts = async () => {
  const res = await axiosInstance.get("/api/products");
  return res.data.data;
};

// GET single product
const getProductById = async (id) => {
  const res = await axiosInstance.get(`/api/products/${id}`);
  return res.data.data;
};

// ✅ FIXED CREATE PRODUCT (MAIN FIX)
const createProduct = async (form, file) => {
  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("description", form.description);
  formData.append("price", form.price);
  formData.append("stock", form.stock);
  formData.append("category", form.category);

  // ✅ file OR imageUrl both supported
  if (file) {
    formData.append("file", file);
  } else if (form.imageUrl) {
    formData.append("imageUrl", form.imageUrl);
  }

  const res = await axiosInstance.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

// UPDATE product
const updateProduct = async (id, form) => {
  const res = await axiosInstance.put(`/api/products/${id}`, form);
  return res.data.data;
};

// DELETE product
const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`/api/products/${id}`);
  return res.data.data;
};

// SEARCH products
const searchProducts = async (keyword) => {
  const res = await axiosInstance.get("/api/products/search", {
    params: { keyword },
  });
  return res.data.data;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
