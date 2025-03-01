import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import YProductList from '../../components/lists/YProductsList';
import StackAppbar from '../../components/StackAppBar';

function Favorites({ user, layout, color }) {
  const navigation = useNavigation();
  const favorites = useSelector(state => state.favorites.favoritesData);
  const plats = favorites.filter(item => item.layout === layout);

  return (
    <View style={styles.container}>
      <StackAppbar title="Mes favoris" color={color} />

      {plats.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={plats}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => <YProductList color={color} products={[item]} user={user} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun favori pour le moment.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Favorites;
