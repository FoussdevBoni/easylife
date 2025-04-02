import { User } from './../utils/database';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { getDataByDate } from '../functions/getDataByDate';



const usersService = {
  // Récupérer tous les utilisateurs
  async getUsers(time?: 'week' | 'month' | 'year' | 'day'): Promise<User[]> {
    try {
      const usersSnapshot = await getDocs(collection(db, 'clients'));
      const usersList: User[] = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      const acheteurs = usersList.filter(item=>(item.role!=='admin'&&item.role!=='vendeur'))
      return  time ? getDataByDate(acheteurs , time): acheteurs;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }
  },

  // Récupérer un utilisateur par son ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        return null;
      }
      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as User;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw new Error('Erreur lors de la récupération de l\'utilisateur');
    }
  },

  // Mettre à jour un utilisateur
 
  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<string> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      return 'Utilisateur supprimé avec succès';
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw new Error('Erreur lors de la suppression de l\'utilisateur');
    }
  },
};

export default usersService;
