import { useEffect, useState } from "react";
import { Prestataire } from "../utils/database";
import { prestatairesService } from "../services/prestatairesService";


const usePrestataires  = (
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    criterion?: "week" | "month" | "day" | "year") => {

    const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [prestataires , setPrestataires] = useState<Prestataire[]>([])

     useEffect(()=>{
        const getPrestataires = async ()=>{
            setLoading(true)
            try {
              const prestatairesData =  await prestatairesService.getAllPrestataires(layout , criterion)
              setPrestataires(prestatairesData)
              setLoading(false)

            } catch (error) {
               setError("Une erreur s'est produite lors de la récupération des produits")
            }
        }

        getPrestataires()
     } , [])
    return {
      loading , error , prestataires
    };
};

export { usePrestataires };