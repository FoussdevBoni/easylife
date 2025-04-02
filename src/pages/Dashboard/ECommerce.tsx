import React from 'react';
import CardDataStats from '../../components/CardDataStats';


import { useStatistics } from '../../hooks/useStatistics';
import { Eye, ShoppingCart, Users } from 'lucide-react';
import CommandesTable from '../../components/Tables/CommandesTable';

interface DashboardProps {
    collectionName: 'plats' | 'medicaments' | 'articles'| 'logements',
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    title: string
}
const ECommerce: React.FC<DashboardProps> = ({collectionName , layout }) => {
 
  const { statistics , loading , error } = useStatistics(collectionName, layout, undefined, "month");
  const {usersNbr ,  prestatairesNbr , commandesNbr , productsNbr} = statistics
  

  return (
    <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            <CardDataStats title="Utilisateurs" total={usersNbr?.total} rate={usersNbr?.rate} levelUp>
                <Users className="text-primary dark:text-white" size={22} />
            </CardDataStats>
            <CardDataStats title="Partenaires" total={prestatairesNbr?.total} rate={prestatairesNbr?.rate} levelUp>
                <Users className="text-primary dark:text-white" size={22} />
            </CardDataStats>
            <CardDataStats title="Commandes" total={commandesNbr?.total} rate={commandesNbr?.rate} levelUp>
                <ShoppingCart className="text-primary dark:text-white" size={22} />
            </CardDataStats>
            
            <CardDataStats title="Produits" total={productsNbr?.total} rate={productsNbr?.rate} levelUp>
              <Eye className="text-primary dark:text-white" size={22} />
            </CardDataStats>
        </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      
        <div className="col-span-12 xl:col-span-12">
          <CommandesTable title='Commandes récentes' layout={layout} criterion='day'/>
        </div>
      </div>
    </>
  );
};

export default ECommerce;
