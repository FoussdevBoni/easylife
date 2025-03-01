import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import XLogementsList from '../lists/XLogementsList';
import YLogementsList from '../lists/YLogementsList';
import { sortByDistance } from '../../../../lib/functions/sortData';
import { keywordMatching } from '../../../../lib/functions/keyWordsMatching';
import useSyncFirestore from '../../../../hooks/useSyncData';
import { setImages } from '../../../../reducer/imagesSlice';

function LogementsListSection({ nom, description, horizontal, categorieName, adresse, bedrooms, startDate, endDate, myCoords }) {
  const [filteredLogements, setFilteredLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { data: logements } = useSyncFirestore({ collectionName: "logements" });
  const images = useSelector(state => state.images.images);
  const dispatch = useDispatch();

  // Fonction pour filtrer les logements
  const getLogements = (data) => {
    setLoading(true);
    const dataArray = data || [];

    const filteredData = dataArray.filter(product => {
      const matchesName = nom ? keywordMatching(product?.nom, nom) >= 0.2 : true;
      const matchesDescription = description ? keywordMatching(product?.description, description) >= 0.2 : true;
      const categorieMatches = categorieName ? product?.categorie?.nom === categorieName : true;
      const adresseMatches = adresse ? product?.adresse === adresse : true;
      const bedroomsMatches = bedrooms !== undefined && bedrooms !== '' ? product?.bedrooms == bedrooms : true;

      const myStartDate = startDate ? new Date(startDate) : null;
      const myEndDate = endDate ? new Date(endDate) : null;
      const lgmtStartDate = product?.startDate ? new Date(product.startDate) : null;
      const lgmtEndDate = product?.endDate ? new Date(product.endDate) : null;

      const matchesEndDate = myEndDate && lgmtEndDate ? myEndDate <= lgmtEndDate : true;
      const matchesStartDate = myStartDate && lgmtStartDate ? myStartDate >= lgmtStartDate : true;

      return bedroomsMatches && matchesDescription && adresseMatches && matchesName && categorieMatches && matchesEndDate && matchesStartDate;
    });

    const sortedByDistance = sortByDistance(filteredData);
    setFilteredLogements(sortedByDistance);
    setLoading(false);
  };

  useEffect(() => {
    getLogements(logements);

    if (logements.length > 0) {
      const newImagesSet = new Set();
      
      logements.forEach(item => {
        if (item?.images && item?.note > 3) {
          item.images.forEach(img => newImagesSet.add(img));
        }
      });

      const newImagesArray = Array.from(newImagesSet);

      // ⚡ Vérifier si les images ont changé avant de mettre à jour Redux
      if (JSON.stringify(images) !== JSON.stringify(newImagesArray)) {
        dispatch(setImages(newImagesArray));
      }
    }
  }, [logements, nom, description]); // Pas de dépendance sur `images` pour éviter les boucles infinies

  return (
    <View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : filteredLogements.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Aucun logement trouvé.</Text>
        </View>
      ) : horizontal ? (
        <XLogementsList logements={filteredLogements} />
      ) : (
        <YLogementsList logements={filteredLogements} />
      )}
    </View>
  );
}

export default LogementsListSection;
