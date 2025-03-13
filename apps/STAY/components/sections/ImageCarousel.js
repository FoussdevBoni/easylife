import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { firestoreDbService } from '../../../../lib/services/firestoreDbService';
import { colors } from '../../../../utils/colors';

const { width, height } = Dimensions.get('window');

const ImagesCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
 const [loading , setLoading] = useState(false)
  // Vérifie que les images existent bien
  if (!Array.isArray(images) || images.length === 0) return null;

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length; // Retourne au début à la fin du tableau
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Défile toutes les 3 secondes

    return () => clearInterval(interval); // Nettoyage lors du démontage du composant
  }, [images.length]);

  const navigate= async (id)=>{

    setLoading(true)
    try {
      const logement = await firestoreDbService.getDataById("logements" , id)
      console.log(id)
       if (logement) {
        setLoading(false)
        navigation.navigate("logement-details" , {logement: {
          ...logement,
          id
        }})
       }
    } catch (error) {
      setLoading(false)
    }
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.bannerContainer}
      onPress={()=>{
        navigate(item.id)
      }}
    >
      <Image source={{ uri: item.img }} style={styles.image} />
      <View style={styles.textOverlay}>
        <Text style={styles.titleText}>{item.nom || 'Résidence'}</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {item.slogan}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  if (loading) {
   return(
    <View style={styles.container}>
    <ActivityIndicator size={50} color={colors.tertiary}/>
   </View>
   )
  }
  return (
    <View style={styles.container}>
      <FlatList
  ref={flatListRef}
  data={images}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item, index) => index.toString()}
  renderItem={renderItem}
  getItemLayout={(data, index) => ({
    length: width, // Largeur de chaque élément
    offset: width * index,
    index,
  })}
  onMomentumScrollEnd={(e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setActiveIndex(index);
  }}
  onScrollToIndexFailed={(info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 1000));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
    });
  }}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    width: width,
    height: 200,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '92%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: '8%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: '0%',
    paddingVertical: 1
  },
  titleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  descriptionText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
});


export default ImagesCarousel