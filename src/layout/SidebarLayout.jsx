import React from 'react';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <a 
                href="/information" 
                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="/information/reports" 
                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
              >
                Reports
              </a>
            </li>
            <li>
              <a 
                href="/information/settings" 
                className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#eaf3fb] p-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout 