import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Image } from 'react-native';
import LogementsListSection from '../../components/sections/LogementsListSection';
import { colors } from '../../../../utils/colors';
import Bars from '../../components/sections/Bars';
import getCurrentAddress from '../../../../lib/functions/getCurrentAddress';
import { BestLogements } from '../../components/sections/BestLogements';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollHome } from '../../../../components/sections/HomeContainer';

function Home({user}) {

  const navigation = useNavigation();
  const cart = useSelector(state=>(state.cart.cartData)).filter(item=>item.layout==='hotel')
  const favorites = useSelector(state=>(state.favorites.favoritesData)).filter(item=>item.layout==='hotel')

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  // Temporary badge counts
  const cartBadgeCount = cart.length; // Example badge count for the cart
  const favoritesBadgeCount = favorites.length; 

    const [myCoords , setMyCoords] = useState(null)

   const getMyCoords = async ()=>{
      try {

        const data = await getCurrentAddress()
        console.log("currentPOsition" ,  data)
  
        const location = data?.location
        setMyCoords(location)
      } catch (error) {
         console.error(error)
      }
   }
  useEffect(()=>{
    getMyCoords()
  } , [user])

  return (
    <View  style={styles.container}>
      
        <ScrollHome collectionName={"logements"}>
        <Title style={styles.title}>
           Nos meilleurs espaces
          </Title>
          <View style={{marginTop: 1}}>
          <BestLogements />
          </View>
          <Title style={{ ...styles.title , marginTop: 10}}>
            Trouver votre logement idéal
          </Title>
        <View style={styles.barsContainer}>
          
           <Bars user={user}/>
        </View>

        <View style={styles.logementsListContainer}>
          <Title style={styles.title}>
            A proximité
          </Title>
          <LogementsListSection user={user} myCoords={myCoords} location={50} horizontal={true}/>
        </View>
        <View style={{height: 100}}/>

      </ScrollHome>

       <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabButtonActive}>
          <View style={styles.activeIconWrapper}>
            <Image
              source={require("../../../../assets/icons/home.png")}
              style={styles.activeTabIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Cart Icon with Badge */}
        <TouchableOpacity style={styles.tabButton} onPress={() => {
          if (user) {
            handleNavigate("reservations")
          }else{
            handleNavigate("login")
          }
        }}>
          <View>
            <Image
              source={require("../../../../assets/icons/reservation.png")}
              style={styles.tabIcon}
            />
            {cartBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartBadgeCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Service Icon with Badge */}
        <TouchableOpacity style={styles.tabButton} onPress={() => {
          if (user) {
            handleNavigate("chat-box")
          }else{
            handleNavigate("login")
          }
        }}>
          <View>
            <Image
              source={require("../../../../assets/icons/service.png")}
              style={styles.tabIcon}
            />
            
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => handleNavigate("favorites")}>
          <Image
            source={require("../../../../assets/icons/heart-outline.png")}
            style={styles.tabIcon}
          />
            {favoritesBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favoritesBadgeCount}</Text>
              </View>
            )}
        </TouchableOpacity>
      </View>


      
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  title: {fontFamily: 'Montserrat-SemiBold',     fontSize: RFValue(14)},
  barsContainer: {
    backgroundColor: '#ccc',
    borderRadius: 16,
    marginTop: 10
   
  },
  logementsListContainer: {
        padding: 15

  },
    // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIcon: {
    width: 30,
    height: 30,
  },
  tabButtonActive: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.tertiary,
    borderRadius: 50,
    padding: 10,
  },
  activeIconWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: "#FEE2C5",
    borderRadius: 50,
    padding: 5,
  },
  activeTabIcon: {
    width: 35,
    height: 35,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#F9690E",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: 'montserrat-bold',
  },
})