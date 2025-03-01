import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Home from '../screens/mains/Home';
import ProductDetails from '../../../screens/details/ProductDetails';
import Vendeurs from '../../../screens/lists/Vendeurs';
import Products from '../../../screens/lists/Products';
import ProductsByCategory from '../../../screens/lists/ProductByCategorie';
import SearchResults from '../../../screens/lists/SearchResult';
import CommandeForm from '../../../screens/forms/CommandeForm';
import Search from '../../../screens/lists/Search';
import Favorites from '../../../screens/lists/Favorites';
import VendeurDetails from '../../../screens/details/VendeurDetails';
import { colors } from '../../../utils/colors';
import Promos from '../../../screens/lists/Promos';
import Categories from '../../../screens/lists/Categories';
import SuccessScreen from '../../../screens/mains/Success';
import RechargeAccount from '../../../screens/forms/RechargeAccount';
import Notifications from '../../../screens/lists/Notifications';
import Cart from '../../../screens/mains/Cart';
import ChatBox from '../../../screens/mains/ChatBox';
import Profile from '../../../screens/mains/Profile';



const getGestureDirection = (route) => {
  if (route?.params?.previousRoute) {
    return 'horizontal';
  }
  return 'vertical';
};
 const Stack = createStackNavigator()
function RestoNavigation() {
     
    const user = useSelector((state) => state.user.userData);

    useEffect(()=>{
   
    } , [user])


    return (
            <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          gestureDirection: getGestureDirection(route, navigation),
          ...TransitionPresets.SlideFromRightIOS, 
        })} 
      >

  
      
         <Stack.Screen name="restaurant-tab" options={{ headerShown: false }}>
           {(props) => <Home {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="plat-details" options={{ headerShown: false }}>
           {(props) => <ProductDetails  collectionName={'plats'}  color={colors.secondary} layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>
         
          <Stack.Screen name="restaurant-details" options={{ headerShown: false }}>
           {(props) => <VendeurDetails collectionName={'plats'}  color={colors.secondary} layout={'restaurant'}  {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="restaurants-list" options={{ headerShown: false }}>
           {(props) => <Vendeurs   color={colors.secondary} layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="plats-list" options={{ headerShown: false }}>
           {(props) => <Products collectionName={'plats'} color={colors.secondary} layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="promos-list" options={{ headerShown: false }}>
           {(props) => <Promos collectionName={'plats'} color={colors.secondary} layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="plat-commande-form" options={{ headerShown: false }}>
           {(props) => <CommandeForm color={colors.secondary} layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>

         
          <Stack.Screen name="cart" options={{ headerShown: false }}>
           {(props) => <Cart layout={'restaurant'} title={'Les menus'} {...props} user={user} 
           checkoutRoute={'plat-commande-form'} productsRoute={'plats-list'} color={colors.secondary}/>}
         </Stack.Screen>
          <Stack.Screen name="search" options={{ headerShown: false }}>
           {(props) => <Search  {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="search-results" options={{ headerShown: false }}>
           {(props) => <SearchResults color={colors.secondary} collectionName={'plats'} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="plats-by-category" options={{ headerShown: false }}>
           {(props) => <ProductsByCategory collectionName={'plats'} color={colors.secondary} 
           layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>


          <Stack.Screen name="profile" options={{ headerShown: false }}>
           {(props) => <Profile color={colors.secondary} {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="categories" options={{ headerShown: false }}>
           {(props) => <Categories  color={colors.secondary} layout={'restaurant'} {...props} user={user} />}
         </Stack.Screen>
       
         <Stack.Screen name="favorites" options={{ headerShown: false }}>
           {(props) => <Favorites color={colors.secondary} layout={'restaurant'} 
           {...props} user={user} />}
         </Stack.Screen>
           <Stack.Screen name="notifications" options={{ headerShown: false }}>
           {(props) => <Notifications color={colors.secondary} {...props} user={user} />}
         </Stack.Screen>

            <Stack.Screen name="recharge-account" options={{ headerShown: false }}>
           {(props) => <RechargeAccount color={colors.secondary} {...props} user={user} />}
         </Stack.Screen>
         
        
         <Stack.Screen name="success" options={{ headerShown: false }}>
           {(props) => <SuccessScreen {...props} user={user} 
             message={"Commande effectuée ! L'équipe EASY-LIFE s'occupera de la livraison. Merci."}
           />}
         </Stack.Screen>

         <Stack.Screen name="chat-box" options={{ headerShown: false }}>
           {(props) => <ChatBox color={colors.secondary} {...props} user={user} 
           />}
         </Stack.Screen> 

          </Stack.Navigator>
    );
}

export default RestoNavigation;