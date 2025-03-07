import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useVendeur } from "../../hooks/useVendeur";
import { useSelector } from "react-redux";

const XProductItem = ({ product , onAddCart , color , layout , openDetails }) => {
     const cart = useSelector((state) => state.cart.cartData);
     const existingItemCart = cart.find((item) => item.id === product.id);

    const reduction = product.prix*(1- product.reduction/100)
    const [commandeRoute , setCommandeRoute] = useState()
    const navigation = useNavigation()
    const reviews = product.reviews || []
    const {vendeur} = useVendeur({vendeurId: product.prestataireId})
   
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
          <View style={styles.logoContainer}>
             <Image style={styles.logo} source={{uri: vendeur?.profile}}/>
         </View>

          <Text style={styles.restoName}> {vendeur?.nom}</Text>
        </View>
        
        {/* Ligne 2: Nom du product */}
        <Text style={styles.productName}>{product.nom}</Text>
        
        {/* Ligne 3: Prix */}
        <View style={styles.row}>
           {/* Ligne 4: Réduction */}
        {product.reduction > 0 && (
          <View style={[styles.discountBadge , {backgroundColor: color}]}>
            <Text style={styles.discountText}>-{product.reduction}%</Text>
          </View>
        )}
          {
            product.reduction ? <Text style={styles.oldPrice}>{product.prix} FCFA</Text>
            :  <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>{product.note?.toFixed(2) || '0.0'} </Text>
            <Ionicons name="star" size={12} style={{
              marginTop: 1
            }} color={'gray'} />
          </View>
          }

          <Text style={styles.newPrice}>{reduction} FCFA</Text>
        </View>
        
       
        
        {/* Ligne 5: Boutons */}
        <View style={styles.rowBetween}>
         

          <TouchableOpacity onPress={()=>{
            goToOrder()
           }} style={[styles.commandButton , {backgroundColor: color}]}>
            <Text style={styles.commandText}>Commander</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={()=>{
            
            if (!existingItemCart) {
              onAddCart()
            }else {
              navigation.navigate("cart")
            }
            
          }} >
            <FontAwesome name={!existingItemCart ? "cart-plus": "shopping-cart" } size={20} color="black" />
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
    width: 200,

  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  restoName: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',

  },
  productName: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    marginBottom: 4,
  },
  oldPrice: {
    fontSize: RFValue(10),
    color: "gray",
    textDecorationLine: "line-through",
    marginRight: 8,
    fontFamily: 'montserrat-regular',

  },
  newPrice: {
    fontSize: RFValue(10),
    fontFamily: 'montserrat-bold',
  },
  discountBadge: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 6,
    alignSelf: "flex-end",
    marginBottom: 8,
    width: '20%',
    fontFamily: 'montserrat-regular',
    marginRight: 8,

  },
  discountText: {
    color: "white",
    fontSize: RFValue(11),
    fontFamily: 'montserrat-bold',
    textAlign: 'center'
  },
  commandButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  commandText: {
    color: "white",
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(12)
  },
  cartButton: {
    backgroundColor: "#E0E0E0",
    padding: 8,
    borderRadius: 20,
  },
  ratingRow:{
    backgroundColor: 'orange',
    flexDirection: 'row',
    marginRight: 15,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  ratingText: {
    fontSize: 12,
    color: "gray",
    marginLeft: 6,
  },
});

export default XProductItem;
