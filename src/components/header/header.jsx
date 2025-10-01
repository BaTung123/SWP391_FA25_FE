import React from 'react';

const HeaderComponent = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">SWP391</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Home</a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
            <a href="/auth/login" className="text-gray-700 hover:text-indigo-600 transition-colors">Login</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
