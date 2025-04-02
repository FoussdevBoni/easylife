import { 
  collection, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc 
} from 'firebase/firestore';

import type { Commande } from '../utils/database';
import { db } from '../utils/firebase';
import { getDataByDate } from '../functions/getDataByDate';

export const commandesService = {

  // Récupérer une commande par son ID
  async getCommandeById(commandeId: string): Promise<Commande> {
    try {
      const commandeRef = doc(db, 'commandes', commandeId);
      const commandeDoc = await getDoc(commandeRef);

      if (!commandeDoc.exists()) {
        throw new Error('Commande not found');
      }

      return { id: commandeDoc.id, ...commandeDoc.data() } as Commande;
    } catch (error) {
      console.error('Error fetching commande by ID:', error);
      throw error;
    }
  },

  // Récupérer les commandes filtrées
  async getCommandes(
    time?: 'week' | 'month' | 'year' | 'day',
    layout?: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    prestataireId?: string
  ): Promise<Commande[]> {
    try {
      let commandesQuery = collection(db, "commandes");

      const filters = [];
      if (layout) filters.push(where("layout", "==", layout));
      if (prestataireId) filters.push(where("prestataireId", "==", prestataireId));

      const querySnapshot = await getDocs(filters.length ? query(commandesQuery, ...filters) : commandesQuery);

      const commandes: Commande[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Commande[];

      return time ? getDataByDate(commandes, time) : commandes;
    } catch (error) {
      console.error("Error fetching commandes:", error);
      throw error;
    }
  },

  // Supprimer une commande par son ID
  async deleteCommande(commandeId: string): Promise<void> {
    try {
      const commandeRef = doc(db, 'commandes', commandeId);
      await deleteDoc(commandeRef);
      console.log(`Commande with ID ${commandeId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting commande with ID ${commandeId}:`, error);
      throw error;
    }
  },

  // Mettre à jour une commande
  async updateCommande(commandeId: string, updatedData: Partial<Commande>): Promise<void> {
    try {
      const commandeRef = doc(db, 'commandes', commandeId);
      await updateDoc(commandeRef, updatedData);
      console.log(`Commande with ID ${commandeId} updated successfully.`);
    } catch (error) {
      console.error(`Error updating commande with ID ${commandeId}:`, error);
      throw error;
    }
  },
};
