import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { FC, useState } from "react";
import { Categorie } from "../utils/database";
import { uploadFileService } from "../services/uploadFileService";
import { categoriesService } from "../services/categorieSeervice";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PropsType {
  pageName: string;
  title: string;
  layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
  routeName: string
}

const UpdateCategorie: FC<PropsType> = ({ pageName, routeName, layout }) => {
    const {user} = useAuth()
    const location = useLocation()
    const currentCategorie = location.state
  const [categorie, setCategorie] = useState<Categorie>({
    ...currentCategorie
  });

  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(currentCategorie.logo);

  // Gestion des inputs texte
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategorie((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    try {
      setFileLoadingRate(0); // Réinitialiser la barre de progression
      const fileUrl = await uploadFileService.uploadFile(file, "logos", (rate) => {
        setFileLoadingRate(rate);
      });

      // Mettre à jour l'URL de l'image dans l'état
      setUploadedImageUrl(fileUrl);
      setCategorie((prev) => ({
        ...prev,
        logo: fileUrl,
      }));
    } catch (error) {
      console.error("Erreur d'upload :", error);
      setError("Échec de l'upload du fichier.");
    }
  };

  // Gestion de la suppression de l'image
  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    setCategorie((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  // Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (categorie.nom?.trim() === "") {
      alert("Le nom du categorie est requis.");
      return;
    }
    if (!categorie.logo?.trim()) {
      alert("Le profil du categorie est requis.");
      return;
    }
 

    setLoading(true);

    try {
      await categoriesService.updateCategorie(categorie?.id || '' , categorie);
      alert("Categorie ajouté avec succès !");

      // Réinitialisation du formulaire
      setCategorie({
        nom: "",
        logo: "",
        layout: layout,
        prestataireId: user?.id || ''
      });
      setUploadedImageUrl(null); // Réinitialiser l'image
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur s'est produite lors de l'ajout du categorie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName={pageName} routeName={routeName} />
  
      <div className="flex justify-center mt-10">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md border border-stroke dark:bg-boxdark">
          <h2 className="text-xl font-semibold text-center mb-6 dark:text-white">Modifier la catégorie</h2>
  
          {/* Nom */}
          <div className="mb-4">
            <label className="block text-black dark:text-white mb-2">Nom</label>
            <input
              type="text"
              name="nom"
              value={categorie.nom}
              onChange={handleInputChange}
              placeholder="Nom du catégorie"
              className="w-full rounded-lg border border-gray-300 py-2 px-4 text-black outline-none focus:border-primary"
            />
          </div>
  
          {/* Upload de l'image de profil */}
          {uploadedImageUrl ? (
            <div className="mb-4 text-center">
              <label className="block text-black dark:text-white mb-2">Logo téléchargé</label>
              <div className="flex flex-col items-center">
                <img src={uploadedImageUrl} alt="Logo" className="w-24 h-24 rounded-full object-cover" />
                <button
                  onClick={handleRemoveImage}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-black dark:text-white mb-2">Logo</label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Télécharger une image
              </button>
            </div>
          )}
  
          {/* Barre de progression */}
          {fileLoadingRate > 0 && fileLoadingRate < 100 && (
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-4">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${fileLoadingRate}%` }}
              >
                {fileLoadingRate}%
              </div>
            </div>
          )}
  
          {/* Bouton de soumission */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            {loading ? "Modification en cours..." : "Modifier la catégorie"}
          </button>
        </div>
      </div>
    </>
  );
  
};

export default UpdateCategorie;