import React, {
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

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

  // ================= NORMALIZE USER (IMPORTANT FIX) =================
  const normalizeUser = (data) => {
    if (!data) return null;

    return {
      id: data.userId || data.id || null,
      name: data.name || data.email || "",
      email: data.email,
      role: data.role || "CUSTOMER", // default safety
    };
  };

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      const existingToken = localStorage.getItem("token");

      if (existingToken) {
        try {
          await getProfile();
        } catch {
          logout();
        }
      }

      setInitialized(true);
    };

    init();
  }, []);

  // ================= REGISTER (ROLE BASED FIX) =================
  const register = async ({ name, email, password, role = "CUSTOMER" }) => {
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
        role, // 👈 ADMIN or CUSTOMER
      });

      const { data } = res.data || {};

      if (!data?.token) {
        return { success: false, message: "Registration failed" };
      }

      const userObj = normalizeUser(data);

      saveAuth(data.token, userObj);

      return {
        success: true,
        message: "Registered successfully",
        data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN (ROLE BASED FIX) =================
  const login = async ({ email, password }) => {
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const { data } = res.data || {};

      if (!data?.token) {
        return { success: false, message: "Login failed" };
      }

      const userObj = normalizeUser(data);

      saveAuth(data.token, userObj);

      return {
        success: true,
        message: "Login successful",
        data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    saveAuth(null, null);
  };

  // ================= PROFILE =================
  const getProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/users/profile");
      const data = res.data?.data;

      if (!data) throw new Error("No profile");

      const userObj = normalizeUser(data);

      saveAuth(localStorage.getItem("token"), userObj);

      return { success: true, data: userObj };
    } catch (error) {
      logout();
      return { success: false, message: "Session expired" };
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

      const userObj = normalizeUser(data);

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

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
