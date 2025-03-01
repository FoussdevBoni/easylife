import React, { createContext, useCallback, useRef, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import ErrorScreen from "../../components/Error";
import { colors } from "../../utils/colors";
import { Loading } from "../Loading";
import useSyncFirestore from "../../hooks/useSyncData";
;

export const ScrollHome = ({ children , collectionName }) => {
  const { isLoading: isLoading, refresh: refresh } = useSyncFirestore({ collectionName: collectionName });

  const [refreshing, setRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const scrollViewRef = useRef(null);
 
  // Fonction de rafraîchissement
  const onRefresh = useCallback(async () => {
    if (!canRefresh) return; 
    setRefreshing(true);
    await refresh()
    setRefreshing(false);
  }, [refresh, canRefresh]);

  // Détection si l'utilisateur est bien en haut de la liste
  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    setCanRefresh(contentOffset.y >= 0); 
  };

  // Vérification des erreurs
  const error = useSelector((state) => state.data[collectionName]?.error);

  if (isLoading) {
    return <Loading size={45} color={colors.primary} />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      onScroll={handleScroll}
      scrollEventThrottle={16} // Rend la détection fluide
      refreshControl={
        canRefresh ?  <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={["#007BFF"]}
        enabled={canRefresh} // Active le refresh uniquement en haut
      />: null
      }
    
    >
      {children}
    </ScrollView>
  );
};
