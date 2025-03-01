import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Appbar } from "react-native-paper";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { firestoreDbService } from "../../lib/services/firestoreDbService";
import { setUser } from "../../reducer/userSlice";


const RechargeAccount = ({ color, user }) => {
  const [montant, setMontant] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user?.tel || "");
  const currentBalance = user?.solde || 0;
  const dispatch = useDispatch();
  const [paymentRef, setPaymentRef] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const intervalRef = useRef(null);

  // Validation des entrées
  const validateInputs = () => {
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
  const generateTransactionRef = () => `tx_${user?.id}_${Date.now()}`;

  // Soumission de la transaction
  const handleSubmit = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    const transactionRef = generateTransactionRef();

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

      if (response.data.status === "success") {
        Alert.alert("Succès", "Veuillez confirmer votre transaction.");
        setPaymentRef(response.data.transaction_ref);
      } else {
        throw new Error("Erreur lors de l'initialisation de la transaction");
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Suivi du statut du paiement
  useEffect(() => {
    if (!paymentRef) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `https://my-coolpay.com/api/23b12b2c-0274-4556-b1e8-39e21b9830b0/checkStatus/${paymentRef}`
        );

        if (response.data.transaction_status === "SUCCESS") {
          const newBalance = parseFloat(currentBalance) + parseFloat(montant);
          await firestoreDbService.updateData("clients", user.id, {
            ...user,
            solde: newBalance,
          });
          dispatch(setUser({ ...user, solde: newBalance }));
          Alert.alert("Succès", "Votre compte a été rechargé avec succès.");
          clearInterval(intervalRef.current);
          setPaymentRef("");
        } else if (response.data.transaction_status === "FAILED") {
          Alert.alert("Échec", "La transaction a échoué.");
          clearInterval(intervalRef.current);
          setPaymentRef("");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement:", error);
      }
    };

    intervalRef.current = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(intervalRef.current);
  }, [paymentRef]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={color} />
      <Appbar.Header style={[styles.header, { backgroundColor: color }]}>
        <Appbar.Action
          icon={() => (
            <Ionicons
              style={{ marginTop: -4, marginLeft: -7 }}
              size={30}
              name="chevron-back-circle"
              color="white"
            />
          )}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Recharger mon compte</Text>
        </View>
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Solde actuel</Text>
          <Text style={styles.balanceAmount}>{currentBalance} XAF</Text>
        </View>

        <Text style={styles.label}>Montant</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le montant"
          keyboardType="numeric"
          value={montant}
          onChangeText={setMontant}
        />

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="Entrer le numéro de téléphone"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: color }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={"white"} size={30} />
          ) : (
            <Text style={styles.btnText}>Soumettre</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {flexDirection: "row", alignItems: "center", paddingHorizontal: 10 },
  infoContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  body: { padding: 20, paddingBottom: 80 },
  balanceContainer: { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 20, marginBottom: 20, alignItems: "center" },
  balanceLabel: { fontSize: 18, color: "#777" },
  balanceAmount: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 5 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, fontSize: 16 },
  footer: { padding: 20, backgroundColor: "#fff", borderTopColor: "#eee", borderTopWidth: 1 },
  btn: { alignItems: "center", justifyContent: "center", borderRadius: 30, paddingVertical: 15 },
  btnText: { fontSize: 18, color: "#fff", fontWeight: "600" },
});

export default RechargeAccount;
