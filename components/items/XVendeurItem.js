import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

const VendeurCard = ({ item  , color , layout}) => {
    
    const navigation = useNavigation()
    const reviews = item.reviews || []
    const navigateAction = ()=>{
      if (layout==='restaurant') {
        navigation.navigate("restaurant-details" , {vendeur: item})
      } else if (layout==='supermarket') {
        navigation.navigate("supermarket-details" , {vendeur: item})

      } else {
        navigation.navigate("pharmacie-details" , {vendeur: item})

      }
    }


  return (
    <TouchableOpacity onPress={navigateAction} style={styles.card}>
      <Image source={{ uri: item.profile }} style={styles.image} />
      <View style={styles.infoContainer}>
        {/* Ligne 1: Nom du supermarket */}
        <Text style={styles.itemName}>{item.nom}</Text>
        
        {/* Ligne 2: Adresse */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={color} />
          <Text style={styles.adressText}>{item.adresse}</Text>
          
        </View>
        <View style={styles.row}>
        <Ionicons name="walk-outline" size={16} color={color} />
          <Text style={styles.adressText}>
            A {item.distance} km de vous
          </Text>
        
        </View>
        
        {/* Ligne 3: Note et Avis */}
        
        {
          layout==="pharmacie" ? <View >

            {
              item.garde && <View style={styles.row}>
                <Text style={styles.adressText}>
                Pharmacie de garde
              </Text>
              </View>
            }
          </View>: <View style={styles.row}>
          <Ionicons name="star" size={16} color={'gray'} />
          <Text style={styles.ratingText}>{item.note || '0.0'} ({reviews.length} avis)</Text>
        </View>
        }
        
        {/* Ligne 4: Boutons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={navigateAction} style={[styles.decouvrir, {backgroundColor: color}]}>
            <Text style={styles.decouvrirText}>Découvrir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin: 8,
    overflow: "hidden",
    width: 220,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: RFValue(13),
    fontFamily: "montserrat-bold",
    marginBottom: 6,
  },
  adressText: {
    fontSize: RFValue(12),
    color: "gray",
    marginLeft: 6,
    flexWrap: "wrap",
    maxWidth: "90%", // Ajuste selon ton besoin
},
  ratingText: {
    fontSize: RFValue(12),
    color: "gray",
    marginLeft: 6,
  },
  buttonContainer: {
    alignItems: 'center'
  },
  decouvrir: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
  },
  decouvrirText: {
    color: "white",
    fontFamily: "montserrat-bold",
    fontSize: RFValue(12),
  },
});

export default VendeurCard;
