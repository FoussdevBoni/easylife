import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../utils/colors';
import ReservationList from '../../components/lists/Reservations';
import { firestoreDbService } from '../../../../lib/services/firestoreDbService';
import StackAppbar from '../../../../components/StackAppBar';

const Reservations = ({ user, color }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const userId = user.id || user?._id;

  useEffect(() => {
    firestoreDbService.getDataByProperty(
      'reservations',
      'clientId',
      userId,
      (data) => {
        setLoading(false);
        const reservationsData = data.filter((item) => item.layout === 'hotel');
        setReservations(data);
      },
      () => {
        setLoading(false);
      }
    );
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={50} color={color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StackAppbar title="Reservations" goBack={navigation.goBack} styles={{ bgColor: colors.tertiary, textColor: 'white' }} />
      {reservations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.imageIconContainer}>
            <Image style={styles.imageIcon} source={require('../../../../assets/icons/reservation.png')} />
          </View>
          <Text style={styles.emptyText}>Retrouvez toutes vos réservations ici</Text>
        </View>
      ) : (
         <ReservationList reservations={reservations} />
      )}
    </View>
  );
};

// NotificationItem inclus dans le même fichier


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIconContainer:{
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.tertiary
  },
  imageIcon:{
    width: 100,
    height: 100,
    resizeMode: 'cover'
  },
  emptyText: {
    marginTop: 20,
    fontSize: 20,
    color: 'gray',
  },
  listContent: {
    padding: 10,
  },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#ccc',
        borderRadius: 10,
        shadowColor: '#fff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        height: 100,
        alignItems: 'center',
        position: 'relative',
    },
    imageContainer: {
        width: '30%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    detailsContainer: {
        width: '70%',
        padding: 10,
        justifyContent: 'center',
    },
    nameContainer: {
        marginBottom: 5,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    prixAndQntiteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    prixContainer: {},
    prixText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 15,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    quantityButton: {
        paddingVertical: 1,
        paddingHorizontal: 8,
        borderRadius: 20,
    },
    quantityText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    quantity: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: '#FFF',
    },
});

export default Reservations;
