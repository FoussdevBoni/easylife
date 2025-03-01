import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Landing from '../screens/mains/Landing';
import { Layout } from '../components/Layout';
import StayNavigation from '../apps/STAY/navigation/StayNavigation';
import Login from '../screens/forms/Login';
import SignupScreen from '../screens/forms/Register';
import Main from '../screens/mains/Home';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Menu from '../components/DrawerMenu';
import Profile from '../screens/mains/Profile';
import { colors } from '../utils/colors';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import MarketNavigation from '../apps/MARKET/navigation/Navigation';
import MedicoNavigation from '../apps/PHARMACIE/navigation/Navigation';
import RestoNavigation from '../apps/EAT/navigation/Navigation';
import ForgotPasswordScreen from '../screens/forms/ForgotPasswordScreen';
import RechargeAccount from '../screens/forms/RechargeAccount';
import ChatBox from '../screens/mains/ChatBox';




 const Stack = createStackNavigator()
 const Drawer = createDrawerNavigator()
function StackNavigation({user}) {
     



    return (
      <Stack.Navigator
          
      screenOptions={({ route, navigation }) => ({
     
      })} initialRouteName= {'main-landing'}
    >
               
     
      <Stack.Screen name="main-landing" options={{ headerShown: false }}>
         {(props) => 
             <Landing {...props} user={user} />
          }
       </Stack.Screen>
       
      <Stack.Screen name="main-home" options={{ headerShown: false }}>
         {(props) =>
            <Layout>
               <Main {...props} user={user} />
            </Layout>
     }
       </Stack.Screen>
       <Stack.Screen name="login" options={{ headerShown: false }}>
         {(props) =>
             <Login {...props} user={user} />
      }
       </Stack.Screen>

       <Stack.Screen name="register" options={{ headerShown: false }}>
         {(props) =>
             <SignupScreen {...props} user={user} />
      }
       </Stack.Screen>

       <Stack.Screen name="profile" options={{ headerShown: false }}>
         {(props) =>
             <Profile color={colors.primary} {...props} user={user} />
      }
       </Stack.Screen>

       
       <Stack.Screen name="stay-app" options={{ headerShown: false }}>
         {(props) =>
             <StayNavigation {...props} user={user} />
      }
       </Stack.Screen>

       <Stack.Screen name="market-app" options={{ headerShown: false }}>
         {(props) =>
             <MarketNavigation {...props} user={user} />
      }
       </Stack.Screen>

       <Stack.Screen name="medico-app" options={{ headerShown: false }}>
         {(props) =>
             <MedicoNavigation {...props} user={user} />
      }
       </Stack.Screen>

       <Stack.Screen name="resto-app" options={{ headerShown: false }}>
         {(props) =>
             <RestoNavigation {...props} user={user} />
      }
       </Stack.Screen>

       <Stack.Screen name="forgot-password" options={{ headerShown: false }}>
         {(props) =>
             <ForgotPasswordScreen {...props} user={user} />
      }
       </Stack.Screen>
       <Stack.Screen name="chat-box" options={{ headerShown: false }}>
         {(props) =>
             <ChatBox color={colors.primary} {...props} user={user} />
      }
       </Stack.Screen>

       

       
       <Stack.Screen name="recharge-account" options={{ headerShown: false }}>
         {(props) =>
             <RechargeAccount color={colors.primary} {...props} user={user} />
      }
       </Stack.Screen>
      


       


    </Stack.Navigator>
    );
}

const Navigation = ()=>{
  const user = useSelector((state) => state.user.userData);

  return (
    
    <Drawer.Navigator initialRouteName="home"  screenOptions={{
      headerShown: false, // Cache l'entête par défaut
      }}  drawerContent={(props) => <Menu {...props}  user={user}/>}>
         <Drawer.Screen  name="home" component={() => <StackNavigation user={user}/>} />
  </Drawer.Navigator>
  )
}
export default Navigation;


