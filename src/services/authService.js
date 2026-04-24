import axiosInstance from "../api/axiosInstance";

// ================= REGISTER =================
export const register = async (payload) => {
  try {
    const res = await axiosInstance.post("/api/auth/register", payload);

    // backend response
    const { success, message, data } = res.data;

    if (!success) {
      return {
        success: false,
        message: message || "Registration failed",
      };
    }

    // Save token + user (same as login)
    if (data?.token) {
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );
    }

    return {
      success: true,
      message,
      data,
    };

  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed",
    };
  }
};

// ================= LOGIN =================
export const login = async ({ email, password }) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });

    const { success, message, data } = res.data;

    if (!success) {
      return {
        success: false,
        message: message || "Login failed",
      };
    }

    // Save token + user
    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      })
    );

    return {
      success: true,
      message,
      data,
    };

  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed",
    };
  }
};

// ================= LOGOUT =================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default { register, login, logout };
