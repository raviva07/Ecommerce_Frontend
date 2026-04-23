// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8080/api/payment";

// 🔐 Helper to get token
const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// ======================= CREATE PAYMENT ORDER =======================
export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/create-order`, { orderId }, getAuthConfig());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error creating payment order");
    }
  }
);

// ======================= VERIFY PAYMENT =======================
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/verify`, payload, getAuthConfig());
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment verification failed");
    }
  }
);

// ======================= SLICE =======================
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentOrder: null,
    verifyResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.paymentOrder = null;
      state.verifyResult = null;
      state.error = null;
      state.loading = false; // ✅ reset loading too
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentOrder = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VERIFY
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verifyResult = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
