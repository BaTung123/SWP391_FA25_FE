import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';

const SidebarLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-[#eaf3fb] p-6 overflow-y-auto ml-64">
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout 