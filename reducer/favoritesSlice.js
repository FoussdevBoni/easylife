// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoritesData: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.favoritesData = action.payload;
    },
    deleteFavorites(state){
     state.favoritesData = [];
    }

  },
});

export const { setFavorites , deleteFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
