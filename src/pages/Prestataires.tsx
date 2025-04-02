import { FC } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import PrestatairesTable from '../components/Tables/PrestatairesTable';

interface PropsType {
    pageName: string ,
    title: string,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    }
const Prestataires: FC<PropsType> = ({pageName , layout , title}) => {
  return (
    <>
      <Breadcrumb pageName={pageName} layout={layout}/>

      <div className="flex flex-col gap-10">
         <PrestatairesTable layout={layout} title={title} />
      </div>
    </>
  );
};

export default Prestataires;
