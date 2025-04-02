import React, { FC } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CategoriesTable from '../components/Tables/CategoriesTable';


interface PropsType {
    pageName: string ,
    title: string,
    layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
    }
const Categories: FC<PropsType> = ({pageName , layout , title}) => {


    return (
        <>
        <Breadcrumb pageName={pageName} layout={layout}/>
  
        <div className="flex flex-col gap-10">
            <CategoriesTable layout={layout} title={title} />
        </div>
      </>
    )
};

export { Categories };