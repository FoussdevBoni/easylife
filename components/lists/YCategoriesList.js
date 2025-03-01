import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width; // Obtenir la largeur de l'écran

const CategorieItem = ({ navigation, category , layout }) => {

   const [route , setRoute] = useState()
    useEffect(()=>{
      if (layout==='restaurant') {
        setRoute("plats-by-category")
      }  else if(layout==='supermarket'){
          setRoute("articles-by-category")
      }
     } , [])
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(route, { query: category.nom });
      }}
      style={styles.categoryItem}
    >
      <View style={styles.avatar}>
        <Image source={{ uri: category.logo }} style={styles.logo} />
      </View>
      <Text style={styles.categoryName}>{category.nom}</Text>
    </TouchableOpacity>
  );
};

function YCategoriesList({categories , layout}) {
  

  const navigation = useNavigation();


  return (
    <View style={styles.gridContainer}>
      {categories.map((category, index) => (
        <CategorieItem layout={layout} key={index} navigation={navigation} category={category} />
      ))}
    </View>
  );
}

export default YCategoriesList;

const styles = StyleSheet.create({
  horizontalContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 10,
  },
  categoryItem: {
    width: (screenWidth / 3) - 20, 
    marginBottom: 20, 
  },
  categoryName: {
    marginTop: 5,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'montserrat-regular',

  },
  avatar: {
    width: '100%', 
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
});
