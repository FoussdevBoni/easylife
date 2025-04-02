import { useEffect, useState } from "react";
import { Commande } from "../utils/database";
import { commandesService } from "../services/commandesService";


const useCommandes  = (
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    criterion?: "week" | "month" | "day" | "year" , prestataireId?: string) => {

    const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [commandes , setCommandes] = useState<Commande[]>([])

     useEffect(()=>{
        const getCommandes = async ()=>{
            setLoading(true)
            try {
              const commandesData =  await commandesService.getCommandes(criterion , layout , prestataireId)
              setCommandes(commandesData)
              setLoading(true)

            } catch (error) {
                setLoading(true)
               setError("Une erreur s'est produite lors de la récupération des produits")
            }
        }

        getCommandes()
     } , [])
    return {
      loading , error , commandes
    };
};

export { useCommandes };