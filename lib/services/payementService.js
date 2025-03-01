import axios from "axios";
import { Alert } from "react-native";



const validateInputs = (montant , phoneNumber ) => {
    if (!montant || !phoneNumber) {
      Alert.alert("Erreur", "Tous les champs doivent être remplis");
      return false;
    }
    
    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      Alert.alert("Erreur", "Le montant doit être un nombre positif");
      return false;
    }
    
    const phoneNumberPattern = /^6\d{8}$/;  
    if (!phoneNumberPattern.test(phoneNumber)) {
      Alert.alert("Erreur", "Numéro de téléphone invalide");
      return false;
    }

    return true;
};

  // Générer une référence de transaction sécurisée
  const generateTransactionRef = (user) => {
    const timestamp = Date.now();
    return `tx_${user.id}_${timestamp}`;
  } ;

export const payementService = {
    


  // Soumission de la transaction
   async handlePayByMomo (montant , phoneNumber , user ,  setLoading , reason , successAction , errorAction)  {

    if (!validateInputs(montant , phoneNumber)) {
      setLoading(false)
      return
    };  

    setLoading(true);
    const transactionRef = generateTransactionRef(user); 

    try {
      const response = await axios.post(
        `https://my-coolpay.com/api/23b12b2c-0274-4556-b1e8-39e21b9830b0/payin`,
        {
          transaction_amount: parseFloat(montant),
          transaction_currency: "XAF",
          transaction_reason: "Recharge de compte",
          app_transaction_ref: transactionRef,
          customer_phone_number: phoneNumber,
          customer_name: user.nom,
          customer_email: user.email,
          customer_lang: "en",
        }
      );

      const { status, transaction_ref } = response.data;

      if (status === "success") {

        Alert.alert(
          "Succès",
          "La transaction a été initiée. Veillez confirmer votre transaction."
        );
        successAction(response.data)

      } else {
        throw new Error("Erreur lors de l'initialisation de la transaction");

        errorAction()
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la soumission. Veuillez réessayer."
      );

      errorAction()
      
      console.error("Erreur API:", error);
    } finally {
    }
  }
}