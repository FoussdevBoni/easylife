import { useEffect, useState } from "react";
import { Reservation } from "../utils/database";
import { reservationsService } from "../services/reservationsService";


const useReservations  = (
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    criterion?: "week" | "month" | "day" | "year") => {

    const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
     const [reservations , setReservations] = useState<Reservation[]>([])

     useEffect(()=>{
        const getReservations = async ()=>{
            setLoading(true)
            try {
              const reservationsData =  await reservationsService.getReservations(criterion , layout)
              setReservations(reservationsData)
              setLoading(true)

            } catch (error) {
                setLoading(true)
               setError("Une erreur s'est produite lors de la récupération des produits")
            }
        }

        getReservations()
     } , [])
    return {
      loading , error , reservations
    };
};

export { useReservations };