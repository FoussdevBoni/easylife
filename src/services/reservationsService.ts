import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';

import type { Reservation } from '../utils/database';
import { db } from '../utils/firebase';
import { getDataByDate } from '../functions/getDataByDate';

export const reservationsService = {


  
 
 
  // Récupérer une reservation par son ID
  async getReservationById(reservationId: string): Promise<Reservation> {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      const reservationDoc = await getDoc(reservationRef);

      if (!reservationDoc.exists()) {
        throw new Error('Reservation not found');
      }

      return { id: reservationDoc.id, ...reservationDoc.data() } as Reservation;
    } catch (error) {
      console.error('Error fetching reservation by ID:', error);
      throw error;
    }
  },

  // Récupérer les reservations par un attribut donné
  async getReservations(
    time?: 'week' | 'month' | 'year' | 'day',
    layout?: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport'
  ): Promise<Reservation[]> {
    try {
     
      const querySnapshot = await getDocs(collection(db, "reservations"));
    
      const reservations: Reservation[] =  querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Reservation))
      

      return time ? getDataByDate(reservations , time) : reservations;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une reservation par son ID
  async deleteReservation(reservationId: string): Promise<void> {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      await deleteDoc(reservationRef);
      console.log(`Reservation with ID ${reservationId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting reservation with ID ${reservationId}:`, error);
      throw error;
    }
  },

  // Mettre à jour une reservation
  async updateReservation(
    reservationId: string,
    updatedData: Partial<Reservation>,
  ): Promise<void> {
    try {
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, updatedData);
      console.log(`Reservation with ID ${reservationId} updated successfully.`);
    } catch (error) {
      console.error(`Error updating reservation with ID ${reservationId}:`, error);
      throw error;
    }
  },
};
