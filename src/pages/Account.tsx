import { useEffect, useState, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAuth } from '../hooks/useAuth';
import userThree from '../images/user/user-03.png';
import { Prestataire } from '../utils/database';
import { prestatairesService } from '../services/prestatairesService';
import { uploadFileService } from '../services/uploadFileService';
import { Globe, House, LocateIcon, Mail, Map, User } from 'lucide-react';
import { BsWhatsapp } from 'react-icons/bs';

interface PrestataireFormData {
  id: string;
  nom: string;
  profile: string;
  email: string;
  tel: string;
  adresse: string;
  ville?: string;
  pays?: string;
  whatsapp?: string;
  disponibilites?: string;
  [key: string]: any; // For other dynamic fields
}

const Account = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(user?.profile || '');
  const [prestataire, setPrestataire] = useState<PrestataireFormData>({
    id: '',
    nom: '',
    profile: '',
    email: '',
    tel: '',
    adresse: '',
    ville: '',
    pays: '',
    whatsapp: '',
    disponibilites: ''
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setPrestataire({
        id: user.id || '',
        nom: user.nom || '',
        profile: user.profile || '',
        email: user.email || '',
        tel: user.tel || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        pays: user.pays || '',
        whatsapp: user.whatsapp || '',
        disponibilites: user.disponibilites || ''
      });
      setUploadedImageUrl(user.profile || null);
    }
  }, [user]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrestataire(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setError("");
    setSuccess("");

    // Validate file type and size
    if (!file.type.match('image.*')) {
      setError("Veuillez sélectionner une image valide (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    try {
      setFileLoadingRate(0);
      const fileUrl = await uploadFileService.uploadFile(file, "logos", (rate) => {
        setFileLoadingRate(rate);
      });

      setUploadedImageUrl(fileUrl);
      setPrestataire(prev => ({
        ...prev,
        profile: fileUrl,
      }));
      setSuccess("Image téléchargée avec succès!");
    } catch (error) {
      console.error("Erreur d'upload :", error);
      setError("Échec de l'upload du fichier. Veuillez réessayer.");
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setUploadedImageUrl(null);
    setPrestataire(prev => ({
      ...prev,
      profile: "",
    }));
    setSuccess("Image supprimée avec succès!");
  };

  // Trigger file input click
  const handleModifyImage = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!prestataire.nom?.trim()) {
      setError("Le nom de l'établissement est requis.");
      return;
    }
    if (!prestataire.adresse?.trim()) {
      setError("L'adresse est requise.");
      return;
    }

    setLoading(true);

    try {
      await prestatairesService.updatePrestataire(prestataire.id, prestataire);
      setSuccess("Informations mises à jour avec succès!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setError("Une erreur s'est produite lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Mon compte" />

        {/* Success and Error Messages */}
        {error && (
          <div className="mb-4 rounded-sm border border-danger bg-danger/10 py-3 px-4 text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-sm border border-success bg-success/10 py-3 px-4 text-success">
            {success}
          </div>
        )}

        <div className="grid grid-cols-5 gap-8">
          {/* Personal Information Form */}
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Informations personnelles
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="nom"
                      >
                        Nom de l'établissement *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                           <User />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="nom"
                          onChange={handleInputChange}
                          id="nom"
                          placeholder="Nom de l'établissement"
                          value={prestataire.nom}
                          required
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="tel"
                      >
                        Numéro de téléphone
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="tel"
                        name="tel"
                        onChange={handleInputChange}
                        id="tel"
                        placeholder="+225 XX XX XX XX"
                        value={prestataire.tel}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Adresse mail
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <Mail />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        onChange={handleInputChange}
                        id="email"
                        placeholder="votre@email.com"
                        value={prestataire.email}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="adresse"
                    >
                      Adresse *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                         <LocateIcon />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="adresse"
                        id="adresse"
                        onChange={handleInputChange}
                        placeholder="Adresse complète"
                        value={prestataire.adresse}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="ville"
                      >
                        Ville
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                         <House />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="ville"
                          id="ville"
                          onChange={handleInputChange}
                          placeholder="Ville"
                          value={prestataire.ville}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="pays"
                      >
                        Pays
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <Globe />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="pays"
                          id="pays"
                          placeholder="Pays"
                          onChange={handleInputChange}
                          value={prestataire.pays}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="whatsapp"
                    >
                      Numéro WhatsApp
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <BsWhatsapp />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="tel"
                        name="whatsapp"
                        id="whatsapp"
                        onChange={handleInputChange}
                        placeholder="Numéro WhatsApp"
                        value={prestataire.whatsapp}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="disponibilites"
                    >
                      Disponibilités
                    </label>
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      name="disponibilites"
                      id="disponibilites"
                      rows={3}
                      onChange={handleInputChange}
                      placeholder="Heures d'ouverture et jours de travail"
                      value={prestataire.disponibilites}
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                    >
                      Annuler
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Votre photo de profile
                </h3>
              </div>
              <div className="p-7">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full overflow-hidden">
                      <img 
                        src={uploadedImageUrl || userThree} 
                        alt="User" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Modifier votre photo
                      </span>
                      <span className="flex gap-2.5">
                        <button 
                          className="text-sm hover:text-primary"
                          type="button"
                          onClick={handleRemoveImage}
                        >
                          Supprimer
                        </button>
                        <button 
                          className="text-sm hover:text-primary"
                          type="button"
                          onClick={handleModifyImage}
                        >
                          Modifier
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-primary">Cliquez pour uploader</span> ou
                        glissez-déposez
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG ou GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {fileLoadingRate > 0 && fileLoadingRate < 100 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Téléchargement en cours...</span>
                        <span>{fileLoadingRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${fileLoadingRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;