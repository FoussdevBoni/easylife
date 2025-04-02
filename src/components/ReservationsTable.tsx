import React, { useState } from 'react';
import { Search, Eye, Check, X } from 'lucide-react';
import { Reservation } from '../utils/database';
import { reservationsService } from '../services/reservationsService';

// Interface de Réservation


interface Props{
  reservations: Reservation[];
  setReservations: (reservations: Reservation[])=>void,
}

const ReservationsTable: React.FC<Props> = (
    {
      reservations, 
      setReservations,
      
    }
) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Filtrer les réservations
  const filteredReservations = reservations.filter(reservation => 
    Object.values(reservation).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Valider une réservation
  const handleValidateReservation = async (selectedReservation: Reservation) => {
   
     await reservationsService.updateReservation(selectedReservation.id|| '' , {
        ...selectedReservation,
        statut: 'validée'
     })

    setReservations(reservations.map(reservation => 
      reservation.id === selectedReservation.id 
        ? { ...reservation, statut: 'validée' } 
        : reservation
    ));
  };

  // Refuser une réservation
  const handleRefuseReservation = async (selectedReservation: Reservation) => {
   
    await reservationsService.updateReservation(selectedReservation.id|| '' , {
       ...selectedReservation,
       statut: 'refusée'
    })

   setReservations(reservations.map(reservation => 
     reservation.id === selectedReservation.id 
       ? { ...reservation, statut: 'refusée' } 
       : reservation
   ));
 };


  // Couleur du statut
  const getStatusColor = (status?: string) => {
    switch(status) {
      case undefined: return 'bg-yellow-100 text-yellow-800';
      case 'validée': return 'bg-green-100 text-green-800';
      case 'refusée': return 'bg-red-100 text-red-800';
      case 'annulée': return 'bg-red-100 text-red-800';

      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Réservations</h1>
      
      {/* Barre de recherche */}
      <div className="mb-4 flex items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Rechercher une réservation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Tableau des réservations */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3 hidden md:table-cell">Email</th>
              <th className="px-4 py-3 hidden lg:table-cell">Dates</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr 
                key={reservation.clientId} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{reservation.client}</td>
                <td className="px-4 py-3 hidden md:table-cell">{reservation.email}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {reservation.startDate} - {reservation.endDate}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(reservation.statut)}`}>
                    {reservation.statut === undefined ? 'En attente' : 
                     reservation.statut === 'validée' ? 'Validée' : 
                     reservation.statut === 'refusée'? 'Refusée': 'Annulée'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-full"
                      title="Détails"
                      onClick={() => setSelectedReservation(reservation)}
                    >
                      <Eye size={16} />
                    </button>
                    {reservation.statut === undefined && (
                      <>
                        <button 
                          className="text-green-600 hover:bg-green-100 p-2 rounded-full"
                          title="Valider"
                          onClick={() => handleValidateReservation(reservation)}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                          title="Refuser"
                          onClick={() => handleRefuseReservation(reservation)}
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* État vide */}
        {filteredReservations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune réservation trouvée
          </div>
        )}
      </div>

      {/* Modal de détails - Version Tailwind pure */}
      {selectedReservation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
          onClick={() => setSelectedReservation(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 my-8 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedReservation(null)}
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Détails de la Réservation</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Client</label>
                <span className="col-span-3">{selectedReservation.client}</span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Email</label>
                <span className="col-span-3">{selectedReservation.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Téléphone</label>
                <span className="col-span-3">{selectedReservation.phone}</span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Dates</label>
                <span className="col-span-3">
                  Du {selectedReservation.startDate} au {selectedReservation.endDate}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Logement</label>
                <span className="col-span-3">{selectedReservation.logementId}</span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Pièce d'identité</label>
                <span className="col-span-3">
                  {selectedReservation.identityDocNumber} - {selectedReservation.identityDocNumber}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Photos</label>
                <div className="col-span-3 flex space-x-2">
                  {selectedReservation.identityDocPhotos&&selectedReservation.identityDocPhotos?.map((photo, index) => (
                    <img 
                      key={index} 
                      src={photo} 
                      alt={`Pièce d'identité ${index + 1}`} 
                      className="w-24 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center">
                <label className="font-medium text-right mr-4">Statut</label>
                <span className={`col-span-3 px-2 py-1 rounded text-xs 
                    ${getStatusColor(selectedReservation.statut)}`}>
                  {selectedReservation.statut === undefined ? 'En attente' : 
                   selectedReservation.statut === 'validée' ? 'Validée' : 'Refusée'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Total: {filteredReservations.length} réservations
        </span>
      </div>
    </div>
  );
};

export default ReservationsTable;