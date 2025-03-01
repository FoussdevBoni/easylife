import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductsListSection from '../../components/sections/ProductsListSection';
import { RFValue } from 'react-native-responsive-fontsize';
import StackAppbar from '../../components/StackAppBar';

function Products({ user , color , layout , collectionName }) {
  const {data} = useRoute().params
  const navigation =useNavigation()
  console.log("hello")


    return (
        <View style={styles.container}>
        <StackAppbar  color={color} title={ data?.title ? data?.title: 'Liste des produits'}/>
      
        < FlatList 
         showsVerticalScrollIndicator={false}
         data={[{id: 1}]}
         renderItem={(item)=>(
            <ProductsListSection collectionName={collectionName} color={color} layout={layout} key={item.id} user={user} />
         )}
        
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Products;
