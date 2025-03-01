import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native';
import { colors } from '../../utils/colors';
import ProductsListSection from '../../components/sections/ProductsListSection';
import { RFValue } from 'react-native-responsive-fontsize';
import StackAppbar from '../../components/StackAppBar';

function ProductsByCategory({ user , color , layout , collectionName }) {
  const {query} = useRoute().params
  const navigation =useNavigation()

  const data = [
    {id: 1}
  ]
    return (
        <View style={styles.container}>
          <StackAppbar color={color} title={ query ? query: 'Liste des offres'} />
        <FlatList 
         showsHorizontalScrollIndicator={false}
         data={data}
         renderItem={()=>(
            <ProductsListSection collectionName={collectionName} user={user} categorieName={query} />
         )}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

export default ProductsByCategory;
