import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Si vous utilisez React Navigation
import { colors } from '../../utils/colors';
import { auth } from '../../utils/firebaseConfig';
import { RFValue } from 'react-native-responsive-fontsize';


const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // Utilisé pour gérer la navigation (bouton retour)

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Un email de réinitialisation a été envoyé à votre adresse.');
      })
      .catch(error => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      {/* Bouton retour */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back-circle" size={32} color="white" />
      </TouchableOpacity>

      {/* Image en haut */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/pwforgot.png')} // Assurez-vous que le chemin de l'image est correct
          style={styles.image}
        />
      </View>

      {/* Contenu principal */}
      <Text style={styles.title}>Mot de passe oublié ?</Text>
      <Text style={styles.subtitle}>
        Indiquez l'adresse e-mail utilisée pour créer votre compte Easy Life et nous vous enverrons un email de réinitialisation.
      </Text>

      {/* Champ email */}
      <TextInput
        style={styles.input}
        placeholder="Adresse email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)} // Stocke l'email dans le state
      />

      {/* Bouton envoyer */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Fond orange
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'montserrat-bold',
    color: '#fff',
    textAlign: 'center',
    fontSize: RFValue(16),

  },
  subtitle: {
    fontSize: RFValue(13),
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'montserrat-regular',

  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: RFValue(13),
    fontFamily: 'montserrat-regular',

  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    color: colors.primary,
  },

});

export default ForgotPasswordScreen;
