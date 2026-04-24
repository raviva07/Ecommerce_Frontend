import axiosInstance from "../api/axiosInstance";

// ================= REGISTER (ROLE BASED) =================
export const register = async (payload) => {
  try {
    const res = await axiosInstance.post("/api/auth/register", payload);

    const { success, message, data } = res.data;

    if (!success) {
      return {
        success: false,
        message: message || "Registration failed",
      };
    }

    // Save auth
    if (data?.token) {
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role: data.role, // ADMIN or CUSTOMER
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

    // Save auth
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
