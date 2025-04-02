import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { FC, useState } from "react";
import { Categorie } from "../utils/database";
import { uploadFileService } from "../services/uploadFileService";
import { categoriesService } from "../services/categorieSeervice";
import { useAuth } from "../hooks/useAuth";

interface PropsType {
  pageName: string;
  title: string;
  layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
}
 const {user} = useAuth()
const NewCategorie: FC<PropsType> = ({ pageName, title, layout }) => {
  const [categorie, setCategorie] = useState<Categorie>({
    nom: "",
    layout: layout,
    logo: "",
    prestataireId: user?.id || ''

  });

  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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
      await categoriesService.createCategorie(categorie);
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
      <Breadcrumb pageName={pageName} />

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          {/* Formulaire */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6.5">
            <div className="flex flex-col gap-5.5">
              {/* Nom */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={categorie.nom}
                  onChange={handleInputChange}
                  placeholder="Nom du categorie"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              {/* Upload de l'image de profil */}
              {uploadedImageUrl ? (
                <div className="mt-4">
                  <label className="mb-3 block text-black dark:text-white">Logo téléchargée</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={uploadedImageUrl}
                      alt="Profil du categorie"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mb-3 block text-black dark:text-white">Le logo</label>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById("fileInput")?.click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Télécharger une image
                  </button>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Ajout en cours..." : "Ajouter le categorie"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCategorie;
