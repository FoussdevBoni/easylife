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
import AddVariations from './pages/NewVariation';

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

    <>
      {
        navigation.map((item)=>{
          return(
            
      <Routes>

      <Route
        path={item.layout}
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
      


















    </Routes>
          )
        })
      }
    </>
  );
}

export default App;
