import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

import XVendeursList from '../lists/XVendeursList';
import YVendeursList from '../lists/YVendeursList';
import { colors } from '../../utils/colors';
import { useSelector } from 'react-redux';
import useSyncFirestore from '../../hooks/useSyncData';

function VendeurListSection({  horizontal , layout , color , garde }) {
  const [loading, setLoading] = useState(true); 
  const [filterdsVendeurs, setFilteredVendeurs] = useState([]);
  const { data } = useSyncFirestore({ collectionName: 'prestataires'});

  const vendeurs = data; 
 
  const getVendeurs = (data) => {
    const dataArray = data || []
   
    const filteredData = dataArray.filter((vendeur) => {
      const gardeMatches = garde ? vendeur.garde : true
      const matchesLayout = vendeur.layout === layout;
      return matchesLayout && gardeMatches;
    });
    
    setFilteredVendeurs(filteredData);
    setLoading(false);
  };

  useEffect(() => {
     getVendeurs(vendeurs)
  }, [horizontal]);


  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {filterdsVendeurs.length > 0 ? (
            horizontal ? (
              <XVendeursList layout={layout} color={color} vendeurs={filterdsVendeurs} />
            ) : (  
              <YVendeursList layout={layout}  vendeurs={filterdsVendeurs} />
            )
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{    fontFamily: 'montserrat-regular',
}}>Aucune vendeur trouvé</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default VendeurListSection;
