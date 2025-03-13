import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector , useDispatch } from 'react-redux';
import { getDistance } from '../../../../lib/functions/getDistance';
import { setFavorites } from '../../../../reducer/favoritesSlice';
import getCurrentAddress from '../../../../lib/functions/getCurrentAddress';
import { RFValue } from 'react-native-responsive-fontsize';

const LogementItem = ({ logement , user }) => {
   const favorites = useSelector((state) => state.favorites.favoritesData);
    const [showSnackBar, setShowSnackBar] = useState(false); 
    const [message , setMessage] = useState('')
   const existingItemFavorite = favorites.find((item) => item.id === logement.id);
     const dispatch = useDispatch()


   const navigation = useNavigation()

 
         const likeLogement = () => {

  if (!existingItemFavorite) {
      dispatch(setFavorites([...favorites , logement]));
    setShowSnackBar(true); 
        setMessage("Ce logement a été ajouté à vos favoris !");

  }else{
    
    const updatedFavorites = favorites.filter((item) => item.id !== logement.id);
    dispatch(setFavorites(updatedFavorites)); 
    setMessage("Ce logement a été retiré de vos favoris !");
    setShowSnackBar(true);
  }
  };

  return (
    <TouchableOpacity  style={styles.logementItem} onPress={()=>{
      navigation.navigate("logement-details" , {logement})
    }}>

      <View style={styles.imageContainer}>
        <Image source={{ uri: logement.images[0] }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteIcon} onPress={()=>{
          likeLogement()
    }}>
          <Ionicons name="heart" size={24} color={existingItemFavorite ?"red": "black"} />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.logementTitle}>
          {logement.nom}
        </Text>
        <Text style={{fontFamily: 'montserrat-bold',}}>
          {logement.bedrooms} chambres 
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
          <Text style={styles.locationText}>
            À {logement.distance} km de vous
          </Text>
        </View>
        <Text style={styles.price}>
          XAF {logement.prix}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function XLogementsList({ logements , user }) {
  return (
    <FlatList
      horizontal
      data={logements}
      keyExtractor={(item , index) => index.toString()}
      renderItem={({ item }) => <LogementItem user={user} logement={item} />}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false} // Cache la barre de défilement horizontale
    />
  );
}

export default XLogementsList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  logementItem: {
    width: 250,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ccc',
   
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 5,
  },
  detailsContainer: {
    padding: 10,
  },
  logementTitle: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
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
    fontFamily: 'montserrat-regular',
    fontSize: RFValue(12),

  },
  price: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    color: '#6200ee',
  },
});
