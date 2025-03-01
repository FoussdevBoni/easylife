import {
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Text,
  RefreshControl,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../../../../reducer/searchSlice";
import { colors } from "../../../../utils/colors";
import { Br } from "../../../../components/Br";
import PromosListSection from "../../../../components/sections/PromosListSection";
import GlobalAppBar from "../../../../components/GlobalAppbar";
import SearchBar from "../../../../components/SearchBar";
import Banner from "../../components/sections/Banner";
import CategoriesListSection from "../../../../components/sections/CategoriesListSection";
import VendeurListSection from "../../../../components/sections/VendeursListSection";
import ProductsListSection from "../../../../components/sections/ProductsListSection";
import useSyncFirestore from "../../../../hooks/useSyncData";
import { FirestoreProvider, useFirestore } from "../../../../context/FirestoreContext";
import { ScrollHome } from "../../../../components/sections/HomeContainer";
import { RFValue } from "react-native-responsive-fontsize";

export default function Home({ user }) {
   const navigation = useNavigation();
    const cart = useSelector(state=>(state.cart.cartData))
    const favorites = useSelector(state=>(state.favorites.favoritesData))
 
    const coursesCart = cart.filter(item=>(item.layout==='restaurant'))
    const  articlesFavorites = favorites.filter(item=>(item.layout==='restaurant'))
 
    const handleNavigate = (screen) => {
      navigation.navigate(screen);
    };
    // Temporary badge counts
    const cartBadgeCount = coursesCart.length; // Example badge count for the cart
    const serviceBadgeCount = 0; 
    const favoritesBadgeCount = articlesFavorites.length
    const [searchQuery, setSearchQuery] = useState("");
     const searchHistory = useSelector(state => state.search.searchData); 
     const dispatch = useDispatch();;

   const handleSearch = () => {
         navigation.navigate('search-results' , {query: searchQuery })
        dispatch(setSearch([...searchHistory , {searchQuery: searchQuery , layout: 'restaurant'}])); 
    };
 
   
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GlobalAppBar color={colors.secondary} user={user} />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch}/>


          <ScrollHome
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        collectionName={'plats'}
      >

        <View style={styles.categoriesContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Catégories</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("categories");
              }}
            >
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <CategoriesListSection layout={"restaurant"} color={colors.secondary} horizontal={true} />
        </View>

        <View >
          <Banner />
        </View>

        <View style={styles.platContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Meilleurs offres</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("promos-list", { data: { title: "Plats populaires" } });
              }}
            >
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <PromosListSection collectionName={"plats"} layout={'restaurant'} color={colors.secondary}  user={user} horizontal={true} />
        </View>

        <View style={styles.restoContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Resto populaires</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("restaurants-list");
              }}
            >
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <VendeurListSection color={colors.secondary} layout={'restaurant'} location={100} horizontal={true} user={user} />
        </View>

        <View style={styles.platContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Plats populaires</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("plats-list", { data: { title: "Plats populaires" } });
              }}
            >
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <ProductsListSection collectionName={"plats"}  layout={'restaurant'} color={colors.secondary} user={user} horizontal={true} />
        </View>

        {/*<View style={styles.platContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Offres proches</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("plats-list", { data: { title: "Offres proches" } });
              }}
            >
              <Text style={styles.headerAction}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <ProductsListSection collectionName={"plats"} layout={'restaurant'} color={colors.secondary} orderBy={'note'} user={user} horizontal={true} />
        </View>*/}
        
        <Br size={50} />
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
                          <TouchableOpacity style={styles.tabButton} onPress={() => handleNavigate("cart")}>
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
    </SafeAreaView>

    
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    marginBottom: 20,
  },
  restoContainer: {
    marginBottom: 20,
  },
  platContainer: {
    marginBottom: 20,
    marginTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: RFValue(16),
    fontFamily: 'Montserrat-SemiBold',

  },
  headerAction: {
    fontSize: RFValue(13),
    color: '#007BFF',
    fontFamily: 'Montserrat-SemiBold',

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
    backgroundColor: colors.secondary,
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
});
