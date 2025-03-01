import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../utils/colors';
import { firestoreDbService } from '../../../../lib/services/firestoreDbService';

export default function ReservationList({ reservations }) {
  const navigation = useNavigation();
  const [localReservations, setLocalReservations] = useState([]);

  // Trier les réservations par date du plus récent au plus ancien
  useEffect(() => {
    const sortedReservations = [...reservations].sort((a, b) => new Date(b.date) - new Date(a.date));
    setLocalReservations(sortedReservations);
  }, [reservations]);

  // Fonction pour gérer l'annulation de la réservation
  const annuleBooking = (itemId) => {
    // Demander une confirmation avant l'annulation
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir annuler cette réservation ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => {
            // Mettre à jour immédiatement l'état local
            setLocalReservations((prevReservations) =>
              prevReservations.map((reservation) =>
                reservation.id === itemId
                  ? { ...reservation, statut: 'annulée' }
                  : reservation
              )
            );

            // Appeler Firebase pour mettre à jour le statut de la réservation
            firestoreDbService.updateData('reservations', itemId, { statut: 'annulée' },
              () => {
                Alert.alert("Message" ,'Réservation annulée ');
              },
              (err) => {
                Alert.alert("Désolé" ,'Erreur lors de l\'annulation');
              }
            );
          },
        },
      ]
    );
  };

  const renderReservation = ({ item }) => {
    return (
      <Card style={styles.card}>
        {/* Image du logement réservé */}
        <Image source={{ uri: item.image }} style={styles.image} />

        <Card.Content>
          {/* Nom du logement */}
          <Text style={styles.logementName}>{item.nom}</Text>

          {/* Informations sur la réservation */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.infoText}>Prix: XAF {item.prix}</Text>
            <Text style={styles.infoText}>Client: {item.client}</Text>
            <Text style={styles.infoText}>Statut: {item.statut || 'En attente'}</Text>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionContainer}>
            {item.statut !== 'annulée' && (
              <Button
                mode="contained"
                style={styles.annulerButton}
                onPress={() => annuleBooking(item.id)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Réservations</Text>
      <FlatList
        data={localReservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 17,
    fontFamily: 'montserrat-bold',
    color: colors.tertiary,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    height: 200,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  logementName: {
    fontSize: 15,
    fontFamily: 'montserrat-bold',
    color: colors.tertiary,
    marginTop: 15,
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontFamily: 'montserrat-regular',

  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  annulerButton: {
    backgroundColor: 'red',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'montserrat-bold',
  },
});
