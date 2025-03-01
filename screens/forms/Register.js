import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
import { firestoreDbService } from '../../lib/services/firestoreDbService';
import { auth } from '../../utils/firebaseConfig';
import { setUser } from '../../reducer/userSlice';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    nom: '',
    tel: '',
    password: '',
    ville: '',
    pays: ''
  });

  const navigation = useNavigation()

  const dispatch = useDispatch();
   
  function handleSubmit() {
    if (form.nom !== '' && form.password !== '' && form.tel && form.email!=='') {
          setLoading(true)
      createUserWithEmailAndPassword(auth, form.email, form.password)
        .then((user) => {
          const data = {
            ...form,
            userId: user.user.uid,
          };

          firestoreDbService.postData('clients', data, (id) => {
            const userData = {
              ...form,
              userId: user.user.uid,
              id: id
            };
            
            dispatch(setUser(userData));
                setLoading(false)
          },
          (error) => {
            console.log(error);
            setLoading(false)
            alert("Une erreur s'est produite. Veuillez réessayer.");
          });
        })
        .catch((error) => {
          console.log(error);
             setLoading(false)
          if (error.code === 'auth/network-request-failed') {

            alert('Vérifiez votre connexion Internet pour pouvoir continuer.');
          }
        });
    } else {
      alert('Veuillez remplir tous les champs');
    }
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission d\'accéder à la localisation refusée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords);

      if (address.length > 0) {
        const { city, country } = address[0];
        console.log(address[0]);
        setForm((prevForm) => ({
          ...prevForm,
          ville: city || '',
          pays: country || '',
        }));
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
        <StatusBar  backgroundColor={colors.primary} style='light' />
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back-circle" size={32} style={{ fontWeight: '900' }} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Votre nom complet"
        placeholderTextColor="#B0B0B0"
        onChangeText={(value) => setForm({ ...form, nom: value })}
      />
     
      <TextInput
        style={styles.input}
        placeholder="Votre adresse email"
        keyboardType="email-address"
        placeholderTextColor="#B0B0B0"
        onChangeText={(value) => setForm({ ...form, email: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        keyboardType="phone-pad"
        placeholderTextColor="#B0B0B0"
        onChangeText={(value) => setForm({ ...form, tel: value })}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#B0B0B0"
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={()=>{
        navigation.navigate('login')
      }}>
        <Text style={styles.link}>Connectez-vous ici</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
         {
          loading ? <ActivityIndicator size={30} color={colors.primary}/>: <Text style={styles.buttonText}>S'inscrire</Text>
         }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, // Fond orange
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'montserrat-bold',
    color: 'white',
    marginTop: 40,
    marginBottom: 100,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25, // Bords bien arrondis
    padding: 10,
    marginVertical: 10,
    color: 'black',
    fontFamily: 'montserrat-regular',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Ajout d'ombre pour l'effet surélevé
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10, // Correction ici pour ajuster la hauteur
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Ajout d'ombre
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10, // Correction pour correspondre à la taille des autres champs
    color: 'black',
    fontFamily: 'montserrat-regular',

  },
  link: {
    textAlign: 'right',
    color: 'black',
    textDecorationLine: 'underline',
    marginVertical: 10,
    fontFamily: 'montserrat-regular',

  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Ajout d'ombre pour l'effet du bouton
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: 'montserrat-bold',
  },
});
