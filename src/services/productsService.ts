import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
 
  Query,
 
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import type { Product } from '../utils/database';
import { db } from '../utils/firebase';
import { getDataByDate } from '../functions/getDataByDate';

export const productsService = {
  // Récupérer tous les produits avec tri
 async createProduct(newProduct: Omit<Product, 'id'> , collectionName: 'plats' | 'medicaments' | 'articles'| 'logements'): Promise<string> {

    try {
   
  
      const productsCollection = collection(db, collectionName);
      const docRef = await addDoc(productsCollection, { ...newProduct });
      console.log(`Product created with ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  async getProducts(
    collectionName: 'plats' | 'medicaments' | 'articles' | 'logements',
    time?: 'week' | 'month' | 'year' | 'day',
    prestataireId?: string
  ): Promise<Product[]> {
    try {
      const productsCollection: CollectionReference = collection(db, collectionName);
      let productsQuery: Query = productsCollection;

      // Ajouter un filtre Firestore si un prestataireId est fourni
      if (prestataireId) {
        productsQuery = query(productsCollection, where('prestataireId', '==', prestataireId));
      }

      const snapshot = await getDocs(productsQuery);

      const products: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Appliquer le filtre temporel si nécessaire
      return time ? getDataByDate(products, time) : products;
    } catch (error) {
      console.error(`Error fetching products from ${collectionName}:`, error);
      throw error;
    }
  },

  // Récupérer un produit par son ID
  async getProductById(collectionName: 'plats' | 'medicaments' | 'articles' | 'logements' , productId: string): Promise<Product> {
    try {
      const productRef = doc(db, collectionName, productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        throw new Error('Product not found');
      }

      return { id: productDoc.id, ...productDoc.data() } as Product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  // Récupérer les produits par un attribut donné
  async getProductsByAttribute(
    collectionName: 'plats' | 'medicaments' | 'articles' | 'logements',
    attribute?: string,
    value?: string | number | boolean,
    time?: 'week' | 'month' | 'year' | 'day',
  ): Promise<Product[]> {
    try {
      const productsCollection = collection(db, collectionName);
      const productsQuery = query(
        productsCollection,
        where(attribute || '', '==', value),
      );
      const snapshot = await getDocs(productsQuery);
      console.log("sna" , snapshot.docs)
      const products: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      
      const allProducts = time ? getDataByDate(products , time) : products
      

      return allProducts;

    } catch (error) {
      console.error(`Error fetching products by ${attribute}:`, error);
      throw error;
    }
  },


 



  // Supprimer une product par son ID
   async deleteProduct(collectionName: 'plats' | 'medicaments' | 'articles' |  'logements', productId: string): Promise<void> {
     try {
       const productRef = doc(db, collectionName, productId);
       await deleteDoc(productRef);
     } catch (error) {
       throw error;
     }
   },
 
   // Mettre à jour une product
   async updateProduct(
    collectionName: 'plats' | 'medicaments' | 'articles' | 'logements',
     productId: string ,
     updatedData: Partial<Product>,
   ): Promise<void> {
     try {
       const productRef = doc(db, collectionName, productId);
       await updateDoc(productRef, updatedData);
       console.log(`Product with ID ${productId} updated successfully.`);
     } catch (error) {
       console.error(`Error updating product with ID ${productId}:`, error);
       throw error;
     }
   },


};
