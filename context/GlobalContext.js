import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { Loading } from "../components/Loading";
import ErrorScreen from "../components/Error";
import { colors } from "../utils/colors";
import useSyncFirestore from "../hooks/useSyncData";

export const GlobalContext = createContext({
  categories: [],
  prestataires: [],
  plats: [],

});

export const GlobalProvider = ({ children }) => {
  const { data: categories, isLoading: loadingCategories, refresh: refreshCategories } = useSyncFirestore({ collectionName: "categories" });
  const { data: prestataires, isLoading: loadingPrestataires, refresh: refreshPrestataires } = useSyncFirestore({ collectionName: "prestataires" });

  
 
  // Fonction de rafraîchissement
  const autoRefreshData = async () => {
    await Promise.all([refreshCategories(), refreshPrestataires()]);
  };



  useEffect(()=>{
    autoRefreshData()
  } , [refreshCategories, refreshPrestataires])

  // Vérification des erreurs
  const categoriesError = useSelector((state) => state.data.categories?.error);
  const prestatairesError = useSelector((state) => state.data.prestataires?.error);

  if (loadingCategories || loadingPrestataires) {
    return <Loading size={45} color={colors.primary} />;
  }

  if (categoriesError || prestatairesError) {
    return <ErrorScreen />;
  }

  return (
    <GlobalContext.Provider value={{ categories, prestataires }}>
    
      {children}
  </GlobalContext.Provider>
  );
};
