import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import DatePicker from 'react-native-ui-datepicker';
import { colors } from '../../../../utils/colors';
import { RFValue } from 'react-native-responsive-fontsize';

export default function CustomDatePicker({modalVisible, setModalVisible , onDateChange }) {
  const [date, setDate] = useState(dayjs()); 

  return (
    <View style={styles.container}>
    

      {/* Modal */}
      <Modal
        transparent={true} 
        visible={modalVisible}
        animationType="slide" 
        onRequestClose={() => setModalVisible(false)} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sélectionnez une date</Text>

            {/* Composant DatePicker */}
             <DatePicker
              mode='single'
             
              selectedItemColor={colors.tertiary}
             onChange={event => {
                setDate(event.date)
                console.log("date" , event.date)
            }}
                date={date}
             />
               

            {/* Boutons de confirmation et d'annulation */}
            <View style={styles.buttonContainer}>
              <Button color={colors.tertiary} title="Fermer" onPress={() =>
              {
                setModalVisible(false)
              }


              } />
              <Button
                color={colors.tertiary}
                title="Confirmer"
                 
                onPress={() => {
                  setModalVisible(false);
                  onDateChange(date.format('YYYY-MM-DD'))
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'montserrat-bold',
    marginBottom: 20,
    fontSize: RFValue(16),

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
});
