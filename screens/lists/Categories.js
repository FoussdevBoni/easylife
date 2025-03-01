import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Br } from '../../components/Br';
import CategoriesListSection from '../../components/sections/CategoriesListSection';
import { RFValue } from 'react-native-responsive-fontsize';
import StackAppbar from '../../components/StackAppBar';

function Categories({ user , color , layout}) {
  const navigation =useNavigation()
    return (
        <View style={styles.container}>
        <StackAppbar title='Toutes les categories' color={color} />
       <Br size={45}/>
        < FlatList
         showsVerticalScrollIndicator={false}
         data={[{id: 1}]}
         renderItem={(item)=>(
          <CategoriesListSection layout={layout} color={color}  />
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

export default Categories;
