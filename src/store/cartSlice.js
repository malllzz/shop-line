import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, title, price, image, quantity } = action.payload;

      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, title, price, image, quantity });
      }

      state.totalQuantity += quantity;
      state.totalPrice += price * quantity;
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.price * item.quantity;

        state.items = state.items.filter((item) => item.id !== id);
      }
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item && quantity > 0) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;

        state.totalQuantity += diff;
        state.totalPrice += diff * item.price;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },

    checkout: (state, action) => {
      return initialState;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart, 
  checkout 
} = cartSlice.actions;

export default cartSlice.reducer;
