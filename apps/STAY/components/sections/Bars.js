import React, { useEffect, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import CustomDatePicker from './CustomDatePicker';
import { colors } from '../../../../utils/colors';
import getCurrentAddress from '../../../../lib/functions/getCurrentAddress';
import { RFValue } from 'react-native-responsive-fontsize';

function Bars({user}) {
  const navigation = useNavigation();
const route = useRoute();
const [currentAdress , setCurrentAdress] = useState(null)


useEffect(()=>{
  const getLocationData = async ()=>{
    try {
       const data = await  getCurrentAddress({user})
   setCurrentAdress(data)
   console.log(data)
    } catch (error) {
      console.error("error" , error)
    }
  }

  getLocationData()
},[])

const currentLocation  = currentAdress? currentAdress?.ville + " , " + currentAdress?.pays: "";

const location = route.params?.location || currentLocation
const coords = route.params?.coords || currentLocation?.location



if (!location) {
  
  console.warn('Paramètre "location" non défini');
}

  const [people, setPeople] = useState({
    children: '',
    adults: '',
    rooms: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const query = { endDate, startDate, people, location , coords };

 

  

  const [showModal1, setShowModal1] = useState(false)
  const [showModal2, setShowModal2] = useState(false)


   const startSearch = ()=>{
    
     if(location!==""){
        navigation.navigate('logements-list', {data: query });
     } else {
       Alert.alert("Erreur" , "Vous devrez remplir tous les champs avant de continuer")
     }
   }

   
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Ionicons name="location" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Entrez la localisation"
          value={location}
          onFocus={() => {
            navigation.navigate("localisation" , {prevRoute: "logement-home"})
          }} // Ouvrir le modal sur le focus
        />
      </View>
      <Divider style={styles.divider} />

         <View style={styles.row}>
        <Ionicons name="calendar" size={24} color="black" style={styles.icon} />
      
          <TextInput
            style={styles.input}
            placeholder="Date d'arrivée"
            value={startDate}
            onFocus={() => setShowModal1(true)} 
          />
          {/* Input pour la date de fin */}
          <TextInput
            style={[styles.input , {marginLeft: 20}]}
            placeholder="Date de départ"
            value={endDate}
            onFocus={() => setShowModal2(true)} // Ouvre le picker pour la date de fin
          />
      </View>
      <Divider style={styles.divider} />

      <View style={styles.row}>
        <Ionicons name="person" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="1 chambre"
          keyboardType="numeric"
          value={people.rooms.toString()}
          onChangeText={(rooms) => setPeople({ ...people, rooms })}
        />
        <TextInput
          style={styles.input}
          placeholder="- 2 adultes"
          keyboardType="numeric"
          value={people.adults.toString()}
          onChangeText={(adults) => setPeople({ ...people, adults })}
        />
        <TextInput
          style={styles.input}
          placeholder="- 1 enfant"
          keyboardType="numeric"
          value={people.children.toString()}
          onChangeText={(children) => setPeople({ ...people, children })}
        />
      </View>
      <Divider style={styles.divider} />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          startSearch()
        }}
      >
        <Text style={styles.btnText}>Rechercher</Text>
      </TouchableOpacity>



  <CustomDatePicker modalVisible={showModal1} setModalVisible={setShowModal1} onDateChange={(e)=>{
    setStartDate(e)
  }}/>      

  <CustomDatePicker modalVisible={showModal2} setModalVisible={setShowModal2} onDateChange={(e)=>{
    setEndDate(e)
  }}/>  
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 10
  },
  input: {
    flex: 1,
    borderBottomWidth: 0,
    fontSize: RFValue(13),
    marginTop: 10,
    fontFamily: 'montserrat-regular',

  },
  divider: {
    marginVertical: 1,
  },
  btn: {
    backgroundColor: colors.tertiary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontFamily: 'montserrat-bold',
    fontSize: RFValue(13),

  },
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
    fontSize: RFValue(16),
    fontFamily: 'montserrat-bold',
    marginLeft: 10,
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
    fontSize: 16,
    fontFamily: 'montserrat-bold',
  },
  listView: {
    marginTop: 10,
  },
});

export default Bars;
