import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { LayoutDashboard, ShoppingBag, Utensils, Building, Star, Store, PlusCircle, Tag, User } from 'lucide-react';

const SuperarketLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routesItems = [
    {
      name: 'Tableau de bord',
      path: '',
      icon: <LayoutDashboard />,
    },
  
    {
      name: 'Les articles ajoutés',
      path: 'products',
      icon: <Tag />,
    },
    {
      name: 'Les commandes',
      path: 'commandes',
      icon: <ShoppingBag />,
    },
   
    {
      name: 'Nos super-marchés',
      path: 'prestataires',
      icon: <Store />,
    },
    {
          name: 'Catégories d\'articles',
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
          layout="supermarket"
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

export default SuperarketLayout;
