import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// Axios instance
const api = axios.create({ baseURL: API_BASE });

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to normalize user
const formatUser = (data) => ({
  id: data.userId,
  name: data.name,
  email: data.email,
  role: data.role,
});

// ======================= REGISTER =======================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);

      const { success, message, data } = res.data;

      if (!success) {
        return rejectWithValue(message || "Register failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save formatted user
      const user = formatUser(data);
      localStorage.setItem("user", JSON.stringify(user));

      return user;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Register failed"
      );
    }
  }
);

// ======================= LOGIN =======================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", credentials);

      const { success, message, data } = res.data;

      if (!success) {
        return rejectWithValue(message || "Login failed");
      }

      localStorage.setItem("token", data.token);

      const user = formatUser(data);
      localStorage.setItem("user", JSON.stringify(user));

      return user;

    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed"
      );
    }
  }
);

// ======================= GET PROFILE =======================
export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/profile");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ======================= UPDATE PROFILE =======================
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/profile", payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// ======================= GET ALL USERS =======================
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/all");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ======================= DELETE USER =======================
export const deleteUser = createAsyncThunk(
  "auth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

// ======================= SLICE =======================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PROFILE
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })

      // UPDATE PROFILE
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })

      // ALL USERS
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
