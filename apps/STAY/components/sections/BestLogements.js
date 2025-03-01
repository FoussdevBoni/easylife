import React, { useState, useEffect } from 'react';
import ImagesCarousel from './ImageCarousel';
import { useSelector } from 'react-redux';
import { View, Text } from 'react-native';

const BestLogements = () => {
  const imagesFromStore = useSelector(state => state.images.images);
  const [images, setImages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (imagesFromStore && imagesFromStore.length > 0) {
      if (isMounted) setImages(imagesFromStore);
    }

    return () => {
      isMounted = false;
    };
  }, [imagesFromStore]);

  if (images.length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <Text>Chargement des images...</Text>
      </View>
    );
  }

  return <ImagesCarousel images={images} />;
};

export { BestLogements };
