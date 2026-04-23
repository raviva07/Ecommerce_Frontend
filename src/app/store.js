import { configureStore } from "@reduxjs/toolkit";

// AUTH
import authReducer from "../features/auth/authSlice";

// PRODUCTS
import productReducer from "../features/product/productSlice";

// CART
import cartReducer from "../features/cart/cartSlice";

// ORDERS
import orderReducer from "../features/order/orderSlice";

// PAYMENT (IMPORTANT)
import paymentReducer from "../features/payment/paymentSlice";

// USER (profile + admin users)
import userReducer from "../features/user/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ needed for FormData uploads
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
