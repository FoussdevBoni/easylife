// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productsData: [],
  lastFetchTime: 0,
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action) {
      state.productsData = action.payload;
      state.lastFetchTime = Date.now();
    },
    deleteProducts(state){
     state.productsData = [];
    }

  },
});

export const { setProducts , deleteProducts } = productsSlice.actions;
export default productsSlice.reducer;
