import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {  useSelector } from 'react-redux';
import XCategoriesList from '../lists/XCategoriesList';
import YCategoriesList from '../lists/YCategoriesList';
import { FirestoreProvider, useFirestore } from '../../context/FirestoreContext';


const Section = ({ horizontal , color , layout })=>{
  const [filteredCategories, setFilterdCategories] = useState([]);
    const { data } = useFirestore();

  const categories = data; 
  
   const [loading , setLoading] = useState(true)
  const getCategories = (data) => {
    const dataArray = data || []
    const layoutCategories = dataArray.filter(item=>(item?.layout===layout))

    const uniqueCategories = layoutCategories.filter(
      (item, index, self) => index === self.findIndex((t) => t.nom.trim() === item.nom.trim())
    );
    setFilterdCategories(uniqueCategories);
    setLoading(false)
  };


  useEffect(() => {
     getCategories(categories)
  }, []);


  return (
    <View>
      {loading ? (
        // Affiche l'indicateur de chargement pendant que les données sont récupérées
        <ActivityIndicator size="large" color={color} />
      ) : (
        // Affiche la liste des catégories après le chargement
        horizontal ? <XCategoriesList layout={layout} categories={filteredCategories} /> : 
        <YCategoriesList layout={layout} categories={filteredCategories} />
      )}
    </View>
  );
}


function CategoriesListSection({ horizontal , color , layout }) {
  return (
    <FirestoreProvider collectionName={'categories'}>
      <Section  horizontal={horizontal} color={color} layout={layout}/>
    </FirestoreProvider>
  )
  ;
}

export default CategoriesListSection;
