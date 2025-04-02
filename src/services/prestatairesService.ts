import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDataByDate } from '../functions/getDataByDate';
import { auth, db } from '../utils/firebase';
import { Prestataire } from './../utils/database';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const  prestatairesService = {
 
  async createPrestataire(prestataire: Prestataire): Promise<void> {
      const {email , password} = prestataire
      const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password,
            );
            const userId = userCredential.user.uid;
      
            // Create user document
            const userRef = doc(db, 'prestataires', userId);
      
            await setDoc(userRef, {
              ...prestataire,
              id: userId
            });
      
  },

  async getPrestataireById(id: string): Promise<Prestataire | null> {
    const docRef = doc(db, "prestataires", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Prestataire) : null;
  },

  async getAllPrestataires(layout?:'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
     time?: 'week' | 'month' | 'year' | 'day' ): Promise<Prestataire[]> {
    const querySnapshot = await getDocs(collection(db, "prestataires"));
    const prestataires = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Prestataire))
     .filter((item)=>(
      item.layout===layout
     ))
    return  time ? getDataByDate(prestataires , time) : prestataires;
  },

  async updatePrestataire(id: string, updatedData: Partial<Prestataire>): Promise<void> {
    const docRef = doc(db, "prestataires", id);
    await updateDoc(docRef, updatedData);
  },

  async deletePrestataire(id: string): Promise<void> {
    const docRef = doc(db, "prestataires", id);
    await deleteDoc(docRef);
  }
}

