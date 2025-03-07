import React, { useEffect, useState } from 'react';
import { Appbar, Avatar, Badge } from 'react-native-paper';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../utils/colors';

const {width} =  Dimensions.get("screen")
const TabAppBar = ({ user }) => {
  const navigation = useNavigation();


  const _handleNotificationIconPress = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  };

  return (
    <Appbar.Header style={styles.header}>
      <StatusBar style="dark" backgroundColor={'#f5f5f5'} />

      {/* Avatar à gauche */}
      <View style={styles.notificationContainer}>
        <Appbar.Action   size={25} icon="menu" onPress={_handleNotificationIconPress} 
        color={colors.primary}/>
       
      </View>

      {/* Localisation avec icône au centre */}
      <View style={styles.locationContainer}>
         <View style={{marginTop: 10}}>
           <Image source={require('../assets/logo2.png')} style={{width: width , height: 40, resizeMode: 'center'}}/>
          </View>
      </View>

     
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",

  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    color: colors.primary,
    fontSize: 20,
    marginLeft: 5, 
    fontFamily: 'montserrat-bold',
    
  },
  notificationContainer: {
    position: 'relative',
    left: -10
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    color: 'white',
  },
});

export default TabAppBar;
