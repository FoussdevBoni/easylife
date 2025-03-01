import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../utils/colors';

export default function CardAccount({ user }) {
  const navigation = useNavigation();
  const currentBalance = user?.solde || 0;
  const transactions = user?.transactions || [];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView>
        <View style={styles.body}>
          {/* Partie supérieure */}
          <View style={styles.upperContainer}>
            <View style={styles.creditCard}>
              <View style={styles.cardLogo}>
                <Text style={styles.cardLogoText}>EASY PAY</Text>
              </View>
              <Text style={styles.cardNumber}>**** 4321</Text>
              <View style={styles.cardBalanceContainer}>
                <Text style={styles.cardBalanceText}>Solde</Text>
                <Text style={styles.cardBalanceAmount}>{currentBalance} F</Text>
              </View>
            </View>
            {/* Boutons Ajouter et Retirer */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.button}
               onPress={()=>{
                navigation.navigate("recharge-account")
               }}
              >
                <Ionicons name="add-circle" size={24} color="white" />
                <Text style={styles.buttonText}>
                    Recharger mon compte
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
          {/* Transactions récentes */}
          <View style={styles.transactionContainer}>
          
           
          </View>
          {/* QR Code (Placeholder) */}
          <View style={styles.qrContainer}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Qrcode_wikipedia_fr_v2clean.png' }} style={styles.qrImage} />
            <Text style={styles.qrText}>Scanner pour payer</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
    paddingHorizontal: 20,
  },
  body: {
    flex: 1,
  },
  upperContainer: {
    marginBottom: 20,
  },
  creditCard: {
    backgroundColor: '#ADD8E6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    height: 150,
    position: 'relative',
  },
  cardLogo: {
    position: 'absolute',
    top: 10,
    left: '40%',
  },
  cardLogoText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 24,
    color: 'white',
    position: 'absolute',
    bottom: 20,
    left: 10,
  },
  cardBalanceContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
  cardBalanceText: {
    fontSize: 14,
    color: 'white',
  },
  cardBalanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  transactionContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionText: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTransaction: {
    textAlign: 'center',
    color: 'gray',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrText: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
});
