import { FC, useState } from "react";
import { Logement, Product } from "../utils/database";
import { productsService } from "../services/productsService";
import Checkbox from "../components/Forms/Checkbox/Checkbox";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";


interface PropsType {
    pageName: string;
    collectionName: "plats" | "medicaments" | "articles" | "logements";
    layout: "pharmacie" | "supermarket" | "restaurant" | "hotel" | "agenceTransport";
  }
  
export const UpdateLogementForm: FC<PropsType> = ({layout , pageName}) => {
   const location = useLocation()
   const product = location.state
  const [logement, setLogement] = useState<Logement>({
     ...product
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setLogement((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newProduct: Product = {
        ...product,
        ...logement,
      };
      await productsService.updateProduct( 'logements' , newProduct.id || "" , newProduct);
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
    }
  };

  return (
    <>
          <Breadcrumb pageName={pageName} layout={layout} routeName="Retour" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="mb-3 block text-black dark:text-white">La surface </label>
    <input
      type="number"
      name="area"
      value={logement.area}
      onChange={handleInputChange}
      placeholder="Surface en m²"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Nombre de chambres </label>
    <input
      type="number"
      name="bedrooms"
      value={logement.bedrooms}
      onChange={handleInputChange}
      placeholder="Nombre de chambres"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Nombre de salles de bain </label>
    <input
      type="number"
      name="bathrooms"
      value={logement.bathrooms}
      onChange={handleInputChange}
      placeholder="Nombre de salles de bain"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Nombre de toilettes </label>
    <input
      type="number"
      name="toilets"
      value={logement.toilets}
      onChange={handleInputChange}
      placeholder="Nombre de toilettes"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Étage </label>
    <input
      type="number"
      name="floor"
      value={logement.floor}
      onChange={handleInputChange}
      placeholder="Étage"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Charges </label>
    <input
      type="number"
      name="charges"
      value={logement.charges}
      onChange={handleInputChange}
      placeholder="Charges"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Dépôt de garantie </label>
    <input
      type="number"
      name="deposit"
      value={logement.deposit}
      onChange={handleInputChange}
      placeholder="Dépôt de garantie"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Disponible du </label>
    <input
      type="date"
      name="startDate"
      value={logement.startDate}
      onChange={handleInputChange}
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Au </label>
    <input
      type="date"
      name="endDate"
      value={logement.endDate}
      onChange={handleInputChange}
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Type de chauffage </label>
    <input
      type="text"
      name="heating"
      value={logement.heating}
      onChange={handleInputChange}
      placeholder="Type de chauffage"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Transport à proximité </label>
    <input
      type="text"
      name="transport"
      value={logement.transport}
      onChange={handleInputChange}
      placeholder="Transport à proximité"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div>
    <label className="mb-3 block text-black dark:text-white">Quartier </label>
    <input
      type="text"
      name="neighborhood"
      value={logement.neighborhood}
      onChange={handleInputChange}
      placeholder="Quartier"
      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
    />
  </div>
  <div className="md:col-span-2">
    <Checkbox
      labelText="Balcon"
      checked={logement.balcony}
      onChange={() => setLogement((prev) => ({ ...prev, balcony: !prev.balcony }))}
      id="balcon"
    />
    <Checkbox
      labelText="Climatisation"
      checked={logement.airConditioning}
      onChange={() => setLogement((prev) => ({ ...prev, airConditioning: !prev.airConditioning }))}
     id="climatisation"
    />
    <Checkbox
      labelText="Ascenseur"
      checked={logement.elevator}
      onChange={() => setLogement((prev) => ({ ...prev, elevator: !prev.elevator }))}
      id="ascenseur"
    />
    <Checkbox
      labelText="Cuisine équipée"
      checked={logement.equippedKitchen}
      onChange={() => setLogement((prev) => ({ ...prev, equippedKitchen: !prev.equippedKitchen }))}
      id="cuisine"
    />
    <Checkbox
      labelText="Meublé"
      checked={logement.furnished}
      onChange={() => setLogement((prev) => ({ ...prev, furnished: !prev.furnished }))}
    />
    <Checkbox
      labelText="Jardin"
      checked={logement.garden}
      onChange={() => setLogement((prev) => ({ ...prev, garden: !prev.garden }))}
    />
    <Checkbox
      labelText="Internet"
      checked={logement.internet}
      onChange={() => setLogement((prev) => ({ ...prev, internet: !prev.internet }))}
    />
    <Checkbox
      labelText="Parking"
      checked={logement.parking}
      onChange={() => setLogement((prev) => ({ ...prev, parking: !prev.parking }))}
    />
    <Checkbox
            labelText="Animaux autorisés"
            checked={logement.petsAllowed}
            onChange={() => setLogement((prev) => ({ ...prev, petsAllowed: !prev.petsAllowed }))} id={""}    />
  </div>
  <div className="md:col-span-2">
    <button
      onClick={handleSubmit}
      className="mt-4 w-full rounded-lg bg-primary p-3 text-white transition hover:bg-opacity-90"
    >
      Modifier le logement
    </button>
  </div>
</div>
    </>
  );
};