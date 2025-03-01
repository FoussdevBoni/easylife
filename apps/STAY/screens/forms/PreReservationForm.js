import React, { useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
  Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomDatePicker from '../../components/sections/CustomDatePicker';
import { colors } from '../../../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';

function PreReservationForm({user}) {
  const navigation = useNavigation();
const route = useRoute();
const logement = route.params?.logement
const  data  = useRoute().params?.data;



  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const query = { endDate, startDate , ...data };

  const [showModal1, setShowModal1] = useState(false)
  const [showModal2, setShowModal2] = useState(false)


 


 
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
          <Text style={styles.modalTitle}>Remplir ce formulaire</Text>
        </View>

    <View style={styles.container}>
     
     <View style={styles.row}>
        <Ionicons name="calendar" size={16} color="black" style={styles.icon} />
      
          <TextInput
            style={styles.input}
            placeholder="Date d'arrivée"
            value={startDate}
            onFocus={() => setShowModal1(true)} 
          />
         
      </View>
      <Divider style={styles.divider} />

         <View style={styles.row}>
        <Ionicons name="calendar" size={18} color="black" style={styles.icon} />
      
         
          <TextInput
            style={[styles.input , {marginLeft: 0}]}
            placeholder="Date de départ"
            value={endDate}
            onFocus={() => setShowModal2(true)} 
          />
      </View>
      <Divider style={styles.divider} />

    

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          if (startDate!==""&&endDate!=="") {
            if (user) {
              navigation.navigate('reservation-form', { data: query, logement })
            }else {
              navigation.navigate("login")
            } 
             ;
          } else {
            Alert.alert("Erreur" , "Veillez remplir tous les champs")
          }
        }}
      >
        <Text style={styles.btnText}>Continuer</Text>
      </TouchableOpacity>

   <CustomDatePicker modalVisible={showModal1} setModalVisible={setShowModal1} onDateChange={(e)=>{
    setStartDate(e)
  }}/>      

  <CustomDatePicker modalVisible={showModal2} setModalVisible={setShowModal2} onDateChange={(e)=>{
    setEndDate(e)
  }}/> 

      

     
    </View>
 </SafeAreaView>
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
    borderBottomWidth: 0,
    fontSize: RFValue(14),
    marginTop: 10,
  },
  divider: {
    marginVertical: 10,
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
    fontSize: 16,
    fontWeight: 'bold',
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
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',     
    fontSize: RFValue(16)
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

export default PreReservationForm;
