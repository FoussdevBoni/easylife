import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: { data: [], isLoading: false, error: null },
  prestataires: { data: [], isLoading: false, error: null },
  plats: { data: [], isLoading: false, error: null },
  articles: { data: [], isLoading: false, error: null },
  medicaments: { data: [], isLoading: false, error: null },
  logements: { data: [], isLoading: false, error: null },

};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (state, action) => {
      const { collectionName, data } = action.payload;
      state[collectionName].data = data;
      state[collectionName].isLoading = false;
      state[collectionName].error = null;
    },
    setLoading: (state, action) => {
      const { collectionName, isLoading } = action.payload;
      state[collectionName].isLoading = isLoading;
    },
    setError: (state, action) => {
      const { collectionName, error } = action.payload;
      state[collectionName].error = error;
      state[collectionName].isLoading = false;
    }
  }
});

export const { setData, setLoading, setError } = dataSlice.actions;
export default dataSlice.reducer;
