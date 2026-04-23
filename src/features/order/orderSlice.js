// src/features/order/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";
const PAYMENT_URL = "http://localhost:8080/api/payment";

const getAuthConfig = (getState) => {
  const token = getState().auth?.token || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ====================== CREATE ORDER ====================== */
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, {}, getAuthConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating order");
    }
  }
);

/* ====================== GET MY ORDERS ====================== */
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/my`, getAuthConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching orders");
    }
  }
);

/* ====================== GET ALL ORDERS (ADMIN) ====================== */
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/all`, getAuthConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching all orders");
    }
  }
);

/* ====================== UPDATE ORDER STATUS (ADMIN) ====================== */
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/${id}/status`,
        null,
        { params: { status }, ...getAuthConfig(getState) }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating status");
    }
  }
);

/* ====================== CANCEL ORDER ====================== */
export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (id, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}/cancel`, {}, getAuthConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error cancelling order");
    }
  }
);

/* ====================== CREATE PAYMENT ORDER ====================== */
export const createPaymentOrder = createAsyncThunk(
  "order/createPaymentOrder",
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${PAYMENT_URL}/create-order`,
        { orderId },
        getAuthConfig(getState)
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating payment");
    }
  }
);

/* ====================== VERIFY PAYMENT ====================== */
export const verifyPayment = createAsyncThunk(
  "order/verifyPayment",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(`${PAYMENT_URL}/verify`, payload, getAuthConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Payment verification failed");
    }
  }
);

/* ====================== SLICE ====================== */
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    currentOrder: null,
    payment: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // MY ORDERS
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ALL ORDERS
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE STATUS
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        if (state.orders?.length) {
          state.orders = state.orders.map((order) =>
            order.orderId === action.payload.orderId ? action.payload : order
          );
        }
      })

      // CANCEL
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (state.orders?.length) {
          state.orders = state.orders.map((order) =>
            order.orderId === action.payload.orderId ? action.payload : order
          );
        }
      })

      // PAYMENT CREATE
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.payment = action.payload;
      })

      // VERIFY
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.payment = action.payload;
      });
  },
});

export default orderSlice.reducer;
