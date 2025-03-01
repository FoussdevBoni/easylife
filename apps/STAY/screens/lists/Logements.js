import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import LogementsListSection from '../../components/sections/LogementsListSection';
import { colors } from '../../../../utils/colors';
import StackAppbar from '../../../../components/StackAppBar';

function Logements({ user }) {
  const navigation = useNavigation();
   const {data } = useRoute().params


  const logementsData = [
    { id: '1'},
  ];
 

  const myCoords = data.coords
  const bedrooms =  data?.people?.rooms

  return (
    <View style={styles.container}>
      <StackAppbar color={colors.tertiary} title='Liste des logements' />

      {/* FlatList for rendering logements */}
      <FlatList
        data={logementsData} // The data to be rendered
        renderItem={({ item }) => <LogementsListSection startDate={data.startDate} endDate={data.endDate} location={50} myCoords={myCoords} bedrooms={bedrooms}  />} // Render each item using LogementsListSection
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

export default Logements;
