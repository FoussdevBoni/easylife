import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Menu, Title } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { calculDuration } from '../../../../lib/functions/calculeDuration';
import { firestoreDbService } from '../../../../lib/services/firestoreDbService';
import { setFavorites } from '../../../../reducer/favoritesSlice';
import ImagesGallery from '../../components/sections/ImagesGallery';
import { colors } from '../../../../utils/colors';
import RatingSection from '../../../../components/RatingForm';
import { RFValue } from 'react-native-responsive-fontsize';
import { Br } from '../../../../components/Br';

function Logement(props) {
  const navigation = useNavigation();
  const { logement, data } = useRoute().params;
  const favorites = useSelector((state) => state.favorites.favoritesData);
  const existingItemFavorite = favorites.find((item) => item.id === logement.id);
  const dispatch = useDispatch();

  const images = logement.images.map((item, index) => ({
    id: index + 1,
    uri: item,
  }));

  const likeLogement = () => {
    if (!existingItemFavorite) {
      dispatch(setFavorites([...favorites, logement]));
    } else {
      const updatedFavorites = favorites.filter((item) => item.id !== logement.id);
      dispatch(setFavorites(updatedFavorites));
    }
  };

   const noter = (data) => {
    const {rating , review} = data
    const currentNote = logement.note || 0
    const reviews = logement.reviews || []

    const newNote = (currentNote + rating)/(reviews.length + 1);

    firestoreDbService.updateData('logements' , logement.id , {
      ...logement , note: newNote , reviews: [...reviews , review]
    } , ()=>{
      Alert.alert("Succès" , "Merci beaucoup pour votre avis")
    } , 
    (error)=>{
       Alert("Erreur" , "Une erreur s'est produite")
    }
    )
};

const duration = data ? calculDuration(data?.startDate  , data?.endDate): 1


  const caracteristics = [
    { text: 'Parking', icon: 'car', available: logement.parking },
    { text: 'Wifi', icon: 'wifi', available: logement.internet },
    { text: 'Balcon', icon: 'md-home', available: logement.balcony },
    { text: 'Cuisine équipée', icon: 'restaurant', available: logement.equippedKitchen },
    { text: 'Climatisation', icon: 'snow', available: logement.airConditioning },
    { text: 'Ascenseur', icon: 'md-construct', available: logement.elevator },
    { text: 'Jardin', icon: 'leaf', available: logement.garden },
    { text: 'Meublé', icon: 'bed', available: logement.furnished },
  ].filter((item) => item.available);

  const [menuVisible, setMenuVisible] = useState(false);


  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <StatusBar style="light" backgroundColor={colors.tertiary} />
        <Appbar.Action
          icon={() => (
            <Ionicons
              style={{ marginTop: -4, marginLeft: -7 }}
              size={30}
              name="chevron-back-circle"
              color="white"
            />
          )}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {logement.nom}
          </Text>
        </View>
        <View style={styles.notificationContainer}>
          <Appbar.Action
            icon="heart"
            onPress={()=>{
              likeLogement()
            }}
            color={!existingItemFavorite ? "white": 'red'}
          />
        </View>
        
      </Appbar.Header>

      <FlatList
        data={[{ id: '1' }]}
        keyExtractor={(item) => item.id}
        renderItem={() => (
          <View>
            <ImagesGallery images={images} />

            {/* Caractéristiques et Disponibilité */}
            <View style={styles.characteristicsContainer}>
              <FlatList
                data={caracteristics}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.characteristicItem}>
                    <View style={styles.avatar}>
                      <Ionicons name={item.icon} size={30} color="white" />
                    </View>
                    <Text style={styles.characteristicText}>{item.text}</Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.fullWidthContainer}>
              <View style={styles.row}>
                <View style={styles.col1}>
                  <Title style={styles.title}>{logement.nom}</Title>
                </View>
                <View style={styles.col2}>
                  <Title style={styles.ratingText}>{logement.note ?logement.note.toFixed(1): "0,0" }</Title>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionText}>Tarifs pour {duration} jours</Text>
              </View>
              <View style={styles.section}>
                <Title style={styles.priceText}>XAF {logement.prix*duration} F </Title>
                <Text style={styles.taxText}>Taxes et frais compris</Text>
              </View>

              {/* Description */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{logement.description}</Text>
              </View>
               <Br size={20}/>
              <RatingSection title={"Notez ce logement "} color={colors.tertiary} onSubmit={noter}/>

              <View style={{height: 100}} />
            </View>
          </View>
        )}
      />

      {/* Bouton de réservation FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('pre-reservation-form', { logement, data })}
      >
        <Text style={styles.fabText}>Réserver</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  availabilityContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  availabilityText: {
    color: colors.tertiary,
    fontFamily: 'montserrat-bold',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(14),

  },
  characteristicsContainer: {
    padding: 15,
  },
  characteristicItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatar: {
    borderRadius: 30,
    height: 60,
    width: 60,
    backgroundColor: colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characteristicText: {
    marginTop: 5,
    color: colors.tertiary,
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(11),
  },
  fullWidthContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    marginTop: 15,
  },
  descriptionText: {
    color: 'black',
    fontSize: RFValue(13),
    fontFamily: 'montserrat-regular',

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col1: {
    flexDirection: 'column',
        width: "80%"

  },
  col2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tertiary,
    paddingHorizontal: 10,
       width: "20%",
       borderRadius: 10
  },
  title: {
    fontSize: RFValue(15),
    fontFamily: 'montserrat-bold',
    color: 'black',
  },
  ratingText: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    color: 'white'

  },
  section: {
    marginTop: 1,
  },
  sectionText: {
    fontSize: RFValue(12),
    fontFamily: 'montserrat-bold',
  },
  priceText: {
    fontSize: RFValue(16),
    fontFamily: 'montserrat-bold',
  },
  taxText: {
    fontSize: RFValue(12),
    color: 'black',
    fontFamily: 'montserrat-regular',

  },
  fab: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: colors.tertiary,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    alignSelf: 'center',
    width: '80%',
  },

  fabText: {
    color: "white",
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    textAlign: 'center',
  },
});

export default Logement;
