import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Appbar, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setUser } from '../../reducer/userSlice';
import { uploadPhotoService } from '../../lib/services/uploadPhotoSerrvice';
import { firestoreDbService } from '../../lib/services/firestoreDbService';
import { StatusBar } from 'expo-status-bar';
import StackAppbar from '../../components/StackAppBar';
import { RFValue } from 'react-native-responsive-fontsize';

function Profile({ user , color }) {
  const [dataChanged, setDataChanged] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [name, setName] = useState(user?.nom || '');
  const [phone, setPhone] = useState(user?.tel || '');
  const [profilePic, setProfilePic] = useState(user?.profile || '');
  const [imageLoading, setImageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigation  = useNavigation()
  // Fonction qui vérifie si les données ont changé
  const handleDataChange = (newName, newPhone) => {
    if (newName !== user?.nom || newPhone !== user?.tel || profilePic !== user?.profile) {
      setDataChanged(true);
    } else {
      setDataChanged(false);
    }
  };


  const changeProfilePic = async () => {
    try {
      setImageLoading(true);
      const data = (await uploadPhotoService.takePhoto('library', 'images/profiles/' + user?.userId, user?.userId)).uploadResp;
      const imageUrl = data?.downloadUrl;
      setProfilePic(imageUrl);
      
      setImageLoading(false);
      setDataChanged(true);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification de la photo de profil');
      setImageLoading(false);
    }
  };

  const updateProfile = () => {
    const newUser = {
      ...user,
      profile: profilePic,
      tel: phone,
      nom: name,
      id: user?.id,
    };

    setSubmitting(true);
    firestoreDbService.updateData(
      'clients',
      user.id,
      newUser,
      () => {
        Alert.alert('Succès', 'Votre profil a été mis à jour avec succès');
        setSubmitting(false);
        setDataChanged(false);
        dispatch(setUser(newUser))
      },
      () => {
        Alert.alert('Échec', 'La mise à jour de votre profil a échoué');
        setSubmitting(false);
      }
    );
  };

  const logout = () => {
    dispatch(setUser(null));
    navigation.navigate("main-landing")
    Alert.alert('Déconnecté', 'Vous avez été déconnecté avec succès.');
  };

  return (
     <>
     {
      user && <View style={styles.container}>
              <StatusBar  backgroundColor={color} style='light' />
        
           <StackAppbar color={color} title='Mon profil'/>

         {
          user &&   <View style={styles.detailsContainer}>
        <View style={styles.profileContainer}>
          <Image style={styles.profilePic} source={{ uri: profilePic || 'https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg' }} />
          <TouchableOpacity style={styles.editBtn} onPress={changeProfilePic}>
            {imageLoading ? <ActivityIndicator color={color} size={30} /> : <Ionicons name="camera" size={24} color="black" />}
          </TouchableOpacity>
        </View>
        <Divider />

        {/* Username Section */}
        <View style={styles.userNameContainer}>
          {editName ? (
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={(text) => {
                setName(text);
                handleDataChange(text, phone);
              }}
              onBlur={() => setEditName(false)}
            />
          ) : (
            <Text style={styles.username}>{name}</Text>
          )}
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditName(true)}>
            <Ionicons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
         }

      <View style={styles.detailsContainer}>
        {/* Phone Section */}
        <View style={styles.phoneContainer}>
          {editPhone ? (
            <TextInput
              style={styles.textInput}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={(text) => {
                setPhone(text);
                handleDataChange(name, text);
              }}
              onBlur={() => setEditPhone(false)}
            />
          ) : (
            <Text style={styles.phone}>{phone}</Text>
          )}
          <TouchableOpacity style={styles.editBtn} onPress={() => setEditPhone(true)}>
            <Ionicons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.passwordChange}>
        <TouchableOpacity style={styles.passwordChangeRow}
         onPress={()=>{
          navigation.navigate("forgot-password")
         }}
        >
          <Ionicons name="lock-closed" size={24} color="black" />
          <Text style={styles.passwordChangeText}>Changer le mot de passe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutBtnContainer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out" size={24} color="black" />
          <Text style={styles.logoutBtnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      {/* Button "Mettre à jour" */}
      {dataChanged && (
        <View style={[styles.updateBtnContainer]}>
          <TouchableOpacity
            style={[styles.updateButton, , {backgroundColor: color}, submitting && { opacity: 0.5 }]}
            onPress={updateProfile}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateBtnText}>Mettre à jour</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
     }
     
     </>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(13)

  },
  detailsContainer: {
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  username: {
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(13)

  },
  phone: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
  },
  textInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 10,
    fontFamily: 'montserrat-regular',
  },
  passwordChange: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  passwordChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordChangeText: {
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',
    marginLeft: 18,
  },
  updateBtnContainer: {
    alignItems: 'center',
    marginBottom: 3,
    alignSelf: 'stretch',
    padding: 10,
  },
  updateButton: {
    paddingVertical: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
    
  },
  updateBtnText: {
    color: 'white',
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(13)
  },
  logoutBtnContainer: {
     alignItems: 'center',
    marginBottom: 3,
    alignSelf: 'stretch',
    padding: 10,

  },
  logoutBtn: {
    flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // Centrer le contenu horizontalement
  backgroundColor: '#ccc',
  paddingVertical: 15,
  borderRadius: 30,
  width: '80%',
  marginTop: 10,
  },
  logoutBtnText: {
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(13)
  },
});
