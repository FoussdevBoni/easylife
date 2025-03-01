import React, { createContext, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { setData } from '../reducer/dataSlice';
import { Loading } from '../components/Loading';
import { colors } from '../utils/colors';
import ErrorScreen from '../components/Error';
import { firestoreDbService } from '../lib/services/firestoreDbService';
import useSyncFirestore from '../hooks/useSyncData';
import { RefreshControl, ScrollView, View, Text } from 'react-native';

export const GlobalContext = createContext({
  categories: [],
  prestataires: []
});

export const GlobalProvider = ({ children }) => {
  const { categories, isLoading, error, refresh } = useSyncFirestore({ collectionName: "categories" });

  const [refreshing, setRefreshing] = useState(false);

  // Fonction appelée lorsqu'on tire l'écran vers le bas
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh(); 
    setRefreshing(false);
  }, [refresh]);

  if (isLoading) {
    return <Loading size={45} color={colors.primary} />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007BFF"]}
          />
        }
      >
        {/* Affichage du contenu ici */}
        <View style={{ padding: 10 }}>
          <Text>Bienvenue dans les catégories</Text>
          {/* Tu peux ajouter d'autres composants enfants ici */}
        </View>

        {children}
      </ScrollView>
  );
};
