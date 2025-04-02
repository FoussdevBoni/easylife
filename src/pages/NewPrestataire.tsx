import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { FC, useState } from "react";
import { Prestataire } from "../utils/database";
import { uploadFileService } from "../services/uploadFileService";
import { prestatairesService } from "../services/prestatairesService";
import Checkbox from "../components/Forms/Checkbox/Checkbox";
import { Autocomplete, LoadScript } from "@react-google-maps/api";

interface PropsType {
  pageName: string;
  title: string;
  layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
}

const NewPrestataire: FC<PropsType> = ({ pageName, title, layout }) => {
  const [prestataire, setPrestataire] = useState<Prestataire>({
    nom: "",
    profile: "",
    views: 0,
    likes: 0,
    date: new Date().toISOString(),
    adresse: "",
    location: null,
    layout: layout,
    disponibilites: '',
    
  });
  const [autocomplete, setAutocomplete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Gestion des inputs texte
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrestataire((prev) => ({ ...prev, [name]: value }));
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
      setPrestataire((prev) => ({
        ...prev,
        profile: fileUrl,
      }));
    } catch (error) {
      console.error("Erreur d'upload :", error);
      setError("Échec de l'upload du fichier.");
    }
  };

  // Gestion de la suppression de l'image
  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    setPrestataire((prev) => ({
      ...prev,
      profile: "",
    }));
  };

  

  const libraries = ['places'];

  const handlePlaceSelect = () => {
    const place = autocomplete?.getPlace();
    setPrestataire({
      ...prestataire,
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

    // Vérification des champs obligatoires
    if (prestataire.nom?.trim() === "") {
      alert("Le nom du prestataire est requis.");
      return;
    }
    if (!prestataire.profile?.trim()) {
      alert("Le profil du prestataire est requis.");
      return;
    }
    if (prestataire.adresse?.trim() === "") {
      alert("L'adresse du prestataire est requise.");
      return;
    }

    setLoading(true);

    try {
      await prestatairesService.createPrestataire(prestataire);
      alert("Prestataire ajouté avec succès !");

      // Réinitialisation du formulaire
      setPrestataire({
        nom: "",
        profile: "",
        views: 0,
        likes: 0,
        date: new Date().toISOString(),
        adresse: "",
        location: null,
        layout: layout,
        disponibilites: ''
      });
      setUploadedImageUrl(null); // Réinitialiser l'image
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur s'est produite lors de l'ajout du prestataire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName={pageName} />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Formulaire */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* Nom */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={prestataire.nom}
                  onChange={handleInputChange}
                  placeholder="Nom du prestataire"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              {/* Tel */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Numéro de téléhone"</label>
                <input
                  type="phone"
                  name="tel"
                  value={prestataire.tel}
                  onChange={handleInputChange}
                  placeholder="Numéro de téléhone"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

              {/* Numéro whatsapp */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Numéro whatsapp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={prestataire.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Numéro whatsapp"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

             

              {/* Upload de l'image de profil */}
              {uploadedImageUrl ? (
                <div className="mt-4">
                  <label className="mb-3 block text-black dark:text-white">Image de profil téléchargée</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={uploadedImageUrl}
                      alt="Profil du prestataire"
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
                  <label className="mb-3 block text-black dark:text-white">Image de profil</label>
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

              {/* Barre de progression */}
              {fileLoadingRate > 0 && fileLoadingRate < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${fileLoadingRate}%` }}
                    >
                      {fileLoadingRate}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* Formulaire */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-col gap-5.5 p-6.5">
               {/* Adresse */}
               <div>
                <label className="mb-3 block text-black dark:text-white">Adresse</label>
                <LoadScript
                 googleMapsApiKey="AIzaSyBFRuFVMaepEf5S5-sEkF9moPBlKlmzZus " 
                 libraries={libraries}>
               <Autocomplete    
                onLoad={setAutocomplete} onPlaceChanged={handlePlaceSelect}>
                <input
                  type="text"
                  name="adresse"
                  value={prestataire.adresse}
                  onChange={handleInputChange}
                  placeholder="Adresse du prestataire"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </Autocomplete>
              </LoadScript>
              </div>
              {/* Heure d'ouverture */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Heure d'ouverture et de fermeture</label>
                <input
                  type="text"
                  name="disponibilites"
                  placeholder="Du lundi au vendredi (08h:00 à 17h:00)"
                  value={prestataire.disponibilites}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                />
              </div>

             

              {/* Checkbox pour pharmacie de garde */}
              {layout === "pharmacie" && (
                <Checkbox
                  labelText="Cette pharmacie est une pharmacie de garde"
                  checked={prestataire.garde}
                  onChange={() =>
                    setPrestataire((prev) => ({
                      ...prev,
                      garde: !prev.garde,
                    }))
                  }
                />
              )}

              {/* Bouton de soumission */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Ajout en cours..." : "Ajouter le prestataire"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPrestataire;