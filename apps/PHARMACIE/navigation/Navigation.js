import React, { useRef, useEffect, useState, useContext } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import MedicamentsSearch from '../screens/list/Search';
import MedicamentsFavorites from '../screens/list/Favorites';

import { colors } from '../../../utils/colors';
import Profile from '../../../screens/mains/Profile';
import RechargeAccount from '../../../screens/forms/RechargeAccount';
import HomeScreen from '../../../screens/mains/Home';
import Medicaments from '../screens/list/Medicaments';
import ProductDetails from '../../../screens/details/ProductDetails';
import VendeurDetails from '../../../screens/details/VendeurDetails';
import Vendeurs from '../../../screens/lists/Vendeurs';
import MedicoSearchResults from '../screens/list/SearchResult';
import CommandeForm from '../../../screens/forms/CommandeForm';
import Cart from '../../../screens/mains/Cart';
import ChatBox from '../../../screens/mains/ChatBox';
import SuccessScreen from '../../../screens/mains/Success';
import Notifications from '../../../screens/lists/Notifications';
import PharmacieHome from '../screens/mains/Home';

const Stack = createStackNavigator();

const getGestureDirection = (route) => {
  if (route?.params?.previousRoute) {
    return 'horizontal';
  }
  return 'vertical';
};

const MedicoNavigation = () => {
  const navigation = useNavigation()

const user = useSelector(state=>(state.user.userData))

  


  return (
         <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          gestureDirection: getGestureDirection(route, navigation),
          ...TransitionPresets.SlideFromRightIOS, 
        })} 
      >
    

         
                 
     
        
         <Stack.Screen name="pharma-nav" options={{ headerShown: false }}>
                    {(props) => < PharmacieHome {...props} user={user} />}
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

         <Stack.Screen name="chat-box" options={{ headerShown: false }}>
           {(props) => 
                <ChatBox {...props} color={colors.primary} user={user} />
          }
         </Stack.Screen>

        {/**Les screens  spécifiques pour pharmacies */}

        <Stack.Screen name="pharmacie-home" options={{ headerShown: false }}>
           {(props) => <HomeScreen {...props} user={user} />}
         </Stack.Screen>

           <Stack.Screen name="medicaments-list" options={{ headerShown: false }}>
           {(props) => <Medicaments {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="medicament-details" options={{ headerShown: false }}>
           {(props) => <ProductDetails collectionName={"medicaments"} color={colors.primary} layout={'pharmacie'} {...props} user={user} />}
         </Stack.Screen>
             <Stack.Screen name="medico-search" options={{ headerShown: false }}>
           {(props) => <MedicamentsSearch {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="medico-search-results" options={{ headerShown: false }}>
           {(props) => <MedicoSearchResults {...props} user={user} />}
         </Stack.Screen>
         
         <Stack.Screen name="pharmacies-list" options={{ headerShown: false }}>
           {(props) => <Vendeurs title={"Liste des pharmacies"} color={colors.primary} layout={'pharmacie'} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="pharmacie-details" options={{ headerShown: false }}>
           {(props) => <VendeurDetails collectionName={"medicaments"} color={colors.primary} layout={'pharmacie'} {...props} user={user} />}
         </Stack.Screen>
         
         <Stack.Screen name="medico-commande-form" options={{ headerShown: false }}>
           {(props) => <CommandeForm color={colors.primary} layout={'pharmacie'} {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="cart" options={{ headerShown: false }}>
           {(props) => <Cart  title={"Médicaments"} color={colors.primary}
            productsRoute={'medicaments-list'} checkoutRoute={'medico-commande-form'}
           layout={'pharmacie'} {...props} user={user} />}
         </Stack.Screen>

        <Stack.Screen name="medico-favorites" options={{ headerShown: false }}>
           {(props) => <MedicamentsFavorites {...props} user={user} />}
         </Stack.Screen>
          
         <Stack.Screen name="success" options={{ headerShown: false }}>
           {(props) => <SuccessScreen {...props} user={user} 
             message={"Commande effectuée ! L'équipe EASY-LIFE s'occupera de la livraison. Merci."}
           />}
         </Stack.Screen>
          
         
      </Stack.Navigator>
  );
};

export default MedicoNavigation;
