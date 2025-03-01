import React, { useEffect, useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ImagesGallery = ({ images }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reorderedImages, setReorderedImages] = useState([]);
  const navigation = useNavigation();
  const visibleImagesCount = 4;

  // Synchroniser l'état avec les props
  useEffect(() => {
    setReorderedImages(images);
  }, [images]);

  // Réinitialiser modalVisible lorsqu'on revient sur cet écran
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false); // Réinitialiser l'état à chaque fois que l'écran est en focus
      return () => setModalVisible(false); // Nettoyage si on quitte l'écran
    }, [])
  );

  const moveImageToFront = (index) => {
    const updatedImages = [...reorderedImages];
    const [selectedImage] = updatedImages.splice(index, 1);
    updatedImages.unshift(selectedImage);
    setReorderedImages(updatedImages);
  };

  const renderImage = ({ item }) => {
    const index = reorderedImages.indexOf(item);
    return (
      <TouchableOpacity
        onPress={() => {
          moveImageToFront(index);
          navigation.navigate('logement-images', { images: reorderedImages });
        }}
        style={styles.imageContainer}
      >
        <Image source={{ uri: item.uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const renderMainImage = ({ item, index }) => {
    if (index === visibleImagesCount - 1 && reorderedImages.length > visibleImagesCount) {
      const remainingImages = reorderedImages.length - visibleImagesCount;
      return (
        <TouchableOpacity style={styles.moreContainer} onPress={() => setModalVisible(true)}>
          <View style={styles.moreOverlay}>
            <Text style={styles.moreText}>+{remainingImages}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return renderImage({ item });
  };

  return (
    <View>
      <FlatList
        data={reorderedImages.slice(0, visibleImagesCount)}
        renderItem={renderMainImage}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {/* Modal pour afficher toutes les images */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
          <FlatList
            data={reorderedImages}
            renderItem={renderImage}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        </View>
      </Modal>
    </View>
  );
};
const {width} = Dimensions.get('screen')
const styles = StyleSheet.create({
  grid: {
    width: '100%',
  },
  imageContainer: {
    width: '45%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    marginLeft: width*0.034
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  moreContainer: {
    width: '45%',
    height: 150,
  },
  moreOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    margin: 10,
  },
  modalCloseText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ImagesGallery;
