import React, { useEffect, useState } from 'react';
import { Appbar, Avatar, Badge } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location'; // Importer expo-location
import { MaterialIcons } from '@expo/vector-icons'; // Pour l'icône de localisation

const GlobalAppBar = ({ user , color }) => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [city, setCity] = useState(null); // État pour la ville
  const [errorMsg, setErrorMsg] = useState(null);

  const _handleNotificationIconPress = () => {
    navigation.navigate('notifications');
  };

  const _openProfile = () => {
    navigation.navigate('profile');
  };

  // Obtenir la localisation de l'utilisateur et la ville
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        setCity(reverseGeocode[0].city ? reverseGeocode[0].city  :  reverseGeocode[0].subregion ); 
      }
    })();
  }, []);

  let locationText = 'Ma position...';
  if (errorMsg) {
    locationText = errorMsg;
  } else if (city) {
    locationText = city; 
  }


  useEffect(() => {
    if (user) {
     // getnotifications(user, setNotifications);
    }
  
  }, []);

  return (
    <Appbar.Header style={[styles.header , {backgroundColor: color}]}>
      <StatusBar style="light" backgroundColor={color} />

      {/* Avatar à gauche */}
      <Appbar.Action
        icon={() => <Avatar.Image size={30} style={{marginLeft: -4 , backgroundColor: 'white'}} source={{ uri: 'https://cdn-icons-png.freepik.com/512/61/61205.png' }} />}
        onPress={_openProfile}
      />

      {/* Localisation avec icône au centre */}
      <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={24} color="white" /> 
        <Text style={styles.locationText}>{locationText}</Text>
      </View>

      {/* Icône de notification à droite avec badge */}
      <View style={styles.notificationContainer}>
        <Appbar.Action icon="bell" onPress={_handleNotificationIconPress} color="white" />
        {notifications.length > 0 && (
          <Badge style={styles.badge}>{notifications.length}</Badge>
        )}
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
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5, 
    fontFamily: 'montserrat-bold',

  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    color: 'white',
  },
});

export default GlobalAppBar;
