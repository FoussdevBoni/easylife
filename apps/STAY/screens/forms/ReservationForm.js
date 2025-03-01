import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { calculDuration } from '../../../../lib/functions/calculeDuration';
import { firestoreDbService } from '../../../../lib/services/firestoreDbService';
import { colors } from '../../../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';

export default function ReservationForm({ user }) {
  const [selectedPurpose, setSelectedPurpose] = useState('Loisirs');
  const { logement, data } = useRoute().params;

  const navigation = useNavigation();
  const [loading , setLoading] = useState(false)
  // Initialise le formulaire avec des valeurs par défaut
  const [form, setForm] = useState({
    client: user?.nom || '',
    email: user.email ||'',
    phone: user.tel || '',
    country: ''
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    setLoading(true)
    const dataToSend = {
      ...form,
      clientId: user.id,
      prestataireId: logement.prestataireId,
      ...data,
      date: new Date().toISOString(),
      nom: logement.nom,
      prix: logement.prix*duration,
      image: logement.images[0]
    };
    firestoreDbService.postData('reservations', dataToSend, () => {
          setLoading(false)
          navigation.navigate("success")
    }, () => {
      // Gestion des erreurs
      Alert.alert("Erreur" , "Une erreur s'est produite lors de réservationb. Veillez réessayer")
      setLoading(false)
    });
  };


const duration = data ? calculDuration(data?.startDate  , data?.endDate): 1

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.Action
          icon={() => (
            <Ionicons
              style={{ marginTop: -4, marginLeft: -7 }}
              size={30}
              name="chevron-back-circle"
              color="white"
            />
          )}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>Informations personnelles</Text>
        </View>
      </Appbar.Header>

      {/* Formulaire */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={form.client}
          onChangeText={(value) => handleInputChange('client', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse e-mail"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro de portable"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Pays/région"
          value={form.country}
          onChangeText={(value) => handleInputChange('country', value)}
        />

        {/* Objet principal du voyage */}
        <Text style={styles.label}>Quel est l’objet principal de votre voyage?</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setSelectedPurpose('Travail')}
          >
            <Text style={styles.radioText}>Travail</Text>
            <View style={styles.radioCircle}>
              {selectedPurpose === 'Travail' && <View style={styles.selectedRb} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setSelectedPurpose('Loisirs')}
          >
            <Text style={styles.radioText}>Loisirs</Text>
            <View style={styles.radioCircle}>
              {selectedPurpose === 'Loisirs' && <View style={styles.selectedRb} />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Prix et bouton Réserver */}
      <View style={styles.footer}>
        <Text style={styles.priceText}>XAF {logement.prix*duration} 
          ({duration} jours)

        </Text>
        <Text style={styles.taxText}>Taxes et frais compris</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleSubmit}
        >
          {
            !loading ?  <Text style={styles.bookButtonText}>Réserver</Text>: <ActivityIndicator size={25} color='white'/>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: colors.tertiary,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  restaurantName: {
    color: 'white',
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(14)


  },
  form: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontFamily: 'montserrat-regular',
    fontSize: RFValue(13)

  },
  label: {
    fontSize: RFValue(13),
    color: '#444',
    marginBottom: 10,
    fontFamily: 'montserrat-regular',

  },
  radioContainer: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#5C2D91',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5C2D91',
  },
  footer: {
    backgroundColor: '#E5E5E5',
    padding: 20,
    borderRadius: 10,
  },
  priceText: {
    fontSize: RFValue(14),
    fontFamily: 'montserrat-bold',
    color: '#000',
  },
  taxText: {
    fontSize: RFValue(12),
    color: '#777',
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: colors.tertiary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  bookButtonText: {
    color: 'white',
    fontSize: RFValue(14),
    fontFamily: 'montserrat-bold',
    textAlign: 'center',
  },
});
