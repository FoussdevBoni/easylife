import React, { useRef, useEffect, useState, useContext } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Profile from '../../../screens/mains/Profile';
import RechargeAccount from '../../../screens/forms/RechargeAccount';
import { colors } from '../../../utils/colors';
import Notifications from '../../../screens/lists/Notifications';
import Products from '../../../screens/lists/Products';
import Promos from '../../../screens/lists/Promos';
import ProductDetails from '../../../screens/details/ProductDetails';
import Categories from '../../../screens/lists/Categories';
import Search from '../../../screens/lists/Search';
import SearchResults from '../../../screens/lists/SearchResult';
import Vendeurs from '../../../screens/lists/Vendeurs';
import VendeurDetails from '../../../screens/details/VendeurDetails';
import Cart from '../../../screens/mains/Cart';
import Favorites from '../../../screens/lists/Favorites';
import CommandeForm from '../../../screens/forms/CommandeForm';
import ProductsByCategory from '../../../screens/lists/ProductByCategorie';
import SuccessScreen from '../../../screens/mains/Success';
import SupermarketHome from '../screens/mains/Home';



const Stack = createStackNavigator();

const getGestureDirection = (route) => {
  if (route?.params?.previousRoute) {
    return 'horizontal';
  }
  return 'vertical';
};

const MarketNavigation = () => {
  const navigation = useNavigation()

const user = useSelector(state=>(state.user.userData))

 

  return (
        <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          gestureDirection: getGestureDirection(route, navigation),
          ...TransitionPresets.SlideFromRightIOS, 
        })} 
      >
        {/**Les screens  accessible par tout le monde  */}


          <Stack.Screen name="supermarket-nav" options={{ headerShown: false }}>
           {(props) => <SupermarketHome {...props} user={user} />}
         </Stack.Screen>
        
         

         <Stack.Screen name="profile" options={{ headerShown: false }}>
           {(props) =>
                <Profile color={colors.primary} {...props} user={user} />
      }
         </Stack.Screen>
        
        
            <Stack.Screen name="recharge-account" options={{ headerShown: false }}>
           {(props) => 
                <RechargeAccount color={colors.primary} {...props} user={user} />
          }
         </Stack.Screen>
         <Stack.Screen name="notifications" options={{ headerShown: false }}>
           {(props) => 
                <Notifications {...props} color={colors.primary} user={user} />
          }
         </Stack.Screen>


     
          {/***Les screens spécifiques pour supermarkets */}

          <Stack.Screen name="supermarket-home" options={{ headerShown: false }}>
           {(props) => <SupermarketHome {...props} user={user} />}
         </Stack.Screen>

           <Stack.Screen name="articles-list" options={{ headerShown: false }}>
           {(props) => <Products collectionName={'articles'} color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>
         <Stack.Screen name="promos-list" options={{ headerShown: false }}>
           {(props) => <Promos collectionName={"articles"} color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="article-details" options={{ headerShown: false }}>
           {(props) => <ProductDetails collectionName={'articles'} color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>
         <Stack.Screen name="categories" options={{ headerShown: false }}>
           {(props) => <Categories color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>
       

          <Stack.Screen name="supermarket-search" options={{ headerShown: false }}>
           {(props) => <Search {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="supermarket-search-results" options={{ headerShown: false }}>
           {(props) => <SearchResults
            collectionName={'articles'}
            color={colors.primary} layout={'supermarket'} {...props} 
           user={user} />}
         </Stack.Screen>

           <Stack.Screen name="supermarkets-list" options={{ headerShown: false }}>
           {(props) => <Vendeurs color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>


           <Stack.Screen name="supermarket-details" options={{ headerShown: false }}>
           {(props) => <VendeurDetails collectionName={"articles"} color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>

       
         <Stack.Screen name="cart"options={{ headerShown: false }}>
           {(props) => <Cart layout={'supermarket'} title={'Les articles'} {...props} user={user} 
           checkoutRoute={'article-commande-form'} productsRoute={'articles-list'} color={colors.primary}/>}
         </Stack.Screen>

          <Stack.Screen name="favorites" options={{ headerShown: false }}>
           {(props) => <Favorites color={colors.primary} layout={'supermarket'} {...props} 
           user={user} />}
         </Stack.Screen>

          <Stack.Screen name="article-commande-form" options={{ headerShown: false }}>
           {(props) => <CommandeForm color={colors.primary} layout={'supermarket'} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="articles-by-category" options={{ headerShown: false }}>
           {(props) => <ProductsByCategory color={colors.primary} layout={'supermarket'} {...props} 
           user={user} collectionName={"articles"} />}
         </Stack.Screen>
         <Stack.Screen name="success" options={{ headerShown: false }}>
           {(props) => <SuccessScreen {...props} user={user} 
           message={"Commande effectuée ! L'équipe EASY-LIFE s'occupera de la livraison. Merci."}
           />}
         </Stack.Screen>
      </Stack.Navigator>
  );
};

export default MarketNavigation;
