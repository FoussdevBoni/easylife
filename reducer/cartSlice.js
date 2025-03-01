// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartData: [],
  lastFetchTime: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.cartData = action.payload;
      state.lastFetchTime = Date.now();
    },
    deleteCart(state){
     state.cartData = [];
    }

  },
});

export const { setCart , deleteCart } = cartSlice.actions;
export default cartSlice.reducer;
