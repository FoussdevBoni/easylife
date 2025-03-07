import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import YProductItem from '../items/YProductItem';
import { setCart } from '../../reducer/cartSlice';

const ProductItem = ({ product , layout , color }) => {
  const [quantity, setQuantity] = useState(1);
  const cart = useSelector((state) => state.cart.cartData);
  const existingItemCart = cart.find((item) => product?.id === item?.id);
  const navigation = useNavigation();
  const dispatch = useDispatch();
   const [route , setRoute] = useState()

  const addToCart = () => {
    if (existingItemCart) {
      const updatedCart = cart.map((item) =>
        item?.id === product?.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      dispatch(setCart(updatedCart));
    } else {
      dispatch(setCart([...cart, { ...product, quantity }])); // Utiliser la quantité définie
    }
  };
     useEffect(()=>{
      if (layout==='restaurant') {
        setRoute("plat-details")
      } else if (layout==='pharmacie') {
          setRoute("medico-details")
      } else if(layout==='supermarket'){
          setRoute("article-details")
      }
     } , [])

  if (!product) return null;

  return (
    <TouchableOpacity
      style={styles.articleItem}
      onPress={() => navigation.navigate(`${route}`, {  product })}
    >
      <YProductItem color={color} openDetails={()=>{
        navigation.navigate(`${route}`, {  product })
      }}  layout={layout}  product={product} onAddCart={addToCart} />
    </TouchableOpacity>
  );
};

function YProductList({ products , color , layout }) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductItem layout={layout} color={color} product={item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
}

export default YProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  articleItem: {
    paddingHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    paddingVertical: 5
  }
});
