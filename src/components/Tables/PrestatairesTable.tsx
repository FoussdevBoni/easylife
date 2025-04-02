import { FC } from "react";
import { usePrestataires } from "../../hooks/usePrestataires";
import Loader from "../../common/Loader";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { prestatairesService } from "../../services/prestatairesService";




interface PrestataireProps{
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
     criterion?: "week" | "month" | "day" | "year" 
     title: string
}
const PrestatairesTable: FC<PrestataireProps> = ({layout , criterion , title}) => {
    const {prestataires , loading , error} = usePrestataires(layout , criterion)

     const navigate = useNavigate()

     const deletePartenaire= async (prestataireId: string)=> {
        try {
         if (confirm("Voulez-vous vraiment le suprimer ?")) {
          await  prestatairesService.deletePrestataire(prestataireId)
         }
        } catch (error) {
          alert("Une erreur s'est produite")
        }
     }


    if (loading) {
        return <Loader />
    }
    if (error) {
       return null 
    }
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Nos partenaires
      </h4>
      <button
          onClick={() => navigate(`/${layout}/new-prestataire`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ajouter un prestataire
      </button>
      <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Le prestataire
          </th>
        
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Note
          </th>
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Visites
          </th>
       
          <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {prestataires.map((merchant) => (
          <tr key={merchant.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Store className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {merchant.nom || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {merchant?.adresse || 'Adresse indisponible'}
                  </div>
                </div>
              </div>
            </td>
          
            <td className="px-6 py-4 whitespace-nowrap">
              {merchant?.note || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {merchant?.views || 0}
            </td>
           
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                   onClick={()=>{
                     navigate(`/${layout}/update-prestataire` , {state: merchant})
                   }}
                    className="px-3 py-1 rounded-md text-sm font-medium text-green-600 hover:bg-green-50"
                  >
                    Modifier
                  </button>
                  <button
                   onClick={()=>{
                     deletePartenaire(merchant.id)
                   }}
                    className="px-3 py-1 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Supprimer
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

export default PrestatairesTable;
