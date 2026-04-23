import axiosInstance from "../api/axiosInstance";  // ✅ correct import

// 👤 Get logged-in user's profile
export const getProfile = async () => {
  const res = await axiosInstance.get("/api/users/profile");
  return res.data.data;  // backend returns { success, message, data: UserResponse }
};

// ✏️ Update profile
export const updateProfile = async (data) => {
  const res = await axiosInstance.put("/api/users/profile", data);
  return res.data.data;
};

// 👥 Get all users (ADMIN)
export const getAllUsers = async () => {
  const res = await axiosInstance.get("/api/users/all");
  return res.data.data;
};

// ❌ Delete user (ADMIN)
export const deleteUser = async (id) => {
  const res = await axiosInstance.delete(`/api/users/${id}`);
  return res.data.data;
};

export const updateUser = async (id, data) => {
  const res = await axiosInstance.put(`/api/users/${id}`, data);
  return res.data.data;
};


export default {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUser
};
