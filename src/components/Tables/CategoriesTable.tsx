import { FC } from "react";
import Loader from "../../common/Loader";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categoriesService } from "../../services/categorieSeervice";
import { useCategories } from "../../hooks/useCategorie";

interface CategorieProps {
  layout: 'pharmacie' | 'supermarket' | 'restaurant' | 'hotel' | 'agenceTransport',
  criterion?: "week" | "month" | "day" | "year"
  title: string
}

const CategoriesTable: FC<CategorieProps> = ({ layout, criterion, title }) => {
  const { categories, loading, error } = useCategories(layout);
  const navigate = useNavigate();

  const deleteCategorie = async (categorieId: string) => {
    try {
      if (confirm("Voulez-vous vraiment le supprimer ?")) {
        await categoriesService.deleteCategorie(categorieId);
      }
    } catch (error) {
      alert("Une erreur s'est produite");
    }
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return null;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Nos catégories
        </h4>
        <button
          onClick={() => navigate(`/${layout}/new-categorie`)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ajouter une catégorie
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {/* Icône */}
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              La catégorie
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((categorie) => (
            <tr key={categorie.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Store className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {categorie?.nom}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      navigate(`/${layout}/update-categorie`, { state: categorie });
                    }}
                    className="px-3 py-1 rounded-md text-sm font-medium text-green-600 hover:bg-green-50"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      deleteCategorie(categorie?.id || '');
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

export default CategoriesTable;