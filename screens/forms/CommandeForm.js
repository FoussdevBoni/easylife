import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Modal, TextInput, Alert, ScrollView, Keyboard } from 'react-native';
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { payementService } from '../../lib/services/payementService';
import { setUser } from '../../reducer/userSlice';
import { uploadPhotoService } from '../../lib/services/uploadPhotoSerrvice';
import { firestoreDbService } from '../../lib/services/firestoreDbService';
import getCurrentAddress from '../../lib/functions/getCurrentAddress';
import { colors } from '../../utils/colors';
import CustomModal from '../../components/CustomModal';
import StackAppbar from '../../components/StackAppBar';
import { RFValue } from 'react-native-responsive-fontsize';

function CommandeForm({ user , color , layout }) {
 const [selectedLocation, setSelectedLocation] = useState('home');
const [selectedPayment, setSelectedPayment] = useState('mainAccount');
const { cart , amount: sampleAmount} = useRoute().params;
const pharmaCart = cart.filter(item => item.layout === 'pharmacie');
const [currentAddress, setCurrentAddress] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
const [details, setDetails] = useState("");
const [ordonnance , setOrdonnance ]= useState("")
const [modalVisible1, setModalVisible1] = useState(false);
const [phoneNumber , setPhoneNumber] = useState(user.tel)
const [loading, setLoading] = useState(false);
const [imageLoading, setImageLoading] = useState(false);
const navigation = useNavigation();
const dispatch = useDispatch()
const [payementRef , setPayementRef] = useState("")
const amount = sampleAmount + 500
const [showFooter , setShowFooter ]= useState(true)
const sendNotif = () => {
    const notification = {
        message: `${user?.nom} a commandée  ${pharmaCart.length} medicaments `,
        date: new Date().toISOString(),
        receiverId: 'superadminId',
    };

  
};

useEffect(() => {
  const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
    setShowFooter(false);
  });

  const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
    setShowFooter(true);
  });

  return () => {
    showSubscription.remove();
    hideSubscription.remove();
  };
}, []);


const handleSendCommande = () => {
   setLoading(true)
  const products = pharmaCart.map((item=>({
    id: item.id,
    nom: item.nom,
    prix: item.prix,
    quantite: item.quantite,
    layout: item.layout,
    prestataireName: item.prestataireName,
    prestataireId: item.prestataireId,
    categorie: item.categorie,
    image: item.images[0],
    quantity: item.quantity,
    

  })))

  const commande= {
        clientId: user.id,
        products,
        contact: user.tel,
        productType: 'medicament',
        statut: 'En attente',
        date: new Date().toISOString(),
        adresse: currentAddress,
        client: user.nom,
        details,
        ordonnance,
        selectedLocation
      
  }


   firestoreDbService.postData('commandes', commande, (id) => {  
        sendNotif()
       setLoading(false) 
        navigation.navigate("success")
        }, (error) => {
          Alert.alert("Oups !" , "Une erreur s'est produite lors de l'envoie de la commande. Veillez réessayer")
           setLoading(false)
        });
};

       const handleSubmit = ()=>{

            const currentBalance = user.solde || 0
            if (selectedPayment==='mainAccount') {

              const newBalance = parseFloat(currentBalance) - parseFloat(amount)
              if (newBalance<0) {
                Alert.alert("Désolé" , "Votre solde est insuffisant pour cet achat. Veillez recharger votre compte")
                  sendNotif()
                 setLoading(false) 
              }else{
                   setLoading(true)
                const newUser = {
                  ...user,
                  solde: newBalance
                }
                 firestoreDbService.updateData("clients" , user.id , newUser , ()=>{
                  dispatch(setUser(newUser))

                  handleSendCommande()


                 } , (error)=>{
                   Alert.alert("Erreur" , "Une erreur est survenue lors de l'opération. Veillez réessayer")
                 }) 
              }


            }else{

              setLoading(true)
              
                 payementService.handlePayByMomo(amount , phoneNumber , user , setLoading , 'Achat de médicaments' , (data)=>{
                   const { status, transaction_ref } = data;
                   setPayementRef(transaction_ref)
                 },
                 (error)=>{
                  console.log('error' , error)
                  setLoading(false)
                 }
                 
                 
                 )

            }
      }


 const uploadFile = async (source) => {
    setImageLoading(true);
    try {
      const response = await uploadPhotoService.takePhoto(source, 'images/pieces/');
      setOrdonnance(response?.uploadResp?.downloadUrl);
      setImageLoading(false);

    } catch (error) {
      Alert.alert("Oups!" , "Une erreur s'est produite")
      console.log("error" , error)
      setImageLoading(false);
    }
  };

