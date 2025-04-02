import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { FC, useState } from "react";
import SelectGroup from "../components/Forms/Select/Select";
import { useCategories } from "../hooks/useCategorie";
import Checkbox from "../components/Forms/Checkbox/Checkbox";
import { Categorie, Prestataire, Product, Variation } from "../utils/database";
import { uploadFileService } from "../services/uploadFileService";
import { usePrestataires } from "../hooks/usePrestataires";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { productsService } from "../services/productsService";

interface PropsType {
  pageName: string;
  collectionName: "plats" | "medicaments" | "articles" | "logements";
  criterion?: "week" | "month" | "day" | "year";
  title: string;
  layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
  routeName: string;
}

const AddVariations: FC<PropsType> = ({ pageName, collectionName, routeName, layout }) => {
  const location = useLocation();
  const currentProduct: Product = location.state;

  const [variation, setVariation] = useState<Variation>({
    type: '',
    value: '',
    prix: 0,
    image: ''
  });

  const [variationsList, setVariationsList] = useState<Variation[]>(currentProduct.variations || []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0);
  const [error, setError] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVariation((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setFileLoadingRate(0);

    try {
      const fileUrl = await uploadFileService.uploadFile(file, "variations", (rate) => {
        setFileLoadingRate(rate);
      });

      setUploadedImages(fileUrl);
      setVariation((prev) => ({
        ...prev,
        image: fileUrl,
      }));
    } catch (error) {
      console.error("Erreur d'upload :", error);
      setError("Échec de l'upload du fichier.");
    }
  };

  const handleRemoveImage = () => {
    setUploadedImages('');
    setVariation((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const addVariations = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!variation.type.trim()) {
      alert("Le type de variation est requis.");
      return;
    }
    if (!variation.value.trim()) {
      alert("La valeur de variation est requise.");
      return;
    }
    if (variation.prix <= 0) {
      alert("Le prix doit être supérieur à 0.");
      return;
    }

    setLoading(true);

    try {
      const updatedVariations = [...variationsList, variation];
      setVariationsList(updatedVariations)
      alert("Variation ajoutée avec succès !");

      setVariation({
        type: "",
        value: "",
        prix: 0,
        image: '',
      });
      setUploadedImages("");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur s'est produite lors de l'ajout de la variation.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async  ()=>{
    setLoading(true)
    try {
      const product = {
        ...currentProduct,
        variations: variationsList
      }

      await productsService.updateProduct(collectionName , currentProduct.id|| '' , product)
      setLoading(false)
      alert("Les variations ont été ajoutées avec succès")
    } catch (error) {
      console.log(error)
      setError("Une erreur s'est produite")
    }
  }

  const handleDeleteVariation = (index: number) => {
    const updatedVariations = variationsList.filter((_, i) => i !== index);
    setVariationsList(updatedVariations);
    // Mettre à jour la base de données si nécessaire
  };

  const handleEditVariation = (index: number) => {
    const variationToEdit = variationsList[index];
    setVariation(variationToEdit);
    handleDeleteVariation(index); // Supprimer la variation de la liste pour la remplacer par la version modifiée
  };

  return (
    <>
      <Breadcrumb pageName={pageName} layout={layout} routeName={routeName} />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        {/* Première colonne : Formulaire */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">Type</label>
                <input
                  type="text"
                  name="type"
                  value={variation.type}
                  onChange={handleInputChange}
                  placeholder="Type de variation"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">Valeur</label>
                <input
                  type="text"
                  name="value"
                  value={variation.value}
                  onChange={handleInputChange}
                  placeholder="Valeur de variation"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">Prix</label>
                <input
                  type="number"
                  name="prix"
                  value={variation.prix}
                  onChange={handleInputChange}
                  placeholder="Prix"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">Image</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileInput"
                />
                <button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded mb-3"
                >
                  Télécharger une image
                </button>

                {fileLoadingRate > 0 && fileLoadingRate < 100 && (
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${fileLoadingRate}%` }}
                    >
                      {fileLoadingRate}%
                    </div>
                  </div>
                )}

                {uploadedImages && (
                  <div className="relative mt-3">
                    <img
                      src={uploadedImages}
                      alt="Variation"
                      className="w-20 h-20 rounded object-cover"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={addVariations}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Ajouter la variation
              </button>
            </div>
          </div>
        </div>

        {/* Deuxième colonne : Liste des variations */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              <h2 className="text-xl font-semibold text-black dark:text-white">Variations ajoutées</h2>
              {variationsList.map((variation, index) => (
                <div key={index} className="flex justify-between items-center border-b border-stroke py-3">
                  <div>
                    <p className="text-black dark:text-white">{variation.type}: {variation.value}</p>
                    <p className="text-sm text-gray-500">Prix: {variation.prix} €</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditVariation(index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDeleteVariation(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}

               <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Ajout en cours..." : "Publier le produit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVariations;