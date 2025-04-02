import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { LayoutDashboard, ShoppingBag, Utensils, Building, Star, Store, PlusSquare, PlusCircle, Pill, User } from 'lucide-react';

const PharmacieLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routesItems = [
    {
      name: 'Tableau de bord',
      path: '',
      icon: <LayoutDashboard />,
    },
  
    
   
    {
      name: 'Les médicaments ajoutés',
      path: 'products',
      icon: <Pill />,
    },
    {
      name: 'Les commandes',
      path: 'commandes',
      icon: <ShoppingBag />,
    },
    {
      name: 'Nos pharmacie',
      path: 'prestataires',
      icon: <PlusSquare />,
    },
    {
          name: 'Catégories de plats',
          path: 'categories',
          icon: <Building />,
        }
  ];

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* ===== Page Wrapper Start ===== */}
      <div className="flex h-screen overflow-hidden">
        {/* ===== Sidebar Start ===== */}
        <Sidebar
          routesItems={routesItems}
          layout="pharmacie"
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* ===== Sidebar End ===== */}

        {/* ===== Content Area Start ===== */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* ===== Header Start ===== */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* ===== Header End ===== */}

          {/* ===== Main Content Start ===== */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* ===== Main Content End ===== */}
        </div>
        {/* ===== Content Area End ===== */}
      </div>
      {/* ===== Page Wrapper End ===== */}
    </div>
  );
};

export default PharmacieLayout;
