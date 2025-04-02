import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';

import ECommerce from './pages/Dashboard/ECommerce';

import RestoLayout from './layout/RestoLayout';
import Products from './pages/Products';
import Commandes from './pages/Commandes';
import Prestataires from './pages/Prestataires';
import SuperarketLayout from './layout/SupermarketLayout';
import PharmacieLayout from './layout/PharmacieLayout';
import NewProduct from './pages/NewProduct';
import NewPrestataire from './pages/NewPrestataire';
import UpdatePrestataire from './pages/UpdatePrestataire';
import NewCategorie from './pages/NewCategorie';
import UpdateCategorie from './pages/UpdateCategorie';
import { Categories } from './pages/Categories';
import UpdateProduct from './pages/UpdateProduct';
import { 
  Pill, 
  LayoutDashboard, 
  ShoppingBag, 
  PlusSquare, 
  Store,
  Book
} from 'lucide-react';
import HotelLayout from './layout/HotelLayout';
import { LogementForm } from './pages/NewLogement';
import { UpdateLogementForm } from './pages/UpdateLogement';
import AddVariations from './pages/NewVariation';
import Reservations from './pages/Reservations';
import SignUp from './pages/Authentication/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import ProfilePage from './pages/Profile';
import Account from './pages/Account';

const ROUTES = {
  DASHBOARD: '',
  PRODUCTS: 'products',
  ORDERS: 'commandes',
  PRESTATAIRES: 'prestataires',
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);


  const navigation =  [
    {
      layout: 'restaurant',
      routes: [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: <LayoutDashboard /> },
        { name: 'Les médicaments ajoutés', path: ROUTES.PRODUCTS, icon: <Pill /> },
        { name: 'Les commandes', path: ROUTES.ORDERS, icon: <ShoppingBag /> },
        { name: 'Nos pharmacies', path: ROUTES.PRESTATAIRES, icon: <PlusSquare /> },
      ],
    },
    {
      layout: 'pharmacie',
      routes: [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: <LayoutDashboard /> },
        { name: 'Médicaments', path: ROUTES.PRODUCTS, icon: <Pill /> },
        { name: 'Commandes clients', path: ROUTES.ORDERS, icon: <ShoppingBag /> },
        { name: 'Nos partenaires', path: ROUTES.PRESTATAIRES, icon: <PlusSquare /> },
      ],
    },
    {
      layout: 'supermarket',
      routes: [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: <LayoutDashboard /> },
        { name: 'Produits', path: ROUTES.PRODUCTS, icon: <ShoppingBag /> },
        { name: 'Commandes', path: ROUTES.ORDERS, icon: <ShoppingBag /> },
        { name: 'Nos fournisseurs', path: ROUTES.PRESTATAIRES, icon: <Store /> },
      ],
    },
    {
      layout: 'hotel',
      routes: [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: <LayoutDashboard /> },
        { name: 'Réservations', path: 'reservations', icon: <Book /> },
        { name: 'Chambres', path: 'rooms', icon: <Pill /> },
        { name: 'Clients', path: 'clients', icon: <PlusSquare /> },
      ],
    },
    {
      layout: 'agenceTransport',
      routes: [
        { name: 'Tableau de bord', path: ROUTES.DASHBOARD, icon: <LayoutDashboard /> },
        { name: 'Voyages', path: 'voyages', icon: <ShoppingBag /> },
        { name: 'Bus disponibles', path: 'bus', icon: <Pill /> },
        { name: 'Clients', path: 'clients', icon: <PlusSquare /> },
      ],
    },
  ]
  return loading ? (
    <Loader />
  ) : (


    <AuthProvider>
          <Routes>

<Route path="*" element={<SignIn />} />

<Route
  path='/'
  element={
    <>
      <PageTitle title="  Se connecter en tant qu'admin | EasyLife Market" />
       <SignIn />
    </>
  }
/>
 <Route
  path='/signup'
  element={
    <>
      <PageTitle title="Créer un compte professionel | EasyLife Market" />
       <SignUp />
    </>
  }
/>

<Route
  path='/profile'
  element={
    <>
      <PageTitle title="Mon profile  | EasyLife Market" />
       <PharmacieLayout>
          <Account />
       </PharmacieLayout>
    </>
  }
/>

        {/**Les routes pour restaurant */}


 


<Route
  path='/restaurant'
  element={
    <>
      <PageTitle title="Restaurant Dashboard | EasyLife Market" />
      <RestoLayout>
        <ECommerce title='Nos derniers menus' collectionName='plats' layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>
<Route
  path='/restaurant/new-categorie'
  element={
    <>
      <PageTitle title="Ajouter une catégorie  | EasyLife Market" />
      <RestoLayout>
        <NewCategorie pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>

<Route
  path='/restaurant/add-variations'
  element={
    <>
      <PageTitle title="Ajouter une variation  | EasyLife Market" />
      <RestoLayout>
        <AddVariations routeName='Retour' collectionName='plats' pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>


<Route
  path='/restaurant/update-categorie'
  element={
    <>
      <PageTitle title="Modifier une catégorie  | EasyLife Market" />
      <RestoLayout>
        <UpdateCategorie routeName='Catégories' pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>
 <Route
  path='/restaurant/categories'
  element={
    <>
      <PageTitle title="Nos categories  | EasyLife Market" />
      <RestoLayout>
        <Categories  pageName='Nos categories' title='Nos categories'  
        layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>

 <Route
  path='/restaurant/new-prestataire'
  element={
    <>
      <PageTitle title="Ajouter un restaurant | EasyLife Market" />
      <RestoLayout>
        <NewPrestataire pageName='Ajouter un nouveau restaurant' 
        title='Ajouter un nouveau restaurant'  layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>
 <Route
  path='/restaurant/update-prestataire'
  element={
    <>
      <PageTitle title="Modifier un restaurant | EasyLife Market" />
      <RestoLayout>
        <UpdatePrestataire routeName='Nos restaurants' pageName='Modifier un  restaurant' 
        title='Modifier un  restaurant'  layout='restaurant'/>
      </RestoLayout>
    </>
  }
/>
<Route
  path="/restaurant/products"
  element={
    <>
      <PageTitle title="Nos plats disponibles | EasyLife Market" />
     <RestoLayout>
        <Products layout='restaurant' title='Nos menus' collectionName='plats' pageName='Liste de menu' />
     </RestoLayout>
    </>
  }
/>
  <Route
  path="/restaurant/new-product"
  element={
    <>
      <PageTitle title="Nouveau plat | EasyLife Market" />
     <RestoLayout>
        <NewProduct layout='restaurant' title='Ajouter un plat' collectionName='plats' pageName='Nouveau plat' />
     </RestoLayout>
    </>
  }
/>
 <Route
  path="/restaurant/update-product"
  element={
    <>
      <PageTitle title="Modifier un plat | EasyLife Market" />
     <RestoLayout>
        <UpdateProduct routeName='Nos plats' layout='restaurant' 
        title='Modifier un plat ' collectionName='plats' pageName='Modifier un plat' />
     </RestoLayout>
    </>
  }
/>
 <Route
  path="/restaurant/prestataires"
  element={
    <>
      <PageTitle title="Nos restaurants partenaires | EasyLife Market" />
     <RestoLayout>
        <Prestataires layout='restaurant' pageName='Nos partenaires' title='Nos restaurants partenaires' />
     </RestoLayout>
    </>
  }
/>
 <Route
  path="/restaurant/commandes"
  element={
    <>
      <PageTitle title="Commandes réçues | EasyLife Market" />
     <RestoLayout>
        <Commandes collectionName='plats' layout='restaurant' pageName={'Les commandes '} 
        
        title={'Commandes des plats'}  />
     </RestoLayout>
    </>
  }
/>


















  {/**Les routes pour supermarchés */}
  <Route
  path='/supermarket'
  element={
    <>
      <PageTitle title="Supermarket Dashboard | EasyLife Market" />
      <SuperarketLayout>
        <ECommerce title='Nos derniers articles' collectionName='articles' layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>
<Route
  path='/supermarket/new-categorie'
  element={
    <>
      <PageTitle title="Ajouter une catégorie  | EasyLife Market" />
      <SuperarketLayout>
        <NewCategorie pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>


<Route
  path='/supermarket/update-categorie'
  element={
    <>
      <PageTitle title="Modifier une catégorie  | EasyLife Market" />
      <SuperarketLayout>
        <UpdateCategorie routeName='Catégories' pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>
 <Route
  path='/supermarket/categories'
  element={
    <>
      <PageTitle title="Nos categories  | EasyLife Market" />
      <SuperarketLayout>
        <Categories  pageName='Nos categories' title='Nos categories'  layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>

   <Route
  path='/supermarket/new-prestataire'
  element={
    <>
      <PageTitle title="Ajouter un super-marché| EasyLife Market" />
      <SuperarketLayout>
        <NewPrestataire pageName='Ajouter un super-marché' title='Ajouter un super-marché'  layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>

<Route
  path='/supermarket/update-prestataire'
  element={
    <>
      <PageTitle title="Modifier un super-marché| EasyLife Market" />
      <SuperarketLayout>
        <UpdatePrestataire routeName='Nos super-marchés' pageName='Modifier un super-marché' title='Modifier un super-marché'  layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>
<Route
  path="/supermarket/products"
  element={
    <>
      <PageTitle title="Nos articles disponibles | EasyLife Market" />
     <SuperarketLayout>
        <Products layout='supermarket' title='Nos articles' collectionName='articles' pageName='Liste des articles' />
     </SuperarketLayout>
    </>
  }
/>
 <Route
  path="/supermarket/new-product"
  element={
    <>
      <PageTitle title="Nouvel article | EasyLife Market" />
     <SuperarketLayout>
        <NewProduct layout='supermarket' title='Modifier un articlet'
         collectionName='articles' pageName='Nouvel article' />
     </SuperarketLayout>
    </>
  }
/>

 <Route
  path='/supermarket/add-variations'
  element={
    <>
      <PageTitle title="Ajouter une variation  | EasyLife Market" />
      <SuperarketLayout>
        <AddVariations routeName='Retour' collectionName='articles' pageName='Ajouter les variations'
         title='Ajouter les variations'  layout='supermarket'/>
      </SuperarketLayout>
    </>
  }
/>
<Route
  path="/supermarket/update-product"
  element={
    <>
      <PageTitle title="Modifier article | EasyLife Market" />
     <SuperarketLayout>
        <UpdateProduct routeName='Nos articles' layout='supermarket'
         title='Modifier un article'
         collectionName='articles' pageName='Modifier un  article' />
     </SuperarketLayout>
    </>
  }
/>
 <Route
  path="/supermarket/prestataires"
  element={
    <>
      <PageTitle title="Nos super-marché partenaires | EasyLife Market" />
     <SuperarketLayout>
        <Prestataires layout='supermarket' pageName='Nos partenaires' title='Nos super-marchés partenaires' />
     </SuperarketLayout>
    </>
  }
/>
 <Route
  path="/supermarket/commandes"
  element={
    <>
      <PageTitle title="Commandes réçues | EasyLife Market" />
     <SuperarketLayout>
        <Commandes collectionName='articles' layout='restaurant' pageName={'Les commandes '} 
        
        title={'Commandes des articles'}  />
     </SuperarketLayout>
    </>
  }
/>













{/** Les routes pour pharmacie */}
<Route
  path='/pharmacie'
  element={
    <>
      <PageTitle title="Pharmacie Dashboard | EasyLife Market" />
      <PharmacieLayout>
        <ECommerce title='Nos derniers médicaments' collectionName='medicaments' layout='pharmacie'/>
      </PharmacieLayout>
    </>
  }
/>
<Route
  path="/pharmacie/products"
  element={
    <>
      <PageTitle title="Nos médicaments disponibles | EasyLife Market" />
     <PharmacieLayout>
        <Products layout='pharmacie' title='Nos médicaments' collectionName='medicaments' pageName='Liste des médicaments' />
     </PharmacieLayout>
    </>
  }
/>

<Route
  path='/pharmacie/new-categorie'
  element={
    <>
      <PageTitle title="Ajouter une catégorie  | EasyLife Market" />
      <PharmacieLayout>
        <NewCategorie pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='pharmacie'/>
      </PharmacieLayout>
    </>
  }
/>


<Route
  path='/pharmacie/update-categorie'
  element={
    <>
      <PageTitle title="Modifier une catégorie  | EasyLife Market" />
      <PharmacieLayout>
        <UpdateCategorie routeName='Catégories' pageName='Ajouter une categorie' title='Ajouter une categorie'  layout='pharmacie'/>
      </PharmacieLayout>
    </>
  }
/>
 <Route
  path='/pharmacie/categories'
  element={
    <>
      <PageTitle title="Nos catégories  | EasyLife Market" />
      <PharmacieLayout>
        <Categories  pageName='Nos catégorie' title='Ajouter une categorie'  layout='pharmacie'/>
      </PharmacieLayout>
    </>
  }
/>

 <Route
  path="/pharmacie/prestataires"
  element={
    <>
      <PageTitle title="Nos super-marché partenaires | EasyLife Market" />
     <PharmacieLayout>
        <Prestataires layout='pharmacie' pageName='Nos partenaires' title='Nos pharmacies partenaires' />
     </PharmacieLayout>
    </>
  }
/>
 <Route
  path="/pharmacie/new-product"
  element={
    <>
      <PageTitle title="Nouveau médicament | EasyLife Market" />
     <PharmacieLayout>
        <NewProduct layout='pharmacie' title='Ajouter un médicament' collectionName='medicaments' pageName='Nouveau médicament' />
     </PharmacieLayout>
    </>
  }
/>
<Route
  path="/pharmacie/update-product"
  element={
    <>
      <PageTitle title="Modifier médicament | EasyLife Market" />
     <PharmacieLayout>
        <UpdateProduct routeName='Médicaments' 
        layout='pharmacie' title='Modifier un médicament' 
        collectionName='medicaments' pageName='Modifier médicament' />
     </PharmacieLayout>
    </>
  }
/>
 <Route
  path="/pharmacie/new-prestataire"
  element={
    <>
      <PageTitle title="Ajouter une pharmacie | EasyLife Market" />
     <PharmacieLayout>
        <NewPrestataire layout='pharmacie' title='Ajouter une pharmacie' pageName='Ajouter une pharmacie' />
     </PharmacieLayout>
    </>
  }
/>
 <Route
  path="/pharmacie/update-prestataire"
  element={
    <>
      <PageTitle title="Ajouter une pharmacie | EasyLife Market" />
     <PharmacieLayout>
        <UpdatePrestataire routeName='Nos pharmacies' layout='pharmacie' title='Ajouter une pharmacie' pageName='Ajouter une pharmacie' />
     </PharmacieLayout>
    </>
  }
/>

 <Route
  path="/pharmacie/commandes"
  element={
    <>
      <PageTitle title="Commandes réçues | EasyLife Market" />
     <PharmacieLayout>
        <Commandes collectionName='medicaments' layout='pharmacie' pageName={'Les commandes '} 
        
        title={'Commandes des médicaments'}  />
     </PharmacieLayout>
    </>
  }
/>

<Route
  path='/pharmacie/add-variations'
  element={
    <>
      <PageTitle title="Ajouter une variation  | EasyLife Market" />
      <PharmacieLayout >
        <AddVariations routeName='Retour' collectionName='medicaments' 
        pageName='Ajouter les variations'
         title='Ajouter les variations'  layout='pharmacie'/>
      </PharmacieLayout>
    </>
  }
/>
 






{/*** Les routes pour logements */}


<Route
  path="/hotel"
  element={
    <>
      <PageTitle title="Tableau de bord des logements | EasyLife Market" />
     <HotelLayout>
       <ECommerce layout='hotel' collectionName={'logements'} title={'Tableau de bord'} />
     </HotelLayout>
    </>
  }
/>
 <Route
  path="/hotel/prestataires"
  element={
    <>
      <PageTitle title="Nos  partenaires | EasyLife Market" />
     <HotelLayout>
        <Prestataires layout='hotel' pageName='Nos partenaires' title='Nos  partenaires' />
     </HotelLayout>
    </>
  }
/>
  <Route
  path="/hotel/new-prestataire"
  element={
    <>
      <PageTitle title="Ajouter un partenaire | EasyLife Market" />
     <HotelLayout>
        <NewPrestataire layout='hotel' pageName='Ajouter un partenaire'
         title='Ajouter un partenaire' />
     </HotelLayout>
    </>
  }
/>
  <Route
  path="/hotel/update-prestataire"
  element={
    <>
      <PageTitle title="Modifier un partenaire | EasyLife Market" />
     <HotelLayout>
        <UpdatePrestataire routeName='Nos partenaires' layout='hotel' pageName='Modifier un partenaire'
         title='Modifier un partenaire' />
     </HotelLayout>
    </>
  }
/>
 <Route
  path="/hotel/products"
  element={
    <>
      <PageTitle title="Tableau de bord des logements | EasyLife Market" />
     <HotelLayout>
       <Products layout='hotel' collectionName={'logements'}
        title={'Nos logements'} pageName={'Nos logements'} />
     </HotelLayout>
    </>
  }
/>

 <Route
  path="/hotel/categories"
  element={
    <>
      <PageTitle title="Catégories de  logements | EasyLife Market" />
     <HotelLayout>
       <Categories layout='hotel' 
        title={'Nos catégories'} pageName={'Nos catégories'} />
     </HotelLayout>
    </>
  }
/>

<Route
  path="/hotel/update-categorie"
  element={
    <>
      <PageTitle title="Catégories de  logements | EasyLife Market" />
     <HotelLayout>
       <UpdateCategorie routeName='Nos catégories' layout='hotel' 
        title={'Nos catégories'} pageName={'Nos catégories'} />
     </HotelLayout>
    </>
  }
/>
 <Route
  path="/hotel/new-categorie"
  element={
    <>
      <PageTitle title="Ajouter une catégorie | EasyLife Market" />
     <HotelLayout>
       <NewCategorie  layout='hotel' 
        title={'Ajouter une catégorie'} pageName={'Ajouter une catégorie'} />
     </HotelLayout>
    </>
  }
/>

<Route
  path="/hotel/new-product"
  element={
    <>
      <PageTitle title="Nouveau logement| EasyLife Market" />
     <HotelLayout>
       <NewProduct layout='hotel' collectionName={'logements'}
        title={'Nouveau logement'} pageName={'Nouveau logement'} />
     </HotelLayout>
    </>
  }
/>

<Route
  path="/hotel/update-product"
  element={
    <>
      <PageTitle title="Modifier logement| EasyLife Market" />
     <HotelLayout>
       <UpdateProduct layout='hotel' collectionName={'logements'}
        title={'Modifier un  logement'} pageName={'Modifier un  logement'} 
        routeName={'Nos logements'} />
     </HotelLayout>
    </>
  }
/>

<Route
  path="/hotel/new-logement"
  element={
    <>
      <PageTitle title="Ajouter logement| EasyLife Market" />
     <HotelLayout>
       <LogementForm layout='hotel' collectionName={'logements'}
         pageName={'Ajouter un  logement'} 
       />
     </HotelLayout>
    </>
  }
/>



<Route
  path="/hotel/update-logement"
  element={
    <>
      <PageTitle title="Modifier logement| EasyLife Market" />
     <HotelLayout>
       <UpdateLogementForm layout='hotel' collectionName={'logements'}
         pageName={'Modifier un  logement'} 
       />
     </HotelLayout>
    </>
  }
/>

<Route
  path="/hotel/reservations"
  element={
    <>
      <PageTitle title="Nos  partenaires | EasyLife Market" />
     <HotelLayout>
        <Reservations  />
     </HotelLayout>
    </>
  }
/>





</Routes>
    </AuthProvider>
  );
}

export default App;
