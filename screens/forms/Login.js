import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { firestoreDbService } from '../../lib/services/firestoreDbService';
import { colors } from '../../utils/colors';
import { auth } from '../../utils/firebaseConfig';
import { setUser } from '../../reducer/userSlice';
import { StatusBar } from 'expo-status-bar';

export default function Login() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    
    setLoading(true);
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((user) => {
        firestoreDbService.getDataByProperty('clients', 'userId', user.user.uid, (data) => {
          if (data.length > 0) {
            dispatch(setUser(data[0]));
            setLoading(false);
            navigation.goBack();
          } else {
            firestoreDbService.getDataByProperty('prestataires', 'userId', user.user.uid, (data) => {
              if (data.length > 0) {
                dispatch(setUser(data[0]));
              } else {
                alert('Compte non trouvé.');
              }
              setLoading(false);
            });
          }
        });
      })
      . catch((error)=>{
       setLoading(false)
        const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case 'auth/invalid-credential':
          alert('Adresse email ou mot de passe de passe  incorrecte.');
          break;
        case 'auth/user-disabled':
          alert('Votre compte a été désactivé.');
          break;
        case 'auth/user-not-found':
          alert('Utilisateur non trouvé.');
          break;
        case 'auth/missing-password':
          alert('Veillez insérer votre mot de passe.');
          break;
        case 'auth/network-request-failed':
          alert('Problème lié à l\'internet. Veuillez réessayer.');
          break;
        case 'auth/too-many-requests':
          alert('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
          break;
           case 'auth/invalid-email':
          alert('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
          break;
        default:
          alert(errorMessage); // Afficher le message d'erreur par défaut

          console.log(errorCode)
      }
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar  backgroundColor={colors.primary} style='light' />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back-circle" size={32} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Votre adresse email"
        keyboardType="email-address"
        placeholderTextColor="#B0B0B0"
        onChangeText={(value) => setForm({ ...form, email: value })}
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
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmer mot de passe"
          secureTextEntry={!passwordVisible}
          placeholderTextColor="#B0B0B0"
          onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

     


      

      <TouchableOpacity onPress={()=>{
        navigation.navigate("forgot-password")
      }}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button , {backgroundColor: '#ccc'}]} onPress={()=>{
        navigation.navigate("register")
      }}>
       
          <Text style={styles.buttonText}>Créer un compte</Text>
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
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
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    color: 'black',
    elevation: 5,
    fontFamily: 'montserrat-regular',

  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    elevation: 5,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
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
    elevation: 5,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: 'montserrat-bold',
  },
});
