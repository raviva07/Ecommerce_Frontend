// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

// Helper for auth header
const getAuthConfig = (getState) => {
  const token = getState().auth?.token || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* ====================== GET CART ====================== */
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL, getAuthConfig(getState));
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching cart");
    }
  }
);

/* ====================== ADD TO CART ====================== */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/add`,
        null,
        { params: { productId, quantity }, ...getAuthConfig(getState) }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error adding to cart");
    }
  }
);

/* ====================== UPDATE CART ====================== */
export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${API_URL}/update`,
        null,
        { params: { productId, quantity }, ...getAuthConfig(getState) }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating cart");
    }
  }
);

/* ====================== REMOVE ITEM ====================== */
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/remove`, {
        params: { productId },
        ...getAuthConfig(getState),
      });
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error removing item");
    }
  }
);

/* ====================== CLEAR CART ====================== */
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/clear`, getAuthConfig(getState));
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error clearing cart");
    }
  }
);

/* ====================== SLICE ====================== */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET CART
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (state.cart?.items) {
          state.cart.items = state.cart.items.filter(
            (item) => item.productId !== action.payload
          );
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CLEAR
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
