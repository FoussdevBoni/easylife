import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDistance } from '../../../../lib/functions/getDistance';
import getCurrentAddress from '../../../../lib/functions/getCurrentAddress';
import { useDispatch, useSelector } from 'react-redux';
import { setFavorites } from '../../../../reducer/favoritesSlice';
import { RFValue } from 'react-native-responsive-fontsize';

const LogementItem = ({ logement, user }) => {
  const favorites = useSelector((state) => state.favorites.favoritesData);
  const navigation = useNavigation();
  const data = useRoute().params?.data;
  const dispatch = useDispatch()
  const existingItemFavorite = favorites.find((item) => item.id === logement.id);

  const likeLogement = () => {
  
    if (!existingItemFavorite) {
        dispatch(setFavorites([...favorites , logement]));  
    }else{
      
      const updatedFavorites = favorites.filter((item) => item.id !== logement.id);
      dispatch(setFavorites(updatedFavorites)); 
    
    }
    };
 

 

  if (logement) {
    return (
      <TouchableOpacity
        style={styles.logementItem}
        onPress={() => {
           if (data?.startDate&&data.endDate) {
            navigation.navigate('logement-details', { logement, data });
           }else {
            navigation.navigate('logement-details', { logement });
           }
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: logement.images[0] }} style={styles.image} />
          <TouchableOpacity style={styles.favoriteIcon} onPress={()=>{
            likeLogement()
          }}>
              <Ionicons name="heart" size={24} color={existingItemFavorite ?"red": "black"} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.logementTitle}>{logement.nom}</Text>
          <Text style={{ fontWeight: '500' }}>
            {logement.area} m² - {logement.bedrooms} chambres
          </Text>

          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index}
                name={index < logement.note ? 'star' : 'star-outline'}
                size={16}
                color="#FFD700"
                style={{ marginRight: 2 }}
              />
            ))}
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="gray" />
            <Text style={styles.locationText}>À {logement?.distance} km de vous</Text>
          </View>

          <Text style={styles.price}>XAF {logement.prix}</Text>
        </View>
      </TouchableOpacity>
    );
  }
};

function YLogementsList({ logements, user }) {
  return (
    <FlatList
      data={logements}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <LogementItem logement={item} user={user} />}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default YLogementsList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  logementItem: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 5,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logementTitle: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: RFValue(12),
    fontFamily: 'montserrat-regular',

  },
  price: {
    fontSize: 18,
    fontFamily: 'montserrat-bold',
    color: '#6200ee',
    fontSize: RFValue(13),

  },
});
