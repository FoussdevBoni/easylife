import { FC } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import ProductsTable from '../components/Tables/ProductsTable';

interface PropsType {
    pageName: string ,
    collectionName: "plats" | "medicaments" | "articles" | "logements", criterion?: "week" | "month" | "day" | "year"
    title: string,
    layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";

    }
const Products: FC<PropsType> = ({pageName , collectionName , title , layout}) => {
  return (
    <>
      <Breadcrumb pageName={pageName} layout={layout}/>

      <div className="flex flex-col gap-10">
         <ProductsTable layout={layout} collectionName={collectionName} title={title} />
      </div>
    </>
  );
};

export default Products;
