import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';

const RatingSection = ({title , onSubmit , color}) => {
  const [rating, setRating] = useState(0); // Note donnée par l'utilisateur
  const [review, setReview] = useState(''); // Avis écrit par l'utilisateur

  // Gérer le clic sur une étoile
  const handleRatingPress = (star) => {
    setRating(star);
  };

  // Gérer l'envoi de l'avis
  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Erreur','Veuillez sélectionner une note.');
    }  else {
       await onSubmit({rating , review})
      setRating(0);
      setReview('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Titre */}
      <Text style={styles.title}>{title}</Text>

      {/* Système de notation par étoiles */}
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingPress(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={30}
              color="#FFD700" // Couleur dorée pour les étoiles
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Champ d'avis */}
      <TextInput
        style={styles.input}
        placeholder="Écrivez votre avis ici..."
        placeholderTextColor="#999"
        multiline
        value={review}
        numberOfLines={6}
        onChangeText={setReview}
      />

      {/* Bouton d'envoi */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={[styles.buttonText , {    color: color}]}>Soumettre</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: 'montserrat-bold',
    marginBottom: 20,
    fontSize: RFValue(14),

  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    fontFamily: 'montserrat-regular',
    padding: 15,
    height: 100,
    fontSize: RFValue(14),

    color: '#333',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Pour Android
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Pour Android
  },
  buttonText: {
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(16),

  },
});

export default RatingSection;
