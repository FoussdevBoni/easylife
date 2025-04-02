import React, { useState } from "react";

export interface Product {
  nom: string;
  description: string;
  prix: number;
  views: number;
  prestataireId: string;
  quantite: number;
  images: string[];
  date: string;
  adresse: string;
  livraisonTime: string;
  location: any;
  layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
  ordonnance: boolean;
  categorie: any;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ open, onClose, onSubmit }) => {
  const [product, setProduct] = useState<Product>({
    nom: "",
    description: "",
    prix: 0,
    views: 0,
    prestataireId: "",
    quantite: 1,
    images: [],
    date: "",
    adresse: "",
    livraisonTime: "",
    location: null,
    layout: "pharmacie",
    ordonnance: false,
    categorie: {},
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imagesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      setProduct({ ...product, images: imagesArray });
    }
  };

  const handleSubmit = () => {
    onSubmit(product);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ajouter un Produit</h2>

        {/* Formulaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="nom" placeholder="Nom du produit" value={product.nom} onChange={handleChange} className="input-field" />
          <input type="number" name="prix" placeholder="Prix" value={product.prix} onChange={handleChange} className="input-field" />
          <input type="text" name="prestataireId" placeholder="ID Prestataire" value={product.prestataireId} onChange={handleChange} className="input-field" />
          <input type="number" name="quantite" placeholder="Quantité" value={product.quantite} onChange={handleChange} className="input-field" />
          <input type="text" name="adresse" placeholder="Adresse" value={product.adresse} onChange={handleChange} className="input-field" />
          <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} className="input-field h-24" />

          {/* Upload d'images */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input type="file" multiple onChange={handleImageUpload} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            <div className="grid grid-cols-4 gap-2 mt-2">
              {product.images.map((img, index) => (
                <img key={index} src={img} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-gray-300 shadow-sm" />
              ))}
            </div>
          </div>

          {/* Sélection de catégorie */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Type de produit</label>
            <select name="layout" value={product.layout} onChange={handleChange} className="input-field">
              <option value="pharmacie">Pharmacie</option>
              <option value="supermarket">Supermarché</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hôtel</option>
              <option value="agenceTransport">Agence Transport</option>
            </select>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end mt-6 space-x-3">
          <button onClick={onClose} className="btn-secondary">Annuler</button>
          <button onClick={handleSubmit} className="btn-primary">Valider</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
