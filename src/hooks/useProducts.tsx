import { useEffect, useState } from "react";
import { Product } from "../utils/database";
import { productsService } from "../services/productsService";


const useProducts  = (collectionName: "plats" | "medicaments" | "articles" | "logements",
 
    criterion?: "week" | "month" | "day" | "year" , prestataireId?: string) => {

    const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [products , setProducts] = useState<Product[]>([])

     useEffect(()=>{
        const getProducts = async ()=>{
            setLoading(true)
            try {
              const productsData =  await productsService.getProducts(collectionName , criterion , prestataireId)
              setProducts(productsData)
              setLoading(true)

            } catch (error) {
                setLoading(true)
               setError("Une erreur s'est produite lors de la récupération des produits")
            }
        }

        getProducts()
     } , [])
    return {
      loading , error , products
    };
};

export { useProducts };