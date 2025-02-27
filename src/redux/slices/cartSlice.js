"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCart, updateCart } from "@/app/Services/Cart";

// Async thunk to create a new cart when the user enters the site
export const initializeCart = createAsyncThunk("cart/initializeCart", async () => {
  const data = await createCart();
  return {
    cartId: data.id,
    items: data.items || [],
    orderTotal: data.orderTotal || 0,
  };
});

// Async thunk to update the cart on the server each time it changes
export const syncCart = createAsyncThunk("cart/syncCart", async (cartState) => {
  const updated = await updateCart(cartState);
  return updated;
});

const calculateOrderTotal = (items) => {
  const cartSubtotal = items.reduce(
    (acc, item) =>
      acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0),
    0
  );
  const tax = cartSubtotal * 0.2;
  return cartSubtotal + tax;
};

const initialState = {
  cartId: null,
  items: [],
  orderTotal: 0,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartId = action.payload.cartId;
      state.items = action.payload.items || [];
      state.orderTotal = action.payload.orderTotal || 0;
    },
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.orderTotal = calculateOrderTotal(state.items);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
      state.orderTotal = calculateOrderTotal(state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.orderTotal = calculateOrderTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.orderTotal = 0;
    },
    updateOrderTotal: (state, action) => {
      state.orderTotal = action.payload || 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload.cartId;
        state.items = action.payload.items;
        state.orderTotal = action.payload.orderTotal;
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(syncCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Use response from server if needed
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCart, addItem, updateItem, removeItem, clearCart, updateOrderTotal } = cartSlice.actions;
export default cartSlice.reducer;