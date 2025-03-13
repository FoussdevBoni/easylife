// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartData: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.cartData = action.payload;
    },
    deleteCart(state){
     state.cartData = [];
    }

  },
});

export const { setCart , deleteCart } = cartSlice.actions;
export default cartSlice.reducer;
