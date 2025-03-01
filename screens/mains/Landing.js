import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utils/colors';
const { width, height } = Dimensions.get('window');

const LandingScreen = ({user}) => {
    const  navigation = useNavigation()
    const currentBalance = user?.solde || 0;
    
  return (
    <View style={styles.container}>
      <StatusBar  style='light'/>
      {/* Image de fond */}
      <ImageBackground 
        source={require('../../assets/landing-bg.png')} 
        resizeMode="contain" // Image de fond occupe toute la hauteur
        style={styles.backgroundImage}
      >
        {/* Couche semi-transparente */}
        <View style={styles.overlay} />

        {/* Contenu sur l'image */}
        <View style={styles.contentContainer}>
          {/* Header complètement en haut */}
          <View style={styles.header}>
              <View style={{marginTop: 8}}>
                <Image source={require('../../assets/logo.png')} style={{width: width , height: 40, resizeMode: 'center'}}/>
              </View>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.creditCard} onPress={()=>{
              navigation.navigate("recharge-account")
            }}>
                <View style={styles.cardLogo}>
                 <Text style={styles.cardLogoText}>EASY PAY</Text>
                   </View>
                 <Text style={styles.cardNumber}>**** 4321</Text>
                 <View style={styles.cardBalanceContainer}>
                 <Text style={styles.cardBalanceText}>Solde</Text>
                          <Text style={styles.cardBalanceAmount}>{currentBalance} F CFA</Text>
                        </View>
           </TouchableOpacity>
          </View>

          {/* Partie texte de bienvenue et boutons en bas */}
          <View style={styles.bottomContainer}>
            <View style={styles.welcomeTextContainer}>
               <Text style={styles.welcomeText}>
                 Bienvenue dans notre application ! 
               </Text>
               <View style={{height: 4}}/>
              <Text style={styles.welcomeText}>
               Nous sommes ravis de vous avoir à bord. Découvrez toutes les fonctionnalités pratiques et agréables que Easy Life a à vous offrir. 
               N’hésitez pas à explorer les différents services.
              </Text>
            </View>

            {/* Boutons */}
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={()=>{
                navigation.navigate('main-home')
              }}>              
                <Text style={styles.buttonText}>DécoUvrir</Text>
              </TouchableOpacity>
              {
                !user && <TouchableOpacity style={styles.button} onPress={()=>{
                  navigation.navigate('login')
                }}>
                  <Text style={styles.buttonText}>
                    SE CONNECTER 
                  </Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 192, 74, 0.5)', // Couche semi-transparente
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between', // Espacer les sections
  },
  header: {
    alignItems: 'center',
    marginTop: 50, 
  },
  logoText: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'montserrat-bold',

  },
  tagline: {
    fontSize: 16,
    color: 'black',
    fontWeight: '900',
    textAlign: 'right',
    marginLeft: 150,
    fontFamily: 'montserrat-regular',

  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 50, // Ajuste pour coller les éléments en bas
  },
  cardContainer: {
    padding: 20,
    alignItems: 'center'
  } ,
  welcomeTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    color: 'white',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'montserrat-regular',

  },
  buttonContainer: {
    width: width * 0.5,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 14,

    fontFamily: 'Montserrat-SemiBold',
    textTransform: 'uppercase'
  },
  
  creditCard: {
    backgroundColor: colors.quaternary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    height: 197,
    position: 'relative',
    width: 310
  },
  cardLogo: {
    position: 'absolute',
    top: 10,
    left: '5%',
  },
  cardLogoText: {
    fontSize: 20,
    color: 'White',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'left'
  },
  cardNumber: {
    fontSize: 18,
    color: 'white',
    position: 'absolute',
    bottom: 20,
    left: 10,
    fontFamily: 'montserrat-regular',

  },
  cardBalanceContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
  cardBalanceText: {
    fontSize: 13,
    color: 'white',
    fontFamily: 'montserrat-regular',

  },
  cardBalanceAmount: {
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default LandingScreen;
