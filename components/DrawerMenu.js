import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Linking, StyleSheet, Text, Alert, Image, Dimensions } from 'react-native';
import { Appbar, Avatar, Divider, List, Menu as PaperMenu } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/colors';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducer/userSlice';

const Br = ({size})=>{
    return (<View style={{height: size}}>

        </View>)
}
const {width , height} = Dimensions.get('window')



const MenuItem = ({ title, leftIcon, leftIconType, onPress }) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity onPress={onPress}>
      <List.Item
        title={title}
        titleStyle={styles.titleStyle}
        left={() => leftIconType === 'Ionicons' ? <Ionicons name={leftIcon} size={20} style={{ marginTop: 7 }} /> : <MaterialIcons name={leftIcon} size={20} style={{ marginTop: 7 }} />}
        right={() => <Ionicons name='chevron-forward-outline' size={20} style={{ marginTop: 7 }} />}
      />
    </TouchableOpacity>
  );
};




const Menu = ({ user }) => {
  const navigation = useNavigation();
   const dispatch = useDispatch()
  const handleOpenBrowser = async (link) => {
    Linking.openURL(link).catch((err) => {
      Alert.alert("Erreur","Impossible d'ouvrir le lien  ");
    });
  };

  const logout = ()=>{
     dispatch(setUser(null))
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
         <Image source={require('../assets/logo2.png')} style={{width: width*0.5 , height: 40, resizeMode: 'center'}}/>
      </Appbar.Header> 
          
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
       
          
       
     
        <Br size={20} />
        <Divider />
        <Br size={20} />
        
        <MenuItem title='Notre entreprise' leftIcon='people' leftIconType='MaterialIcons' onPress={() => {
            handleOpenBrowser('https://www.easylife5.com')
          navigation.dispatch(DrawerActions.closeDrawer());
        }} />
      
        <MenuItem title='Politiques de confidentialités' leftIcon='lock-closed' leftIconType='Ionicons' onPress={() => {
        
            navigation.dispatch(DrawerActions.closeDrawer());
            handleOpenBrowser("https://www.easylife5.com/politique-de-confidentialite");
        
        }} />
        <MenuItem title='Aide et support' leftIcon='help' leftIconType='MaterialIcons' onPress={() => {
          handleOpenBrowser("https://www.easylife5.com")
          navigation.dispatch(DrawerActions.closeDrawer());
        }} />
        <MenuItem title="Notre communauté" leftIcon='globe' leftIconType='Ionicons' onPress={() => {
          handleOpenBrowser("https://www.easylife5.com/")
          navigation.dispatch(DrawerActions.closeDrawer());

        }} />
        <Br size={20} />
        <Divider />
        <Br size={20} />

          {
            !user ?  <>
            <MenuItem title='Se connecter' leftIcon='draw' leftIconType='MaterialIcons' 
             onPress={()=>{
               navigation.navigate("login")
             }}
           />
           <MenuItem title='Créer un compte' leftIcon='percent' leftIconType='MaterialIcons' 
            onPress={()=>{
             navigation.navigate("register")
           }}
           />
            </>:  <>
         <MenuItem title='Mon compte' leftIcon='person' leftIconType='MaterialIcons' 
          onPress={()=>{
            navigation.navigate("profile")
          }}
        />
        <MenuItem title='Se deconnecter' leftIcon='logout' leftIconType='MaterialIcons' 
         onPress={()=>{
          logout()
        }}
        />
         </>
          }
        <MenuItem title='Contactez-nous' leftIcon='mail' leftIconType='MaterialIcons'
          onPress={()=>{
            if (user) {
              navigation.navigate("chat-box")
              navigation.dispatch(DrawerActions.closeDrawer());

            }else {
              navigation.navigate("login")

            }
          }}
        />

         <Br size={180} />
      </ScrollView>
      
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  scrollViewContent: {
    flexGrow: 1,
  },
 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    color: colors.primary,
    fontSize: 20,
    marginLeft: 5, 
    fontFamily: 'montserrat-bold',
    
  },
  profileButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    backgroundColor: 'white',
  },
  menuButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
  },
  titleStyle: {marginTop: 7 ,     fontFamily: 'montserrat-regular',
  }
});

export default Menu;
