import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import MedicoListSection from '../../components/sections/MedicoListSection';
import { colors } from '../../../../utils/colors';
import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

function MedicoSearchResults({ user }) {
  const {query} = useRoute().params
  const navigation =useNavigation()
    return (
        <View style={styles.container}>
         <Appbar.Header style={styles.header}>
        <StatusBar style="light" backgroundColor={colors.primary} />

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
           {query ? query: 'Liste des médicaments'}
          </Text>
        </View>

       
      </Appbar.Header>
         <FlatList 
            data={[{id: 1}]}
            showsVerticalScrollIndicator={false}
          renderItem={()=>(
            <MedicoListSection user={user} nom={query} description={query} />
          )}
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
    backgroundColor: colors.primary,
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

export default MedicoSearchResults;
