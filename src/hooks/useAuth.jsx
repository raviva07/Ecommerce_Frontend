// src/hooks/useAuth.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

/**
 * Auth context + hook
 *
 * - Stores token under localStorage.token
 * - Stores user (pure object) under localStorage.user
 * - Exposes login/register/logout/getProfile/updateProfile
 * - Exposes initialized, loading, isAdmin, isCustomer
 */

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

  // Helper to persist auth to localStorage and state
  const saveAuth = (tokenValue, userObj) => {
    if (tokenValue) localStorage.setItem("token", tokenValue);
    else localStorage.removeItem("token");

    if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
    else localStorage.removeItem("user");

    setToken(tokenValue || null);
    setUser(userObj || null);
  };

  // Initialize on app start: if token exists, try to fetch profile
  useEffect(() => {
    const init = async () => {
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        try {
          await getProfile(); // will set user if token valid
        } catch (err) {
          // invalid token or profile fetch failed -> clear auth
          console.error("Auth init failed:", err);
          logout();
        }
      }
      setInitialized(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===========================
     REGISTER
     POST /api/auth/register
     Expected backend response: { success: true, data: { token, user } }
  =========================== */
  const register = async ({ name, email, password, role = "CUSTOMER" }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      const payload = res.data?.data;

      // If backend returns token + user, persist both
      if (payload?.token && payload?.user) {
        saveAuth(payload.token, payload.user);
      } else if (payload?.token && payload?.userId) {
        // fallback for older shape: build user object from returned fields
        const userObj = {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role || "CUSTOMER",
        };
        saveAuth(payload.token, userObj);
      }

      return { success: true, data: payload };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     LOGIN
     POST /api/auth/login
     Expected backend response: { success: true, data: { token, user } }
  =========================== */
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", { email, password });
      const payload = res.data?.data;

      if (payload?.token && payload?.user) {
        // ideal shape
        saveAuth(payload.token, payload.user);
      } else if (payload?.token && payload?.userId) {
        // fallback: backend returned flattened fields
        const userObj = {
          id: payload.userId,
          name: payload.name,
          email: payload.email,
          role: payload.role || "CUSTOMER",
        };
        saveAuth(payload.token, userObj);
      } else if (payload?.token && payload?.email && payload?.role) {
        // another fallback shape
        const userObj = {
          id: payload.userId || null,
          name: payload.name || payload.email,
          email: payload.email,
          role: payload.role,
        };
        saveAuth(payload.token, userObj);
      } else {
        // If backend returns token only, store token and attempt profile fetch
        if (payload?.token) {
          saveAuth(payload.token, null);
          await getProfile();
        }
      }

      return { success: true, data: payload };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     LOGOUT
  =========================== */
  const logout = () => {
    saveAuth(null, null);
  };

  /* ===========================
     GET PROFILE
     GET /api/users/profile
     Expected response: { success: true, data: { id, name, email, role } }
  =========================== */
  const getProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/users/profile");
      const data = res.data?.data;
      if (!data) throw new Error("No profile data");

      const userObj = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };
      // persist user (keep existing token)
      saveAuth(localStorage.getItem("token"), userObj);

      return { success: true, data: userObj };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch profile",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     UPDATE PROFILE
     PUT /api/users/profile
  =========================== */
  const updateProfile = async ({ name, email }) => {
    setLoading(true);
    try {
      const res = await axiosInstance.put("/api/users/profile", { name, email });
      const data = res.data?.data;
      if (!data) throw new Error("No profile data");

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
        message: error.response?.data?.message || "Update failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     ROLE HELPERS
  =========================== */
  const isAdmin = user?.role === "ADMIN";
  const isCustomer = user?.role === "CUSTOMER";

  /* ===========================
     CONTEXT VALUE
  =========================== */
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

/* ===========================
   CUSTOM HOOK
=========================== */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
