import React, {useState} from 'react';

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import StayLayout from '../components/Layout';
import Home from '../screens/mains/Home';
import Logement from '../screens/details/Logement';
import PreReservationForm from '../screens/forms/PreReservationForm';
import Localisation from '../screens/forms/Localisation';
import ImagesGallery from '../screens/details/ImagesGallery';
import Reservations from '../screens/lists/Reservations';
import LogementsFavorites from '../screens/lists/Favorites';
import { colors } from '../../../utils/colors';
import Notifications from '../../../screens/lists/Notifications';
import Profile from '../../../screens/mains/Profile';
import Logements from '../screens/lists/Logements';
import RechargeAccount from '../../../screens/forms/RechargeAccount';
import ReservationForm from '../screens/forms/ReservationForm';
import SuccessScreen from '../../../screens/mains/Success';
import ChatBox from '../../../screens/mains/ChatBox';

const getGestureDirection = (route) => {
  if (route?.params?.previousRoute) {
    return 'horizontal';
  }
  return 'vertical';
};
const Stack = createStackNavigator()

function StayNavigation({user}) {
     

  


    return (
          <Stack.Navigator
        screenOptions={({ route, navigation }) => ({
          gestureDirection: getGestureDirection(route, navigation),
          ...TransitionPresets.SlideFromRightIOS, 
        })} 
      >
        <Stack.Screen name="logement-landing" options={{ headerShown: false }}>
           {(props) => <StayLayout>
              <Home {...props} user={user} />
            </StayLayout>}
         </Stack.Screen>


          <Stack.Screen name="logement-home" options={{ headerShown: false }}>
           {(props) => <StayLayout>
              <Home {...props} user={user} />
            </StayLayout>}
         </Stack.Screen>
         
         <Stack.Screen name="logement-details" options={{ headerShown: false }}>
           {(props) =>  <Logement />}
         </Stack.Screen>

         <Stack.Screen name="pre-reservation-form" options={{ headerShown: false }}>
           {(props) =>  <PreReservationForm user={user}/>}
         </Stack.Screen>
         <Stack.Screen name="reservation-form" options={{ headerShown: false }}>
           {(props) =>  <ReservationForm user={user}/>}
         </Stack.Screen>

         <Stack.Screen name="reservations" options={{ headerShown: false }}>
           {(props) => <Reservations color={colors.tertiary} {...props} user={user} />}
         </Stack.Screen>

           
           
         <Stack.Screen name="logements-list" options={{ headerShown: false }}>
           {(props) => <Logements {...props} user={user} />}
         </Stack.Screen>

       

       
         <Stack.Screen name="favorites" options={{ headerShown: false }}>
           {(props) => <LogementsFavorites {...props} user={user} />}
         </Stack.Screen>


          <Stack.Screen name="localisation" options={{ headerShown: false }}>
           {(props) => <Localisation color={colors.tertiary} {...props} user={user} />}
         </Stack.Screen>

          <Stack.Screen name="logement-images" options={{ headerShown: false }}>
           {(props) => <ImagesGallery color={colors.tertiary} {...props} user={user} />}
         </Stack.Screen>

         <Stack.Screen name="notifications" options={{ headerShown: false }}>
           {(props) =>
               <Notifications color={colors.tertiary} {...props} user={user} />
        }
         </Stack.Screen>

         <Stack.Screen name="profile" options={{ headerShown: false }}>
           {(props) =>
               <Profile color={colors.tertiary} {...props} user={user} />
        }
         </Stack.Screen>

         <Stack.Screen name="chat-box" options={{ headerShown: false }}>
           {(props) =>
               <ChatBox color={colors.tertiary} {...props} user={user} />
        }
         </Stack.Screen>

         <Stack.Screen name="recharge-account" options={{ headerShown: false }}>
           {(props) =>
               <RechargeAccount color={colors.tertiary} {...props} user={user} />
        }
         </Stack.Screen>

         <Stack.Screen name="success" options={{ headerShown: false }}>
           {(props) => <SuccessScreen {...props} user={user} 
             message={"Réservation effectuée ! L'équipe EASY-LIFE s'occupera du reste. Merci."}
           />}
         </Stack.Screen>

       </Stack.Navigator>
    );
};


export default  StayNavigation ;