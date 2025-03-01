import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';


const YVendeurList = ({vendeurs , layout }) => {
  const navigation= useNavigation()
  const renderStars = (note) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= note ? 'star' : 'star-outline'}
          size={16}
          color={i <= note ? '#FFD700' : '#FFD700'}
        />
      );
    }
    return stars;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>{
      navigation.navigate(`${layout}-details` , {[layout]: item})
    }} style={styles.card}>
      {/* Logo */}
      <Image source={{ uri: item.profile }} style={styles.logo} />

      {/* Informations */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.nom}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color="#555" />
          <Text style={styles.text}>{item.adresse}</Text>
        </View>
        <Text style={styles.text}>Ouvert : {item.disponibilites}</Text>

        {
            layout!=='pharmacie'&& <View style={styles.row}>{renderStars(item.note)}</View> 
        }
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={vendeurs}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  text: {
    fontSize: RFValue(11),
    color: '#555',
    marginLeft: 4,
    fontFamily: 'montserrat-regular',

  },
});

export default YVendeurList;
