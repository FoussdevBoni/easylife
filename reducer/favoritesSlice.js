// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoritesData: [],
  lastFetchTime: 0,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.favoritesData = action.payload;
      state.lastFetchTime = Date.now();
    },
    deleteFavorites(state){
     state.favoritesData = [];
    }

  },
});

export const { setFavorites , deleteFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
