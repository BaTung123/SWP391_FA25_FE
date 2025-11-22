import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaCar,
  FaUser,
  FaCreditCard,
  FaRegClipboard,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role !== undefined && user?.role !== null
    ? (typeof user.role === "number" ? user.role : Number(user.role))
    : 0;

  // --- ADMIN MENU ITEMS ---
  const dashboardItem = {
    key: "/admin",
    icon: <FaTachometerAlt />,
    label: "Dashboard",
    path: "/admin"
  };

  const userManagementItem = {
    key: "/admin/user-management",
    icon: <FaUsers />,
    label: "User Management",
    path: "/admin/user-management"
  };

  // --- ADMIN MENU ---
  const adminMenu = [
    dashboardItem,
    userManagementItem,
  ];

  // --- STAFF MENU ---
  const staffMenu = [
    {
      key: "/staff/vehicle-management",
      icon: <FaCar />,
      label: "Vehicle Management",
      path: "/staff/vehicle-management",
    },
    {
      key: "/staff/group-management",
      icon: <FaUsers />,
      label: "Group Management",
      path: "/staff/group-management"
    },
    {
      key: "/staff/booking-management",
      icon: <FaCalendarAlt />,
      label: "Booking Management",
      path: "/staff/booking-management"
    },
    {
      key: "/staff/vote",
      icon: <FaRegClipboard />,
      label: "Form Management",
      path: "/staff/vote"
    },
    {
      key: "/staff/maintenance",
      icon: <FaCog />,
      label: "Maintenance",
      path: "/staff/maintenance"
    },
    {
      key: "/staff/payment",
      icon: <FaCreditCard />,
      label: "Payments",
      path: "/staff/payment"
    },
  ];

  // --- INFORMATION MENU ---
  const informationMenu = [
    {
      key: "/profile",
      icon: <FaUser />,
      label: "Profile",
      path: "/profile"
    }
  ];

  // --- LOGOUT ---
  const logoutItem = {
    key: "logout",
    icon: <FaSignOutAlt />,
    label: "Logout",
    path: "/",
    isLogout: true
  };

  // Xác định menu dựa theo role
  let roleMenus = [];
  if (role === 1) {
    // Admin: menu admin + staff
    roleMenus = [...adminMenu, ...staffMenu];
  } else if (role === 2) {
    // Staff
    roleMenus = [...staffMenu];
  } else {
    roleMenus = [];
  }

  // 🟦 CHỈNH SỬA TẠI ĐÂY → ADMIN KHÔNG CÓ PROFILE
  const allMenuItems =
    role === 1
      ? [...roleMenus, logoutItem] // admin: không có profile
      : [...roleMenus,  logoutItem]; // staff/member: có profile

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/auth/login", { replace: true });
  };

  const handleMenuClick = (item) => {
    if (item.isLogout) handleLogout();
  };

  return (
    <div
      className="fixed left-0 top-0 h-screen w-64 bg-indigo-900 text-white z-50 shadow-lg"
      style={{ backgroundColor: "#073a82" }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-center border-b border-indigo-800">
        <div className="w-full text-center">
          <span className="text-2xl font-bold text-white">
            EV Co-ownership
          </span>
          {role === 1 && (
            <div className="mt-2">
              <span className="text-sm text-gray-300">admin</span>
            </div>
          )}
          {role === 2 && (
            <div className="mt-2">
              <span className="text-sm text-gray-300">staff</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {allMenuItems.map((item) => (
            <li key={item.key}>
              {item.isLogout ? (
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-indigo-800 ${
                    location.pathname === item.path
                      ? 'bg-indigo-800 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="text-red-400">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-indigo-800 ${
                    location.pathname === item.path
                      ? 'bg-indigo-800 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
