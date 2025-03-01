import * as Location from 'expo-location';
import { Alert } from 'react-native';

const getCurrentAddress = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erreur', 'Permission to access location was denied');
      return ;
    }

    let location = await Location.getCurrentPositionAsync({});
    let address = await Location.reverseGeocodeAsync(location.coords);

    if (address.length > 0) {
      const { city, country ,  subregion } = address[0];
      return {
        ville: city || subregion || '',
        pays: country  || '',
        location: location.coords
      };
    } else {
      return ;
    }
  } catch (error) {
    console.error(error);
    return  ;
  }
}

export default getCurrentAddress;