useEffect(()=>{

  const getAddress = async()=>{
    const myAddress = await getCurrentAddress({user})
    setCurrentAddress(myAddress)
  }

  getAddress()

 
} , [])

  // Suivi du statut du paiement
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!payementRef) return; // Pas besoin de vérifier si pas de transaction

      try {
        const response = await axios.get(
          `https://my-coolpay.com/api/23b12b2c-0274-4556-b1e8-39e21b9830b0/checkStatus/${payementRef}`
        );
        const { transaction_status } = response.data;

        if (transaction_status === "SUCCESS") {
          handleSendCommande()
        } else if (transaction_status === "FAILED") {
          Alert.alert("Échec", "La transaction a échoué.");
          setLoading(false);
          
        } else {
            
          console.log("Statut de transaction en attente ou inconnu.");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut de paiement:", error);
      }
    };

    if (payementRef) {
      const intervalId = setInterval(checkPaymentStatus, 5000); // Vérifier toutes les 5 secondes
      return () => clearInterval(intervalId); // Nettoyer l'intervalle après l'utilisation
    }
  }, [payementRef]);



  return (
    <View style={styles.container}>
      {/* Header */}
      <StackAppbar title='Paiement' color={color}/>

      {/* Main content */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            La commande sera livrée à {user?.nom}
          </Text>
        </View>

        {/* Destination selection */}
        <View style={styles.destinationsContainer}>
          <View style={styles.destination}>
            <View style={styles.row}>
              <RadioButton
                color={color}
                value="home"
                status={selectedLocation === 'home' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedLocation('home')}
              />
              <Text style={styles.destinationText}>Chez moi</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="call-outline" size={25} />
              <Text style={styles.destinationText}>
                {user.tel}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={25} />
              <Text style={styles.destinationText}>
                {currentAddress?.ville ? currentAddress?.ville: 'Ma position'}
              </Text>
            </View>
          </View>

          <View style={styles.destination}>
            <View style={styles.row}>
              <RadioButton
              color={color}
                value="work"
                status={selectedLocation === 'work' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedLocation('work')}
              />
              <Text style={styles.destinationText}>Au travail</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="call-outline" size={25} />
              <Text style={styles.destinationText}>
                {user.tel}
              </Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="location-outline" size={25} />
              <Text style={styles.destinationText}>
               {currentAddress?.ville ? currentAddress?.ville: 'Ma position'}

              </Text>
            </View>
          </View>
        </View>

        {/* Payment method selection */}
        <View style={styles.paymentContainer}>
          <Text style={styles.sectionTitle}>Choisir un mode de paiement</Text>

          <View style={styles.row}>
           
            <Text style={styles.paymentText}>
              Compte EASY LIFE PAY
            </Text>
             <RadioButton
               color={color}
              value="mainAccount"
              status={selectedPayment === 'mainAccount' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('mainAccount')}
            />
          </View>

          <View style={styles.row}>
           
            <Text style={styles.paymentText}>
              {'Mobile Money '}
            </Text>
             <RadioButton
              color={color}
              value="momo"
              status={selectedPayment === 'momo' ? 'checked' : 'unchecked'}
              onPress={() => {
                setSelectedPayment('momo')
              }}
            />
          </View>
           
          <View  style={styles.inputContainer}>
          {
            selectedPayment === 'momo' &&   <TextInput
            onFocus={()=>{
              setShowFooter(false)
            }}
            onBlur={()=>{
              setShowFooter(true)
            }}
            style={styles.input}
            placeholder="Entrez votre numéro Mobile money"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
           
           }
          </View>
            

       
        </View>
         {/* Button to open the modal */}
          <TouchableOpacity
            style={[styles.addDetailsButton , {backgroundColor: color}]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addDetailsButtonText}>Ajouter plus de details</Text>
          </TouchableOpacity>
      </ScrollView>


      {/* Footer: Amount and validation button */}
       {
        showFooter &&  <View style={styles.about}>
        <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Frais de livraison :</Text>
            <Text style={{...styles.amountValue, color}}>{500} FCFA</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Montant total :</Text>
            <Text style={{...styles.amountValue, color}}>{amount} FCFA</Text>
          </View>
  
          <View style={styles.validationContainer}>
            <TouchableOpacity style={[styles.validationButton , {backgroundColor: color}]} onPress={()=>{
                 if (!loading) {
                handleSubmit()
              }else{
                Alert.alert("Désolé" , "Une opération est en cour")
              }
            }}>
              {
                !loading ? <Text style={styles.validationButtonText}>Valider votre commande</Text>: <ActivityIndicator size={25} color='white'/>
              }
            </TouchableOpacity>
          </View>
        </View>
  
       }
       <CustomModal
        title={"Ajouter les details"}
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
        color={color}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
        

          {/* Modal Content */}
          <View style={styles.modalContent}>

            <TextInput
               multiline
               numberOfLines={5}
              style={styles.input}
              placeholder="Entrez plus de détails"
              value={details}
              onChangeText={setDetails}
            />

            
              {
                layout==='pharmacie' && <>
                  
            <Text style={styles.inputLabel}>Prendre une photo de l'ordonnance</Text>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={() => !imageLoading && uploadFile('camera')}>
            <View style={{...styles.secondaryBtn , borderColor: color}}>
               <Text style={{...styles.secondaryBtnText , color }}>
                  {imageLoading ? <ActivityIndicator color={color} size={20}/> : 'Utiliser la caméra'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: 'center' ,     marginTop: 10
             }}>Ou</Text>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={() => !imageLoading && uploadFile('library')}>
              <View style={{...styles.secondaryBtn , borderColor: color}}>
                <Text style={{...styles.secondaryBtnText , color }}>
                  {imageLoading ? <ActivityIndicator color={color} size={20}/> : 'Utiliser votre galerie'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
                </>
              }
            

            <TouchableOpacity
              style={{...styles.submitButton , backgroundColor: color}}
              onPress={() => {
                console.log(details); 
                setModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>Soumettre</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      
    </View>
  );
}

export default CommandeForm;

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
    fontSize: 18,
    fontFamily: 'montserrat-bold',
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 20,
    marginTop: 10
  },
  messageText: {
    fontSize: RFValue(13),
    color: '#333',
    textAlign: 'center',
    fontFamily: 'montserrat-bold',

  },
  destinationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  destination: {
    flexDirection: 'column',
    width: '48%',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  destinationText: {
    fontSize: RFValue(13),
    marginLeft: 10,
    color: '#333',
    fontFamily: 'montserrat-regular',

  },
  about: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ccc',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,

  },
   addDetailsButton: {
     backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  addDetailsButtonText: {
     color: 'white',
     fontSize: RFValue(13),
     fontFamily: 'montserrat-bold',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountLabel: {
    color: '#555',
    fontFamily: 'montserrat-regular',
    fontSize: RFValue(13)


  },
  amountValue: {
    fontSize: RFValue(13),
    color: '#333',
    fontFamily: 'montserrat-bold',

  },
  validationContainer: {
    alignItems: 'center',
  },
  validationButton: {
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  validationButtonText: {
    color: '#fff',
    fontSize: RFValue(13),
    fontFamily: 'montserrat-bold',

  },
  paymentContainer: {
    marginTop: 20,

  },
  sectionTitle: {
    fontSize: RFValue(15),
    fontFamily: 'montserrat-bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  paymentText: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 100,
    fontFamily: 'montserrat-bold',
    width: "50%"
  },
  
  inputContainer: {
    alignItems: 'center'
  },
  input: {
      width: '80%',
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      color: '#333',
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 15,
      textAlign: 'center'
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 15

  },
  submitButtonText: { color: 'white', fontSize: 14 ,     fontFamily: 'montserrat-bold',
  },
   secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'white',
    marginTop: 10
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: 'montserrat-regular',
    color: '#222',
    marginBottom: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    lineHeight: 26,
    fontFamily: 'montserrat-bold',
  },
});
