import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, FlatList } from 'react-native';

const screenWidth = Dimensions.get('window').width;

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
        navigation.navigate(route ,  { query: category.nom });
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

function XCategoriesList({categories , layout}) {
 
  const navigation = useNavigation();

    return (
     <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
                <CategorieItem layout={layout} navigation={navigation} key={item.id} category={item}  />
              )}
              showsHorizontalScrollIndicator={false}
            />
    );

}

export default XCategoriesList;

const styles = StyleSheet.create({
 
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Pour permettre l'affichage en grille
    justifyContent: 'space-between', // Espacement entre les items
    paddingHorizontal: 10,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 20,
    width: screenWidth / 3 - 20, // Chaque élément prend un tiers de l'écran
  },
  categoryName: {
    marginTop: 5,
    fontSize: 11,
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
