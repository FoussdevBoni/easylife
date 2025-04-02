import { FC, useState } from "react";

import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { Prestataire } from "../../utils/database";
import { uploadFileService } from "../../services/uploadFileService";
import { prestatairesService } from "../../services/prestatairesService";
import { Link } from "react-router-dom";

const SignUpPrestataire: FC = () => {
  const [prestataire, setPrestataire] = useState<Prestataire>({
    nom: "",
    profile: "",
    views: 0,
    likes: 0,
    date: new Date().toISOString(),
    adresse: "",
    location: null,
    layout: "pharmacie",
    disponibilites: '',
    email: '',
    password: '',
    tel: '',
    whatsapp: ''
  });
  
  const [autocomplete, setAutocomplete] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fileLoadingRate, setFileLoadingRate] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const libraries = ['places'];

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
      setFileLoadingRate(0);
      const fileUrl = await uploadFileService.uploadFile(file, "logos", (rate) => {
        setFileLoadingRate(rate);
      });

      setUploadedImageUrl(fileUrl);
      setPrestataire((prev) => ({
        ...prev,
        profile: fileUrl,
      }));
    } catch (error) {
      console.error("Erreur d'upload :", error);
    }
  };

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

  const nextStep = () => {
    switch(step) {
      case 1:
        if (!prestataire.email || !prestataire.password || !prestataire.nom) {
          alert("Veuillez remplir tous les champs obligatoires");
          return;
        }
        break;
      case 2:
        if (!prestataire.tel || !prestataire.adresse) {
          alert("Veuillez remplir tous les champs obligatoires");
          return;
        }
        break;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prestataire.profile) {
      alert("Veuillez télécharger une image de profil");
      return;
    }

    setLoading(true);

    try {
      await prestatairesService.createPrestataire(prestataire);
      alert("Inscription réussie !");
      
      // Réinitialiser le formulaire
      setPrestataire({
        nom: "",
        profile: "",
        views: 0,
        likes: 0,
        date: new Date().toISOString(),
        adresse: "",
        location: null,
        layout: "pharmacie",
        disponibilites: '',
        email: '',
        password: '',
        tel: '',
        whatsapp: ''
      });
      setUploadedImageUrl(null);
      setStep(1);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("Une erreur s'est produite lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block md:w-1/2 bg-indigo-600 p-10 text-white">
            <h2 className="text-3xl font-bold mb-6">Rejoignez notre plateforme</h2>
            <p className="text-indigo-200 mb-8">
              Inscrivez-vous pour rejoindre notre réseau de prestataires et développez votre activité.
            </p>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-700 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="ml-3">Visibilité accrue</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-700 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="ml-3">Gestion simplifiée</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-700 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="ml-3">Nouveaux clients</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-6">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className={`font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>Informations de base</span>
                <span className={`font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>Coordonnées</span>
                <span className={`font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>Profil</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Créez votre compte</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement*</label>
                  <input
                    type="text"
                    name="nom"
                    value={prestataire.nom}
                    onChange={handleInputChange}
                    placeholder="Nom de votre établissement"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={prestataire.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe*</label>
                  <input
                    type="password"
                    name="password"
                    value={prestataire.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 8 caractères"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d'établissement*</label>
                  <select
                    name="layout"
                    value={prestataire.layout}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pharmacie">Pharmacie</option>
                    <option value="supermarket">Supermarché</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hôtel</option>
                    <option value="agenceTransport">Agence de Transport</option>
                  </select>
                </div>
                
                <button
                  onClick={nextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Continuer
                </button>
                
                <p className="text-sm text-center text-gray-500">
                  Vous avez déjà un compte? <Link to="/signin" 
                  className="text-indigo-600 hover:text-indigo-800">Connectez-vous</Link>
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Vos coordonnées</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone*</label>
                  <input
                    type="tel"
                    name="tel"
                    value={prestataire.tel}
                    onChange={handleInputChange}
                    placeholder="+XXX XXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={prestataire.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+XXX XXXXXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse*</label>
                  <LoadScript
                    googleMapsApiKey="AIzaSyBFRuFVMaepEf5S5-sEkF9moPBlKlmzZus"
                    libraries={libraries}
                  >
                    <Autocomplete
                      onLoad={setAutocomplete}
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        type="text"
                        name="adresse"
                        value={prestataire.adresse}
                        onChange={handleInputChange}
                        placeholder="Adresse de votre établissement"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </Autocomplete>
                  </LoadScript>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heures d'ouverture</label>
                  <input
                    type="text"
                    name="disponibilites"
                    value={prestataire.disponibilites}
                    onChange={handleInputChange}
                    placeholder="Ex: Lun-Ven: 8h-17h, Sam: 9h-13h"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {prestataire.layout === "pharmacie" && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="garde"
                      checked={prestataire.garde || false}
                      onChange={() => setPrestataire(prev => ({ ...prev, garde: !prev.garde }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="garde" className="ml-2 block text-sm text-gray-700">
                      Cette pharmacie est une pharmacie de garde
                    </label>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Photo de profil</h2>
                
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  {uploadedImageUrl ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={uploadedImageUrl} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover mb-4" 
                      />
                      <button
                        onClick={() => {
                          setUploadedImageUrl(null);
                          setPrestataire(prev => ({ ...prev, profile: "" }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Supprimer la photo
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger votre logo</p>
                      <input 
                        type="file" 
                        className="hidden" 
                        id="profileUpload" 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                      />
                      <button
                        onClick={() => document.getElementById('profileUpload')?.click()}
                        className="mt-4 bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Choisir une image
                      </button>
                    </>
                  )}
                </div>
                
                {fileLoadingRate > 0 && fileLoadingRate < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all" 
                      style={{ width: `${fileLoadingRate}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {loading ? "Traitement en cours..." : "S'inscrire"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPrestataire;