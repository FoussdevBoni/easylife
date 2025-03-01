import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icône de fermeture

const { height, width } = Dimensions.get('window');

export default function CustomModal({
  children,
  title,
  isModalVisible,
  setModalVisible,
  color
}) {
  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={[styles.modalHeader , {backgroundColor: color}]}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Modal Content (remplit tout l'écran) */}
          <View style={styles.modalContent}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width, // Largeur de l'écran
    height: height, // Hauteur de l'écran
    backgroundColor: 'white', // Thème blanc
    
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'montserrat-bold',
    color: 'white',
  },
  modalContent: {
    flex: 0.5, // Remplit tout l'écran en hauteur
    backgroundColor: 'white', // Fond blanc pour le contenu
    padding: 16,
    justifyContent: 'center',
  },
});
