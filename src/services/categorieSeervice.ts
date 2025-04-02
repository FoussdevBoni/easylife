import { getDataByDate } from '../functions/getDataByDate';
import { db } from '../utils/firebase';
import { Categorie } from './../utils/database';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const  categoriesService = {
 
  async createCategorie(categorie: Categorie, id?: string): Promise<void> {
    const ref = id ? doc(db, "categories", id) : doc(collection(db, "categories"));
    await setDoc(ref, categorie);
  },

  async getCategorieById(id: string): Promise<Categorie | null> {
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Categorie) : null;
  },

  async getAllCategories(layout?:'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport'): Promise<Categorie[]> {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as Categorie))
     .filter((item)=>(
      item.layout===layout
     ))
    return  categories;
  },

  async updateCategorie(id: string, updatedData: Partial<Categorie>): Promise<void> {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, updatedData);
  },

  async deleteCategorie(id: string): Promise<void> {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  }
}

