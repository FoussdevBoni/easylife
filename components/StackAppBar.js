import * as React from 'react';
import PropTypes from 'prop-types';
import { Appbar } from 'react-native-paper';
import { Platform, StatusBar, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const StackAppbar = ({ 
  title, 
  color,
}) => {
  const navigation= useNavigation()
  return (
    <Appbar.Header style={[styles.header , {backgroundColor: color}]  }>
        <StatusBar style="light" backgroundColor={color} />

        {/* Avatar à gauche */}
        <Appbar.Action
          icon={() => (
            <Ionicons
              style={{ marginTop: -4, marginLeft: -7 }}
              size={30}
              name="chevron-back-circle"
              color="white"
            />
          )}
          onPress={() => {
            navigation.goBack()
          }}
        />

        {/* Informations du restaurant */}
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>
            {title}
          </Text>
        </View>

        {/* Icône de notification à droite */}
       
      </Appbar.Header>
  )
};

StackAppbar.propTypes = {
  title: PropTypes.string.isRequired,
 
};

export default StackAppbar;

const styles  = StyleSheet.create({
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  restaurantName: {
    color: 'white',
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
})
