import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Wallet } from 'lucide-react';
import api from '../../config/axios';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 👈 Thêm state dropdown
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);

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
          setBalance(0);
        }
      } catch {
        setUserName("");
        setIsLoggedIn(false);
        setBalance(0);
      }
    };

    syncUser();
    const onStorage = (e) => {
      if (!e.key || e.key === "user" || e.key === "token") syncUser();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [location]);

  // Fetch user balance from API
  useEffect(() => {
    const fetchUserBalance = async () => {
      if (!isLoggedIn) {
        setBalance(0);
        return;
      }

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        const response = await api.get("/User");
        let userData = null;

        // Handle different response formats
        if (Array.isArray(response.data)) {
          // If response is an array, find the current user
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          userData = response.data.find(
            (u) => u.userName === storedUser.userName || u.userId === storedUser.userId
          ) || response.data[0];
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          userData = response.data.data.find(
            (u) => u.userName === storedUser.userName || u.userId === storedUser.userId
          ) || response.data.data[0];
        } else {
          // Single object response
          userData = response.data;
        }

        if (userData && userData.balance !== undefined && userData.balance !== null) {
          setBalance(Number(userData.balance));
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Error fetching user balance:", error);
        setBalance(0);
      }
    };

    fetchUserBalance();
  }, [isLoggedIn, location]);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // 👇 Click ra ngoài sẽ đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-blue-800 font-bold text-2xl sm:text-3xl hover:text-blue-600 transition-colors"
            >
              SCS Garage
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex space-x-6 xl:space-x-8 text-gray-700 font-medium">
              <li>
                <Link
                  to="/"
                  className={`transition-colors duration-200 ${
                    location.pathname === "/" ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/warehouse"
                  className={`transition-colors duration-200 ${
                    location.pathname === "/warehouse" ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  Kho xe
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`transition-colors duration-200 ${
                    location.pathname === "/about" ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`transition-colors duration-200 ${
                    location.pathname === "/contact" ? "text-blue-600" : "hover:text-blue-600"
                  }`}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn && (
              <Link
                to="/member/registercar"
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Đăng Ký Lịch
              </Link>
            )}

            {isLoggedIn && (
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg">
                <span className="text-green-700 font-semibold">
                  {balance.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            )}

            {isLoggedIn ? (
              <div className="relative dropdown-wrapper">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none rounded-full hover:bg-gray-100 px-2 py-1"
                >
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                    {getInitials(userName)}
                  </span>
                  <span className="font-medium text-gray-800">{userName}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-blue-600" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={() => navigate("/member/profile")}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Thông tin cá nhân
                    </button>
                    <button
                      onClick={() => navigate("/member/wallet")}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Ví của tôi
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Đăng Nhập
              </Link>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
  