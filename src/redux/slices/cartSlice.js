"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCart, updateCart } from "@/app/Services/Cart";

const getPlainCartData = (state) => ({
  id: state.cartId,
  items: state.items.map(item => ({...item})),
  orderTotal: state.orderTotal
});

export const initializeCart = createAsyncThunk("cart/initializeCart", async () => {
  const data = await createCart();
  return {
    cartId: data.id,
    items: data.items || [],
    orderTotal: data.orderTotal || 0,
  };
});

export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      const newCart = await createCart();
      localStorage.removeItem('currentCart');
      return {
        cartId: newCart.id,
        items: [],
        orderTotal: 0,
      };
    } catch (error) {
      return rejectWithValue("Failed to clear cart: " + error.message);
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart", 
  async (cartState, { rejectWithValue }) => {
    try {
      const plainCart = JSON.parse(JSON.stringify(cartState));
      const updated = await updateCart(plainCart);
      return updated;
    } catch (error) {
      return rejectWithValue("Failed to sync cart: " + error.message);
    }
  }
);

const calculateOrderTotal = (items) => {
  const cartSubtotal = items.reduce(
    (acc, item) =>
      acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity, 10) || 0),
    0
  );
  const tax = cartSubtotal * 0.2;
  return parseFloat((cartSubtotal + tax).toFixed(2));
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
    addItem: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({...action.payload});
      }
      state.orderTotal = calculateOrderTotal(state.items);
      
      const plainCart = getPlainCartData(state);
      updateCart(plainCart).catch(console.error);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {...action.payload};
        state.orderTotal = calculateOrderTotal(state.items);
        
        const plainCart = getPlainCartData(state);
        updateCart(plainCart).catch(console.error);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.orderTotal = calculateOrderTotal(state.items);
      
      const plainCart = getPlainCartData(state);
      updateCart(plainCart).catch(console.error);
    },
    updateOrderTotal: (state) => {
      state.orderTotal = calculateOrderTotal(state.items);
      const plainCart = getPlainCartData(state);
      updateCart(plainCart).catch(console.error);
    },
    clearCart: (state) => {
      state.items = [];
      state.orderTotal = 0;
      localStorage.removeItem('currentCart');
      localStorage.removeItem('cartItems');
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
      .addCase(clearCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload.cartId;
        state.items = [];
        state.orderTotal = 0;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(syncCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartId = action.payload.id;
        state.items = action.payload.items;
        state.orderTotal = action.payload.orderTotal;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        
      });
      
  },
});

export const { addItem, updateItem, removeItem,updateOrderTotal } = cartSlice.actions;
export default cartSlice.reducer;