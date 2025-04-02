import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { FC, useState } from "react";
import SelectGroup from "../components/Forms/Select/Select";
import { useCategories } from "../hooks/useCategorie";
import Checkbox from "../components/Forms/Checkbox/Checkbox";
import { Categorie, Prestataire, Product } from "../utils/database";
import { uploadFileService } from "../services/uploadFileService";
import { productsService } from "../services/productsService";
import { usePrestataires } from "../hooks/usePrestataires";
import { useNavigate } from "react-router-dom";
import { LoadScript, Autocomplete } from '@react-google-maps/api';

interface PropsType {
  pageName: string;
  collectionName: "plats" | "medicaments" | "articles" | "logements";
  criterion?: "week" | "month" | "day" | "year";
  title: string;
  layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
}

const NewProduct: FC<PropsType> = ({ pageName, collectionName, title, layout }) => {
  const { categories } = useCategories(layout);
  const { prestataires } = usePrestataires(layout);
  const [autocomplete, setAutocomplete] = useState<any | null>(null);

   const navigate = useNavigate()
  // Options pour les sélecteurs
  const categoriesOptions = categories.map((item) => ({
    value: item.id,
    label: item.nom,
  }));

  const prestatairesOptions = prestataires.map((item) => ({
    value: item.id,
    label: item.nom,
  }));

  // État du produit
  const [product, setProduct] = useState<Product>({
    nom: "",
    description: "",
    quantite: 0,
    prix: 0,
    images: [],
    ordonnance: false,
    isPromo: false,
    isVariable: false,
    categorie: null,
    categorieId: "",
    views: 0,
    likes: 0,
    date: new Date().toISOString(),
    prestataireId: "",
    prestataireName: "",
    adresse: "",
    location: "",
    layout: layout,
    livraisonTime: "",
    reduction: 0, 
  });

  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0); // Barre de progression
  const [error, setError] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Images téléchargées

  // Gestion des inputs texte
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setFileLoadingRate(0); // Réinitialiser la barre de progression

    try {
      const fileUrl = await uploadFileService.uploadFile(file, `products/${layout}/${product.nom}`, 
        (rate) => {
        setFileLoadingRate(rate);
      });

      // Mettre à jour les images
      setUploadedImages((prev) => [...prev, fileUrl]);
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, fileUrl],
      }));
    } catch (error) {
      console.error("Erreur d'upload :", error);
      setError("Échec de l'upload du fichier.");
    }
  };

  // Supprimer une image
  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setProduct((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  const libraries = ['places'];

  const handlePlaceSelect = () => {
    const place = autocomplete?.getPlace();
    setProduct({
      ...product,
      adresse: place.formatted_address,
      location: {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      },
    });
  };

  // Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!product.nom.trim()) {
      alert("Le nom du produit est requis.");
      return;
    }
    if (!product.description.trim()) {
      alert("La description est requise.");
      return;
    }

    if (product.prix <= 0) {
      alert("Le prix doit être supérieur à 0.");
      return;
    }
    if (!product.categorieId) {
      alert("Veuillez sélectionner une catégorie.");
      return;
    }
    if (!product.prestataireId) {
      alert("Veuillez sélectionner un prestataire.");
      return;
    }

    setLoading(true);

    try {
     const productId =   await productsService.createProduct(product, collectionName);
       if (!product.isVariable) {
        alert("Produit ajouté avec succès !");
        // Réinitialisation du formulaire
      setProduct({
        nom: "",
        description: "",
        quantite: 0,
        prix: 0,
        images: [],
        ordonnance: false,
        isPromo: false,
        categorie: null,
        categorieId: "",
        views: 0,
        likes: 0,
        date: new Date().toISOString(),
        prestataireId: "",
        prestataireName: "",
        adresse: "",
        location: "",
        layout: layout,
        livraisonTime: "",
        reduction: 0,
      });
      setUploadedImages([]); // Réinitialiser les images
       } else {
          navigate("add-variations" , {state: {
            ...product,
            id: productId
          }})
       }

      
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur s'est produite lors de l'ajout du produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName={pageName} layout={layout} />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Formulaire */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* Sélection du prestataire */}
              <div>
                <SelectGroup
                  label="Choisir le prestataire"
                  placeholder="Choisir un prestataire"
                  options={prestatairesOptions}
                  onChange={(value) => {
                    const prestataire = prestataires.find((cat) => cat.id === value);
                    setProduct((prev) => ({
                      ...prev,
                      prestataireId: prestataire?.id || "",
                      prestataireName: prestataire?.nom || "",
                      adresse: prestataire?.adresse || "",
                      location: prestataire?.location || "",
                    }));
                  }}
                />
              </div>

              {/* Nom */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={product.nom}
                  onChange={handleInputChange}
                  placeholder="Nom du produit"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              {/* Prix */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Prix</label>
                <input
                  type="number"
                  name="prix"
                  value={product.prix}
                  onChange={handleInputChange}
                  placeholder="Prix"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              {/* Quantité */}
               {
                layout==='hotel' && <div>
                <label className="mb-3 block text-black dark:text-white">
                   Adresse du logement
                </label>
               
                 <LoadScript 
                 googleMapsApiKey="AIzaSyBFRuFVMaepEf5S5-sEkF9moPBlKlmzZus " 
                 libraries={libraries}>
              <Autocomplete    
                onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
                <input
                  type="text"
                  name="adresse"
                  value={product.adresse}
                  onChange={handleInputChange}
                  placeholder="Adresse du logement"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </Autocomplete>
            </LoadScript>
              </div>


               }
              {/* Catégorie */}
              <SelectGroup
                label="Choisir une catégorie"
                placeholder="Choisir une catégorie"
                options={categoriesOptions}
                onChange={(value) => {
                  const categorie = categories.find((cat) => cat.id === value);
                  setProduct((prev) => ({
                    ...prev,
                    categorie,
                    categorieId: categorie?.id || "",
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* Formulaire */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* Description */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Description du produit"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                ></textarea>
              </div>

              {/* Promotion */}
              <Checkbox
              id="isPromo"
                labelText="L'offre est en promotion"
                checked={product.isPromo}
                onChange={() => setProduct((prev) => ({ ...prev, isPromo: !prev.isPromo }))}
              />

              {product.isPromo && (
                <div>
                  <label className="mb-3 block text-black dark:text-white">Taux de réduction (%)</label>
                  <input
                    type="number"
                    name="reduction"
                    value={product.reduction}
                    onChange={handleInputChange}
                    placeholder="Taux de réduction"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                  />
                </div>
              )}

              {/* Ordonnance (pour les pharmacies) */}
              {layout === "pharmacie" && (
                <Checkbox
                id="ordonnance"
                  labelText="Le médicament nécessite une ordonnance"
                  checked={product.ordonnance}
                  onChange={() => setProduct((prev) => ({ ...prev, ordonnance: !prev.ordonnance }))}
                />
              )}
              {layout !== "hotel" && (
                <Checkbox
                id="isVariable"
                  labelText="Ce produit a des variations"
                  checked={product.isVariable}
                  onChange={() => setProduct((prev) => ({ ...prev, isVariable: !prev.isVariable }))}
                />
              )}

             


              {/* Upload d'images */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Images du produit</label>
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

                {/* Barre de progression */}
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

                {/* Affichage des images téléchargées */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Produit ${index + 1}`}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              
              {/* Bouton de soumission */}
              {
                layout!=='hotel' ?  <>
                  {
                product.isVariable ?  (
                  <button
                  onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Patientez..." : "Ajouter les variations"}

                
              </button>
                ) : (
                   <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Ajout en cours..." : "Ajouter le produit"}
              </button>
                )
              }
                </>:   <button
                  onClick={()=>{
                    navigate("/hotel/new-logement" , {state: product})
                  }}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Continuer
              </button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewProduct;