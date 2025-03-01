import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import VendeurCard from '../items/XVendeurItem';


  const VendeurItem = ({item , navigateAction , color , layout})=>{

     return (
       <TouchableOpacity onPress={navigateAction} >
           <VendeurCard item={item} layout={layout} color={color} navigateAction={navigateAction}/>
        </TouchableOpacity>
     )
  }

const XVendeursList = ({vendeurs , color , navigateAction , layout}) => {

  return (
    <FlatList
      data={vendeurs}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
           <VendeurItem layout={layout} color={color} item={item} key={item.id} navigateAction={navigateAction}/>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#d3d3d3', // Couleur grise
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative', // Nécessaire pour positionner l'icône
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  supermarketName: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'montserrat-regular',

  },
});

export default XVendeursList;
