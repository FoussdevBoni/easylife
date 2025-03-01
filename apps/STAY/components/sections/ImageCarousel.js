import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const ImagesCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

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

  const renderItem = ({ item }) => (
    <View
      activeOpacity={0.8}
      style={styles.bannerContainer}
    >
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

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
        onMomentumScrollEnd={(e) => {
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const index = Math.floor(contentOffsetX / width);
          setActiveIndex(index);
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
  },
  image: {
    width: '92%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default ImagesCarousel;
