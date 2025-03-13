import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const MedicoItem = ({ medicament }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => {
        navigation.navigate('medicament-details', { product: medicament });
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: medicament.images[0] }} style={styles.image} />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{medicament.nom}</Text>
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{medicament.prix} FCFA</Text>
      </View>
    </TouchableOpacity>
  );
};

function YMedicoList({ medicaments }) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {medicaments.map((item) => (
          <MedicoItem key={item.id} medicament={item} />
        ))}
      </View>
    </View>
  );
}

export default YMedicoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    marginTop: 15
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
        marginTop: 15

  },
  gridItem: {
    width: '48%', // Environ 25% en prenant en compte les marges
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: '1%',
  },
  imageContainer: {
    width: '100%',
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nameContainer: {
    padding: 4,
    backgroundColor: '#fff',
  },
  nameText: {
    fontSize: RFValue(12),
    fontFamily: 'montserrat-bold',
    color: '#333',
  },
  priceContainer: {
    padding: 4,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceText: {
    fontSize: RFValue(10),
    color: '#888',
    fontFamily: 'montserrat-regular',

  },
});
