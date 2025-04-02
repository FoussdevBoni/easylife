import { Link, useNavigate } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string ;
  layout?: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
  routeName?: string | 'Dashboard'
}
const Breadcrumb = ({ pageName , layout , routeName}: BreadcrumbProps) => {
  const navigate = useNavigate()
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <button className="font-medium"  onClick={()=>{
              if (routeName) {
                navigate(-1)
              }else {
                navigate(`/${layout}`)
              }
            }}>
              {routeName || 'Dashboard'} /
            </button>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
