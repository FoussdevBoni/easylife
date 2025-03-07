import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import XProductsList from '../lists/XProductLists';
import YProductList from '../lists/YProductsList';
import { keywordMatching } from '../../lib/functions/keyWordsMatching';
import { sortByIndex } from '../../lib/functions/sortData';
import { useSelector } from 'react-redux';
import { FirestoreProvider } from '../../context/FirestoreContext';
import useSyncFirestore from '../../hooks/useSyncData';

function Section({layout , nom, description ,horizontal , categorieName  ,
     color  , collectionName }) {

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading1] = useState(true);
  const { data } = useSyncFirestore({ collectionName});

  const products = data; 



  const getProducts = (data) => {
    setLoading1(false);
    const dataArray = data || []

        const filteredData = dataArray.filter(product => {
          const matchesName = nom ? keywordMatching(product.nom, nom) >= 0.3 : true;
          const matchesDescription = description ? keywordMatching(product.description, description) >= 0.3 : true;
          
          const categorieMatches  = categorieName ? product.categorie?.nom=== categorieName: true
           
          const reductionMatches  = horizontal ? !product.reduction: true

          const layoutMatches = layout ? product?.layout===layout: true
        
          return (matchesName || matchesDescription  )
          &&reductionMatches && layoutMatches && categorieMatches;
        });


    setFilteredProducts(filteredData);
    
  };
  
 useEffect(() => {
      getProducts(products)

   }, [nom, description , categorieName , horizontal , layout]);
  


  return (
    <View>
      {loading ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={color} />
         </View>
      ) : filteredProducts.length === 0 ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text >Aucun product trouvé.</Text> 
         </View> 
      ) : horizontal ? (
        <XProductsList layout={layout} color={color} products={filteredProducts.slice(0, 10)} />
      ) : (
        <YProductList color={color} products={filteredProducts} layout={layout}/>
      )}
    </View>
  );
}


const ProductsListSection = ({layout , nom, description ,horizontal , categorieName  ,
    color , productType , collectionName })=>{

    return(
        <FirestoreProvider collectionName={collectionName}>
            <Section layout={layout} collectionName={collectionName} nom={nom} description={description}
             horizontal={horizontal} categorieName={categorieName} color={color} productType={productType}/>
        </FirestoreProvider>
    )
}

export default ProductsListSection;
