import { FC, useEffect, useState } from 'react';

import { useProducts } from '../../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { productsService } from '../../services/productsService';
import { Edit } from 'lucide-react';


interface ProductsProps{
    collectionName: "plats" | "medicaments" | "articles" | "logements",
     criterion?: "week" | "month" | "day" | "year" 
     title: string,
     layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',

}
const ProductsTable: FC<ProductsProps> = ({collectionName , criterion , title , layout}) => {
   const navigate = useNavigate()
   const {products} = useProducts(collectionName , criterion)
  
   const deleteOffer = async (id: string)=>{
     if (confirm("Voulez-vous vraiment supprimer cette offre ?")) {
      try {
        await productsService.deleteProduct(collectionName , id)
      } catch (error) {
       
      }
     }
   }
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
           {title}
        </h4>
        <button
          onClick={() => navigate(`/${layout}/new-product`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
         Ajouter
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {
                layout!=='hotel' ? 'Offre': 'Logement'
              }
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
             
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vues 
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
           
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((offer) => (
            <tr key={offer.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{offer.nom}</div>
                <div className="text-sm text-gray-500">{offer.categorie?.nom}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{offer.prix}</div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{offer.views || 0}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{offer.note || 0}</div>
              </td>
             
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
              
                  <button
                    onClick={() => deleteOffer(offer?.id || '')}
                    className="px-3 py-1 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>

                  {
                    layout!=='hotel' &&  <button
                    onClick={() => navigate(`/${layout}/add-variations` , {state: offer})}
                    className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Les variations
                  </button>

                  }
                 
                  <button
                    onClick={() => navigate(`/${layout}/update-product` , {state: offer})}
                    className="px-3 py-1 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Modifier
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
