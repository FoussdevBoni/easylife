import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importez vos slices
import userSlice from './userSlice';
import cartSlice from './cartSlice';
import favoritesSlice from './favoritesSlice';
import searchSlice from './searchSlice';
import dataSlice  from './dataSlice';
import  imagesSlice  from './imagesSlice';

// Configuration de persistance
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Appliquer persistReducer pour chaque slice
const persistedUserReducer = persistReducer(persistConfig, userSlice);
const persistedCartReducer = persistReducer(persistConfig, cartSlice);
const persistedFavoritesReducer = persistReducer(persistConfig, favoritesSlice);
const persistedSearchReducer = persistReducer(persistConfig, searchSlice);
const persistedDataReducer = persistReducer(persistConfig, dataSlice);
const persistedImagesReducer = persistReducer(persistConfig, imagesSlice);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    cart: persistedCartReducer,
    favorites: persistedFavoritesReducer,
    search: persistedSearchReducer,
    data: persistedDataReducer,
    images: persistedImagesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Vous pouvez désactiver cette vérification uniquement pour redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
