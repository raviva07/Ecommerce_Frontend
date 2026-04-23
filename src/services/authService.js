import axiosInstance from "../api/axiosInstance";

// REGISTER
export const register = async (data) => {
  try {
    const res = await axiosInstance.post("/api/auth/register", data);
    return { success: true, data: res.data.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};

// LOGIN
export const login = async ({ email, password }) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", { email, password });
    const data = res.data.data;

    // Save token + user info
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    }));

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default { register, login, logout };
