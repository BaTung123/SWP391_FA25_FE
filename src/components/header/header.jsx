import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-blue-800 font-bold text-2xl sm:text-3xl hover:text-blue-600 transition-colors">
              SCS Garage
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6 xl:space-x-8 text-gray-700 font-medium">
              <li>
                <Link to="/" className={`transition-colors duration-200 ${location.pathname === '/' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/warehouse" className={`transition-colors duration-200 ${location.pathname === '/warehouse' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                  Kho xe
                </Link>
              </li>
              <li>
                <Link to="/#management" className="hover:text-blue-600 transition-colors duration-200">
                  Quản lý
                </Link>
              </li>
              <li>
                <Link to="/about" className={`transition-colors duration-200 ${location.pathname === '/about' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`transition-colors duration-200 ${location.pathname === '/contact' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Money & Login Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Money Section */}
            <div className="flex items-center space-x-2  px-3 py-2 rounded-lg">
              <span className="text-green-700 font-semibold">0 VNĐ</span>
            </div>
            
            {/* Registration Button */}
            <Link
              to="/member/registercar"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Đăng Ký Lịch
            </Link>
            
            {/* Login Button */}
            <Link
              to="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Đăng Nhập
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Toggle mobile menu"
            >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="pt-4">
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className={`block px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={closeMobileMenu}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/warehouse" 
                    className={`block px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/warehouse' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={closeMobileMenu}
                  >
                    Kho xe
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/#management" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Quản lý
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className={`block px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/about' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={closeMobileMenu}
                  >
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className={`block px-3 py-2 rounded-md transition-colors duration-200 ${location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`}
                    onClick={closeMobileMenu}
                  >
                    Liên hệ
                  </Link>
                </li>
                {/* Mobile Money Section */}
                <li className="pt-2">
                  <div className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg mx-3">
                    <span className="text-green-700 font-semibold">0 VNĐ</span>
                  </div>
                </li>
                
                {/* Mobile Registration Button */}
                <li className="pt-2">
                  <Link
                    to="/member/registercar"
                    className="block px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Đăng Ký Lịch
                  </Link>
                </li>
                
                {/* Mobile Login Button */}
                <li className="pt-2">
                  <Link
                    to="/auth/login"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Đăng Nhập
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
