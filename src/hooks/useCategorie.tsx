import { useEffect, useState } from "react";
import { Categorie } from "../utils/database";
import { categoriesService } from "../services/categorieSeervice";


const useCategories  = (
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport') => {

    const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [categories , setCategories] = useState<Categorie[]>([])

     useEffect(()=>{
        const getCategories = async ()=>{
            setLoading(true)
            try {
              const categoriesData =  await categoriesService.getAllCategories(layout)
              setCategories(categoriesData)
              setLoading(false)

            } catch (error) {
               setError("Une erreur s'est produite lors de la récupération des produits")
            }
        }

        getCategories()
     } , [])
    return {
      loading , error , categories
    };
};

export { useCategories };