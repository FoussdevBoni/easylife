// src/features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchData: [],
  lastFetchTime: 0,
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.searchData = action.payload;
      state.lastFetchTime = Date.now();
    },
    deleteSearch(state){
     state.searchData = [];
    }

  },
});

export const { setSearch , deleteSearch } = searchSlice.actions;
export default searchSlice.reducer;
