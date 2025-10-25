import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Wallet } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.userName) {
          setUserName(user.userName);
          setIsLoggedIn(true);
        } else {
          setUserName("");
          setIsLoggedIn(false);
        }
      } catch {
        setUserName("");
        setIsLoggedIn(false);
      }
    };

    // initial sync
    syncUser();

    // listen for storage changes (other tabs) and re-sync
    const onStorage = (e) => {
      if (!e.key || e.key === "user" || e.key === "token") syncUser();
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, [location]);

  function getInitials(name) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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

          {/* Desktop Money & Login / User Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Money — CHỈ hiện khi đã đăng nhập */}
            {isLoggedIn && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg">
                <span className="text-green-700 font-semibold">0 VNĐ</span>
              </div>
            )}

            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none rounded-full hover:bg-gray-100 px-2 py-1">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                    {getInitials(userName)}
                  </span>
                  <span className="font-medium text-gray-800">{userName}</span>
                  <svg className="w-4 h-4 ml-1 text-gray-500 group-hover:text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity duration-150">
                  <button onClick={() => navigate("/member/profile")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </button>
                  <button onClick={() => navigate("/member/wallet")} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Wallet className="mr-2 h-4 w-4" />
                    Ví của tôi
                  </button>
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Registration Button */}
                <Link
                  to="/auth/register"
className="px-7 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Đăng Ký
                </Link>
                {/* Login Button */}
                <Link
                  to="/auth/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Đăng Nhập
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
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

                {/* Mobile Money Section — CHỈ hiện khi đã đăng nhập */}
                {isLoggedIn && (
                  <li className="pt-2">
                    <div className="flex items-center justify-center space-x-2 px-3 py-2 rounded-lg mx-3">
                      <span className="text-green-700 font-semibold">0 VNĐ</span>
                    </div>
                  </li>
                )}

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

                {/* Conditional auth buttons */}
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/member/profile"
                        className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center"
                        onClick={closeMobileMenu}
                      >
                        Thông tin cá nhân
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="block w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-center"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/auth/login"
                      className="block px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center"
                      onClick={closeMobileMenu}
                    >
                      Đăng Nhập
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;