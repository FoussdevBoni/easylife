import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import PromosListSection from '../../components/sections/PromosListSection';
import { RFValue } from 'react-native-responsive-fontsize';
import StackAppbar from '../../components/StackAppBar';

function Promos({ user , color , collectionName , layout }) {
  const {data} = useRoute().params
  const navigation =useNavigation()
  

    return (
           <View style={styles.container}>
            <StackAppbar color={color} title={ data?.title ? data?.title: 'Meilleures offres'}/>
            
         
           < FlatList 
            showsVerticalScrollIndicator={false}
            data={[{id: 1}]}
            renderItem={(item)=>(
               <PromosListSection horizontal={false} layout={layout} collectionName={collectionName} color={color} key={item.id} user={user} />
            )}
           
           />
           </View>
       );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
      header: {
    backgroundColor: colors.secondary,
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
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
});

export default Promos;
