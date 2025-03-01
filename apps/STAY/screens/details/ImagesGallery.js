import { useRoute, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Gallery from 'react-native-awesome-gallery';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé @expo/vector-icons

const ImagesGallery = () => {
  const { images } = useRoute().params;
  const navigation = useNavigation();

  const uris = images.map((item) => item.uri);

  return (
    <View style={styles.container}>
      {/* Bouton "Close" */}
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close-circle" size={36} color="white" />
      </TouchableOpacity>

      <Gallery
        data={uris}
        keyExtractor={(item, index) => index.toString()}
        onIndexChange={(index) => console.log('Image actuelle:', index + 1)}
        style={styles.gallery}
        renderOverlay={({ item, index }) => (
          <View style={styles.overlay}>
            <Text style={styles.caption}>Image {index + 1}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  gallery: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
  },
});

export default ImagesGallery;
