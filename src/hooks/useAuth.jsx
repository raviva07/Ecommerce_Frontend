// src/hooks/useAuth.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // ================= SAVE AUTH =================
  const saveAuth = (tokenValue, userObj) => {
    if (tokenValue) localStorage.setItem("token", tokenValue);
    else localStorage.removeItem("token");

    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
    else localStorage.removeItem("user");

    setToken(tokenValue || null);
    setUser(userObj || null);
  };

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        await getProfile();
      }
      setInitialized(true);
    };
    init();
    // eslint-disable-next-line
  }, []);

  // ================= REGISTER =================
  const register = async ({ name, email, password, role = "CUSTOMER" }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      const { success, message, data } = res.data;

      if (!success) {
        return { success: false, message };
      }

      const userObj = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      saveAuth(data.token, userObj);

      return { success: true, message, data };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const { success, message, data } = res.data;

      if (!success) {
        return { success: false, message };
      }

      const userObj = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      saveAuth(data.token, userObj);

      return { success: true, message, data };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    saveAuth(null, null);
  };

  // ================= GET PROFILE =================
  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/users/profile");
      const data = res.data?.data;

      if (!data) return;

      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      saveAuth(localStorage.getItem("token"), userObj);

      return { success: true, data: userObj };

    } catch (error) {
      logout();
      return {
        success: false,
        message: "Session expired",
      };
    }
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = async ({ name, email }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put("/api/users/profile", {
        name,
        email,
      });

      const data = res.data?.data;

      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      saveAuth(localStorage.getItem("token"), userObj);

      return { success: true, data: userObj };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Update failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= ROLE HELPERS =================
  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  // ================= CONTEXT =================
  const value = {
    user,
    token,
    loading,
    initialized,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    isAdmin,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ================= HOOK =================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
