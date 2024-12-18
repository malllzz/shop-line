import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get("https://fakestoreapi.com/products");
  return response.data.map((product) => ({ ...product, stock: 20 }));
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    hasFetched: false,
  },
  reducers: {
    updateProductStock: (state, action) => {
      const { id, quantity } = action.payload;
      const product = state.items.find((item) => item.id === id);

      if (product) {
        if (product.stock >= quantity) {
          product.stock -= quantity;
        } else {
          alert("Stok produk tidak cukup");
        }
      }
    },

    setProducts: (state, action) => {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      if (!state.hasFetched) {
        state.items = action.payload;
        state.hasFetched = true;
      }
    });
  },
});

export const { setProducts, updateProductStock } = productSlice.actions;
export default productSlice.reducer;
