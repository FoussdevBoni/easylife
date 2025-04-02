import React, { useEffect, useState } from 'react'
import { Reservation } from '../utils/database';
import ReservationsTable from '../components/ReservationsTable';
import { useReservations } from '../hooks/useReservations';



export default function Reservations() {
     const {reservations} = useReservations('hotel')
     const [updatedReservations , setUpdatedReservations] = useState<Reservation[]>(reservations)
    
    
  useEffect(()=>{
    setUpdatedReservations(reservations)
  } , [reservations])
    
  
  return (
    <div>
        <ReservationsTable 
         reservations={updatedReservations}
         setReservations={setUpdatedReservations}
        />
    </div>
  )
}
