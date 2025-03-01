import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';

const VariationItem = ({ nom, prix, image, onAddToCart , color , id }) => {

  const cart = useSelector((state) => state.cart.cartData);
    const existingItemCart = id ? cart.find((item) => item.id === id): cart.find((item) => item.nom === nom);
  const navigation= useNavigation()

  return (
    <View style={styles.container}>
      {/* Afficher l'image */}
      <Image source={{uri: image}} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{nom}</Text>
        <Text style={styles.price}>{prix} XOF</Text>
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={()=>{
        if (!existingItemCart) {
          onAddToCart()
        }else {
          navigation.navigate("cart")
        }
      }} style={{...styles.addButton , borderColor: color}}>
        <Ionicons name="cart" size={24} color={color} />
        <Text style={styles.addButtonText}>
          {
           existingItemCart ? "Voir panier": " Ajouter au panier"
          }
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    resizeMode: 'contain'
  },
  infoContainer: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    minHeight: 50

  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer:{
    alignItems: 'center',
    paddingVertical: 8

  },
  addButton: {
    paddingVertical: 8,
    flexDirection: 'row',
    borderWidth: 1,
    width: '80%',
    borderRadius: 20,
    justifyContent: 'center'
  },

  addButtonText:{
    marginLeft: 5,
    marginTop: 2,
    textAlign: 'center'
  }
});

export default VariationItem;