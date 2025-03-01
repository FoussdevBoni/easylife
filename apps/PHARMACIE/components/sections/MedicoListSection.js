import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import XmedecoList from '../list/XmedecoList';
import YMedicoList from '../list/YMedicoList';
import { keywordMatching } from '../../../../lib/functions/keyWordsMatching';
import { colors } from '../../../../utils/colors';
import { FirestoreProvider, useFirestore } from '../../../../context/FirestoreContext';

const Section = ({ nom, description, horizontal , categorieName})=>{
 
  const [filteredMedicaments, setFilteredMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
   const {data} = useFirestore()
  const medicaments = data



  const getMedicaments = (data) => {
 
    
     setLoading(false);
     const dataArray = data || []

     const filteredData = dataArray.filter(product => {
       const matchesName = nom ? keywordMatching(product.nom, nom) >= 0.5 : true;
       const matchesDescription = description ? keywordMatching(product.description, description) >= 0.5 : true;
       const categorieMatches  = categorieName ? product.categorie?.nom=== categorieName: true
       
    
       
 
       return (matchesName || matchesDescription )&& categorieMatches;
     });
 
     setFilteredMedicaments(filteredData);
   };
  useEffect(() => {
    getMedicaments(medicaments)
  }, [nom, description , categorieName , horizontal]);

  return (
    <View >
      {loading ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
         </View>
      ) : filteredMedicaments.length === 0 ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text >Aucun médicament trouvé.</Text> 
         </View> 
      ) : horizontal ? (
        <XmedecoList medicaments={filteredMedicaments} />
      ) : (
        <YMedicoList medicaments={filteredMedicaments} />
      )}
    </View>
  );
}

function MedicoListSection({ nom, description, horizontal , categorieName}) {
   return(
    <FirestoreProvider collectionName={'medicaments'}>
       <Section nom={nom} description={description} horizontal={horizontal} categorieName={categorieName}/>
    </FirestoreProvider>
   )
}

export default MedicoListSection;
