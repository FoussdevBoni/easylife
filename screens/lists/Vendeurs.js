import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Appbar } from 'react-native-paper';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import VendeurListSection from '../../components/sections/VendeursListSection';
import { RFValue } from 'react-native-responsive-fontsize';
import StackAppbar from '../../components/StackAppBar';

function Vendeurs({color , layout}) {
    const navigation = useNavigation()
    const [filter , setFilter] = useState()

    const data = useRoute().params?.data


    return (
        <View  style={styles.container}>
        <StackAppbar color={color} title={ data?.title ? data?.title: 'Liste des vendeurs'}/>
        < FlatList
          style={
            {
              flex: 1,
              padding: 10
            }
          }
         showsVerticalScrollIndicator={false}
         data={[{id: 1}]}
         renderItem={(item)=>(
           <VendeurListSection  garde={
            data?.filter==='garde'
           } color={color} layout={layout} key={item.id} horizontal={false} />
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
    fontFamily: 'montserrat-bold',
  },
});
export default Vendeurs;
