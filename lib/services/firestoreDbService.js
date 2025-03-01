import { 
  query, 
  where, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  orderBy
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { getDistance } from "../functions/getDistance";
import getCurrentAddress from "../functions/getCurrentAddress";
import axios from "axios";
import { URL } from "../../utils/api";

export const firestoreDbService = {
  // Ajouter un document
  async postData(collectionName, data, successAction, errorAction, mongoDB = false) {
    try {
      if (mongoDB) {
        const response = await axios.post(`${URL}/${collectionName}`, data);
        console.log("Document MongoDB ajouté :", response.data);
        if (successAction) successAction(response.data._id);
      } else {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document Firestore ajouté :", docRef.id);
        if (successAction) successAction(docRef.id);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du document :", error);
      if (errorAction) errorAction(error);
    }
  },

  // Obtenir tous les documents
  async getData(collectionName, successAction, errorAction, mongoDB = false) {
    try {
      const { location: myCoords } = await getCurrentAddress();

      let newData = [];
       
      if (mongoDB) {
      
        const response = await axios.get(`${URL}/${collectionName}`);
        newData = response.data.map((doc) => {

          const distance = getDistance(myCoords?.latitude,
             myCoords?.longitude, 
             doc.location?.latitude, 
             doc.location?.longitude) || "quelques"
          return  ({
            ...doc,
            id: doc._id,
            distance: distance==='quelques' ? 'quelques' : distance.toFixed(0)  })
        });

      } else {
        const querySnapshot = await getDocs(collection(db, collectionName));
        newData = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          const distance = getDistance(myCoords?.latitude, myCoords?.longitude, data.location?.latitude, data.location?.longitude) || "quelques"

          return ({
            ...data,
            id: doc.id,
            distance: distance==='quelques' ? distance : distance.toFixed(0)})
        });
      }

      if (successAction) successAction(newData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      if (errorAction) errorAction(error);
    }
  },

  // Obtenir un document par propriété
  async getDataByProperty(collectionName, property, value, successAction, errorAction, mongoDB = false) {
    try {
      if (mongoDB) {
        const response = await axios.get(`${URL}/${collectionName}?${property}=${value}`);
        if (successAction) successAction(response.data);
      } else {
        const q = query(collection(db, collectionName), where(property, "==", value));
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (successAction) successAction(newData);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des documents filtrés :", error);
      if (errorAction) errorAction(error);
    }
  },

  // Obtenir des documents avec filtres multiples
  async getDataByMultipleProperties(collectionName, filters, successAction, errorAction, mongoDB = false) {
    try {
      if (mongoDB) {
        const queryString = filters.map(({ property, value }) => `${property}=${value}`).join("&");
        const response = await axios.get(`${URL}/${collectionName}?${queryString}`);
        if (successAction) successAction(response.data);
      } else {
        let q = collection(db, collectionName);
        filters.forEach(({ property, operator, value }) => {
          q = query(q, where(property, operator, value));
        });

        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (successAction) successAction(newData);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des documents :", error);
      if (errorAction) errorAction(error);
    }
  },

  async orderedData(collectionName, orderByField, orderDirection = "asc", successAction, errorAction, mongoDB = false) {
    try {
      let newData = [];
      
      if (mongoDB) {
        const response = await axios.get(`${URL}/${collectionName}?_sort=${orderByField}&_order=${orderDirection}`);
        newData = response.data;
      } else {
        const q = query(collection(db, collectionName), orderBy(orderByField, orderDirection));
        const querySnapshot = await getDocs(q);
        newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      }
      
      if (successAction) successAction(newData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données triées :", error);
      if (errorAction) errorAction(error);
    }
  },

  // Obtenir un document par ID
  async getDataById(collectionName, documentId, mongoDB = false) {
    try {
      if (mongoDB) {
        const response = await axios.get(`${URL}/${collectionName}/${documentId}`);
        return response.data;
      } else {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document :", error);
      return null;
    }
  },

  // Mettre à jour un document
  async updateData(collectionName, docId, updatedData, successAction, errorAction, mongoDB = false) {
    try {
      if (mongoDB) {
        await axios.put(`${URL}/${collectionName}/${docId}`, updatedData);
        console.log("Document MongoDB mis à jour !");
      } else {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, updatedData);
        console.log("Document Firestore mis à jour !");
      }

      if (successAction) successAction();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du document :", error);
      if (errorAction) errorAction(error);
    }
  },
};
