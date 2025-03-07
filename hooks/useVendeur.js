import React, { useEffect, useState } from 'react';
import { firestoreDbService } from '../lib/services/firestoreDbService';


const useVendeur = ({vendeurId , collectionName  }) => {

 const [vendeur , setVendeur] = useState()
 const [ error , setError ] = useState(null)
 const [loading , setLoading] = useState(false)
 useEffect(()=>{
    const getVendeur = async ()=>{
        setLoading(true)
        try {
            setLoading(false)
            const vendeurData = await firestoreDbService.getDataById('prestataires' , vendeurId , false)
            setVendeur(vendeurData)
        } catch (error) {
          setError(error)
          setLoading(false)
        }
    }

    getVendeur()
 } , [vendeurId])
   
 return {vendeur , error , loading}
   
    
};

export { useVendeur };