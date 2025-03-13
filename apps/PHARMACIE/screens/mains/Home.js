import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../../reducer/searchSlice";
import { Br } from "../../../../components/Br";
import MedicoListSection from "../../components/sections/MedicoListSection";
import { colors } from "../../../../utils/colors";
import GlobalAppBar from "../../../../components/GlobalAppbar";
import SearchBar from "../../../../components/SearchBar";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import VendeurListSection from "../../../../components/sections/VendeursListSection";
import { ScrollHome } from "../../../../components/sections/HomeContainer";
import { Title } from "react-native-paper";

export default function PharmacieHome({ user  }) {
  const navigation = useNavigation();
  const cart = useSelector(state=>(state.cart.cartData))
  const favorites = useSelector(state=>(state.favorites.favoritesData))

  const coursesCart = cart.filter(item=>(item.layout==='pharmacie'))
  const  articlesFavorites = favorites.filter(item=>(item.layout==='pharmacie'))
  const cartBadgeCount = coursesCart.length; // Example badge count for the cart
  const serviceBadgeCount = 0; 
  const favoritesBadgeCount = articlesFavorites.length
  const [searchQuery, setSearchQuery] = useState("");

  const searchHistory = useSelector((state) => state.search.searchData);
  const dispatch = useDispatch();
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };
  const handleSearch = () => {
    navigation.navigate("medico-search-results", { query: searchQuery });
    dispatch(
      setSearch([...searchHistory, { searchQuery: searchQuery, layout: "pharmacie" }])
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlobalAppBar color={colors.primary} user={user} />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
      <ScrollHome collectionName={'medicaments'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        
      <View style={styles.header}>
            <Text style={styles.headerText}>Aide médicale urgente</Text>
          </View>
      <View style={styles.urgentContainer}>
         
          <TouchableOpacity
            style={styles.urgentButton}
            onPress={() => Linking.openURL("https://www.easylife5.com/pharmacie-sante/urgence-sante")}
          >
            <Text style={styles.urgentButtonText}>Contacter un hôpital</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.urgentButton}
            onPress={() => Linking.openURL("https://www.easylife5.com/pharmacie-sante")}
          >
            <Text style={styles.urgentButtonText}>Parler à un médecin</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.restoContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Médicaments urgents</Text>
            <TouchableOpacity onPress={() => navigation.navigate("medicaments-list")}>
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <MedicoListSection location={2} horizontal={true} user={user} />
        </View>


        <View style={styles.restoContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Pharmacies proches</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('pharmacies-list' , 

              { data: {title: "Pharmacies proches" , filter: 'distance'  }}
            ); }}>
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <VendeurListSection  horizontal={true} color={colors.primary} 
          layout={'pharmacie'}
         
          />       
         </View>
        <View style={styles.restoContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Pharmacies de garde</Text>
            <TouchableOpacity onPress={() => { navigation.navigate('pharmacies-list', 

               { data: {title: "Pharmacies de garde" , filter: 'garde'  }}
            ); }}>
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <VendeurListSection  garde={true} horizontal={true} color={colors.primary} 
          layout={'pharmacie'}
         
          />       
         </View>
        <Br size={80} />
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
                          <TouchableOpacity style={styles.tabButton} 
                          onPress={() => handleNavigate("cart")}>
                            <View>
                              <Image
                                source={require("../../../../assets/icons/cart.png")}
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
                          <TouchableOpacity style={styles.tabButton} onPress={() =>{
                            if (user) {
                              handleNavigate("chat-box")
                            }else {
                              handleNavigate("login")
                            }
                          }}>
                            <View>
                              <Image
                                source={require("../../../../assets/icons/service.png")}
                                style={styles.tabIcon}
                              />
                              {serviceBadgeCount > 0 && (
                                <View style={styles.badge}>
                                  <Text style={styles.badgeText}>{serviceBadgeCount}</Text>
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                  
                          <TouchableOpacity style={styles.tabButton} onPress={() => handleNavigate("medico-favorites")}>
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
    </SafeAreaView>
  );
}

const {width } = Dimensions.get("window")
const styles = StyleSheet.create({
 
  restoContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: RFValue(16),
    fontFamily: 'Montserrat-SemiBold',
  },
  headerAction: {
    fontSize: RFValue(13),
    color: "#007BFF",
    fontFamily: 'Montserrat-SemiBold',
  },
  urgentContainer: {
    marginVertical: -5,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10
  },
  sectionBody: {
    marginBottom: 10
  },
  urgentButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
    width: width*0.6,

  },
  urgentButtonText: {
    color: "#fff",
    fontSize: RFValue(13),
    fontFamily: "montserrat-bold",
  },
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
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 10,
  },
  activeIconWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: "#fff",
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
    fontWeight: "bold",
  },
}
)