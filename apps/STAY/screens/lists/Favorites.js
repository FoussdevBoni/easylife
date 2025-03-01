import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { colors } from '../../../../utils/colors';
import YLogementsList from '../../components/lists/YLogementsList';

function LogementsFavorites({ user }) {
  const navigation =useNavigation()
  const favorites = useSelector(state=>(state.favorites.favoritesData)) || []
  const logements = favorites.filter(item=>item.layout==='hotel') 
  const logementsData = [
    { id: '1'},
  ];
 
    return (
        <View style={styles.container}>
         <Appbar.Header style={styles.header}>
        <StatusBar style="light" backgroundColor={colors.tertiary} />

        {/* Avatar à gauche */}
        <Appbar.Action
          icon={() => (
            <Ionicons
              style={{ marginTop: -4, marginLeft: -7 }}
              size={30}
              name="chevron-back-circle"
              color="white"
            />
          )}
          onPress={() => {
            navigation.goBack()
          }}
        />

        {/* Informations du restaurant */}
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>
           Mes favoris
          </Text>
        </View>

        {/* Icône de notification à droite */}
       
      </Appbar.Header>
         <FlatList
        data={logementsData} // The data to be rendered
        renderItem={({ item }) => <YLogementsList logements={logements}    />} // Render each item using LogementsListSection
        keyExtractor={(item) => item.id} // Unique key for each item
        showsVerticalScrollIndicator={false}
      />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
      header: {
    backgroundColor: colors.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LogementsFavorites;
