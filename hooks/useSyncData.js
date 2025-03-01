import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { setData, setLoading, setError } from "../reducer/dataSlice";
import { getDistance } from "../lib/functions/getDistance";
import getCurrentAddress from "../lib/functions/getCurrentAddress";

/**
 * Hook personnalisé pour synchroniser Firestore avec Redux
 * @param {string} collectionName - Nom de la collection Firestore
 * @returns {object} { data, isLoading, error, refresh }
 */
const useSyncFirestore = ({ collectionName }) => {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.data[collectionName] || {});
  const [myCoords, setMyCoords] = useState(null);

  // Récupération des coordonnées une seule fois au montage
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const data = await getCurrentAddress();
        setMyCoords(data.location);
      } catch (err) {
        console.error("Erreur lors de la récupération de la localisation :", err);
      }
    };
    fetchCoords();
    
  }, []);

  // Fonction pour récupérer les données Firestore
  const fetchData = useCallback(async () => {
    dispatch(setLoading({ collectionName, isLoading: true }));
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const newData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const distance = myCoords && data.location
          ? getDistance(myCoords.latitude, myCoords.longitude, data.location.latitude, data.location.longitude)
          : "quelques";

        return ({
          id: doc.id,
          ...data,
          distance: distance === "quelques" ? distance : distance.toFixed(0),
        })
      });
      dispatch(setData({ collectionName, data: newData }));
    } catch (error) {
      console.error(`Erreur Firestore (${collectionName}):`, error);
      dispatch(setError({ collectionName, error: error.message }));
    }
  }, [collectionName, dispatch]);

  // Récupération en temps réel avec Firestore
  useEffect(() => {
    if (!myCoords) return; // Attendre d'avoir les coordonnées

    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => {
          const data = doc.data();
        
          const distance = myCoords && data.location
            ? getDistance(myCoords.latitude, myCoords.longitude, data.location.latitude, data.location.longitude)
            : "quelques";

          return {
            id: doc.id,
             ...data,
            distance: distance === "quelques" ? distance : distance.toFixed(0),
          };
        });

        dispatch(setData({ collectionName, data: newData }));
      },
      (error) => {
        console.error(`Erreur Firestore (${collectionName}) (onSnapshot):`, error);
        dispatch(setError({ collectionName, error: error.message }));
      }
    );

    return () => unsubscribe();
  }, [collectionName, dispatch, myCoords]);

  return { data, isLoading, error, refresh: fetchData };
};

export default useSyncFirestore;
