import { FC } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import CommandesTable from '../components/Tables/CommandesTable';

interface PropsType {
    pageName: string ,
    title: string,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
     collectionName: "plats" | "medicaments" | "articles" | "logements"
  }
const Commandes: FC<PropsType> = ({pageName , layout , title} , collectionName) => {
  return (
    <>
      <Breadcrumb pageName={pageName} layout={layout} />

      <div className="flex flex-col gap-10">
         <CommandesTable  layout={layout} title={title}  collectionName={collectionName}  criterion={undefined} />
      </div>
    </>
  );
};

export default Commandes;
