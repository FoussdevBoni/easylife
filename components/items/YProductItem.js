import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useVendeur } from "../../hooks/useVendeur";

const YProductItem = ({ product, onAddCart, color , layout , openDetails }) => {
  const reduction = product.prix * (1 - product.reduction / 100);
  const navigation = useNavigation();
  const {vendeur} = useVendeur({vendeurId: product.prestataireId})
  const [commandeRoute , setCommandeRoute] = useState()
  
    useEffect(()=>{
             if (layout==='restaurant') {
               setCommandeRoute("plat-commande-form")
             } else if (layout==='pharmacie') {
               setCommandeRoute("medico-commande-form")
             } else if(layout==='supermarket'){
               setCommandeRoute("article-commande-form")
             }
            } , [])
       
         const goToOrder = ()=>{
       
             const cartOne = [
               { 
               ...product,
               quantity: 1 , 
               prix: product.isPromo ? reduction: product.prix }
             ]
       
       
       
             navigation.navigate(commandeRoute , {cart: cartOne , amount: cartOne[0].prix })
         
         }
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.images[0] }} style={styles.image} />
      <View style={styles.infoContainer}>
        {/* Ligne 1: Logo et Nom du Resto */}
        <View style={styles.row}>
          <View style={styles.logoConatiner}>
            <Image style={styles.logo} source={{uri: vendeur?.profile}}/>
          </View>
          <Text style={styles.restoName}> {vendeur?.nom}</Text>
        </View>

        {/* Ligne 2: Nom du produit */}
        <Text style={styles.productName}>{product.nom}</Text>

        {/* Ligne 3: Prix */}
        <View style={styles.row}>
            {/* Ligne 4: Réduction */}
        {product.reduction > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: color }]}>
            <Text style={styles.discountText}>-{product.reduction}%</Text>
          </View>
        )}

          {product.reduction ? (
            <Text style={styles.oldPrice}>{product.prix} FCFA</Text>
          ) : (
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>
                {product.note?.toFixed(2) || "0.0"}{" "}
              </Text>
              <Ionicons
                name="star"
                size={12}
                style={{ marginTop: 1 }}
                color={"gray"}
              />
            </View>
          )}

          <Text style={styles.newPrice}>{reduction} FCFA</Text>
        </View>

      
        {/* Ligne 5: Boutons */}
        <View style={styles.rowBetween}>
          <TouchableOpacity
            onPress={() => {
              openDetails()
            }}
            style={[styles.commandButton, { backgroundColor: color }]}
          >
            <Text style={styles.commandText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              goToOrder()
            }}
            style={[styles.commandButton, { backgroundColor: color }]}
          >
            <Text style={styles.commandText}>commander</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => {
              onAddCart();
            }}
          >
            <FontAwesome name="shopping-cart" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    flexDirection: "row",
    width: "100%",
  },
  image: {
    width: 100, // Ajuste la largeur de l'image
    height: "100%", // L'image prend toute la hauteur du card
    resizeMode: "cover",
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  infoContainer: {
    flex: 1, // Permet aux infos de prendre l'espace restant
    padding: 12,
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  restoName: {
    fontSize: 12,
    fontFamily: "montserrat-bold",
    marginLeft: -8
  },
  productName: {
    fontSize: 16,
    fontFamily: "montserrat-bold",
    marginBottom: 4,
  },
  oldPrice: {
    fontSize: 11,
    color: "gray",
    textDecorationLine: "line-through",
    marginRight: 8,
    fontFamily: "montserrat-regular",
  },
  newPrice: {
    fontSize: 11,
    fontFamily: "montserrat-bold",
  },
  discountBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
    marginRight: 8,

  },
  discountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  commandButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 10

  },
  commandText: {
    color: "white",
    fontFamily: "montserrat-bold",
    fontSize: 11
  },
  cartButton: {
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 20,
  },
  ratingRow: {
    backgroundColor: "orange",
    flexDirection: "row",
    marginRight: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  ratingText: {
    fontSize: 12,
    color: "gray",
    marginLeft: 6,
  },
});

export default YProductItem;
