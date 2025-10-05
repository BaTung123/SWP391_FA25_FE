import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <a href="#home" className="text-blue-800 font-bold text-2xl sm:text-3xl hover:text-blue-600 transition-colors">
              SCS Garage
            </a>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6 xl:space-x-8 text-gray-700 font-medium">
              <li>
                <a href="#home" className="hover:text-blue-600 transition-colors duration-200">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#warehouse" className="hover:text-blue-600 transition-colors duration-200">
                  Kho xe
                </a>
              </li>
              <li>
                <a href="#management" className="hover:text-blue-600 transition-colors duration-200">
                  Quản lý
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-600 transition-colors duration-200">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-600 transition-colors duration-200">
                  Liên hệ
                </a>
              </li>
            </ul>
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden lg:block">
            <a
              href="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Đăng Nhập
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="pt-4">
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#home" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Trang chủ
                  </a>
                </li>
                <li>
                  <a 
                    href="#warehouse" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Kho xe
                  </a>
                </li>
                <li>
                  <a 
                    href="#management" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Quản lý
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    Liên hệ
                  </a>
                </li>
                <li className="pt-2">
                  <a
                    href="/auth/login"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center"
                    onClick={closeMobileMenu}
                  >
                    Đăng Nhập
                  </a>
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
