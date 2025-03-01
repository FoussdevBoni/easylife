import { useNavigation } from '@react-navigation/native';
import React, {  useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import XProductItem from '../items/XProductItem';
import { setCart } from '../../reducer/cartSlice';

const ProductItem = ({ product, color , layout }) => {
  const [quantity, setQuantity] = useState(1);
   const [route , setRoute] = useState()

  const cart = useSelector((state) => state.cart.cartData);  
  const existingItemCart = cart.find((item) => item.id === product.id);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const addToCart = () => {
    if (existingItemCart) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      dispatch(setCart(updatedCart));
    } else {
      dispatch(setCart([...cart, { ...product, quantity: 1 }]));
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
  

 

  return (
    <TouchableOpacity onPress={()=>{
      navigation.navigate(`${route}` , {product})
    }}>
       <XProductItem  color={color} product={product} onAddCart={()=>{
        addToCart()
       }}/>
    </TouchableOpacity>
  );
};

function XProductsList({ products , layout , color }) {
  return (
 
     <FlatList
          data={products}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem color={color} key={item.id} product={item} 
            layout={layout}/>
          )}
          showsHorizontalScrollIndicator={false}
        />
  );
}

export default XProductsList;

