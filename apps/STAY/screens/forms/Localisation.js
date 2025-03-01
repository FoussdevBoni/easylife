import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';

function Localisation(props) {
  const [location, setLocation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation()
  const  prevRoute = useRoute().params.prevRoute
  const [coords , setCoords] = useState({})
  return (
    
      <SafeAreaView
        style={[
          styles.modalContainer,
          { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
        ]}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() =>{
            navigation.navigate('logement-home')
          }}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Rechercher une localisation</Text>
        </View>

        <GooglePlacesAutocomplete
          placeholder="Rechercher un lieu"
          fetchDetails
          onPress={(data, details = null) => {
            setLocation(data.description);
            setModalVisible(false);
             if (details) {
            const { lat, lng } = details.geometry.location;
            setCoords({ latitude: lat, longitude: lng });
            console.log('Coordonnées :', { latitude: lat, longitude: lng });
          }
          }}
          query={{
            key: 'AIzaSyAwf178t91ovFdffLHjwvyVnT0CMsUnydg',
            language: 'fr',
          }}
          styles={{
            textInput: styles.input,
            listView: styles.listView,
          }}
        />

       

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
            navigation.navigate(prevRoute , {location , coords})
          }}
        >
          <Text style={styles.saveBtnText}>Continuer</Text>
        </TouchableOpacity>
      </SafeAreaView>
  );
}

export default Localisation;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalTitle: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',     
    fontSize: RFValue(16)
  },
  input: {
    borderBottomWidth: 0,
    fontSize: RFValue(13),
    marginTop: 10,
  },
  map: {
    flex: 1,
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: colors.tertiary,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',

  },
  listView: {
    marginTop: 10,
  },
});
