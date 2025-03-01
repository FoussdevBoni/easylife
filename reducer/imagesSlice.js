// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  images: [],
  lastFetchTime: 0,
};

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setImages(state, action) {
      state.images = action.payload;
      state.lastFetchTime = Date.now();
    },
    deleteImages(state){
     state.images = [];
    }

  },
});

export const { setImages , deleteImages } = imagesSlice.actions;
export default imagesSlice.reducer;
