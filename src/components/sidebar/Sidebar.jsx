import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaDatabase,
  FaBox,
  FaHeart,
  FaCalendarAlt,
  FaFileAlt,
  FaExchangeAlt,
  FaUserPlus,
  FaCog,
  FaSignOutAlt,
  FaCar,
  FaUser,
  FaClipboardList,
  FaCreditCard,
  FaHandshake
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "Member";

  console.log("User data:", user);
  console.log("Current role:", role);

  // --- ADMIN MENU ---
  const adminMenu = [
    {
      key: "/admin",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      path: "/admin"
    },
    {
      key: "/admin/user-management",
      icon: <FaUsers />,
      label: "User Management",
      path: "/admin/user-management"
    },
    {
      key: "/admin/vehicle-management",
      icon: <FaCar />,
      label: "Vehicle Management",
      path: "/admin/vehicle-management"
    }
  ];

  // --- STAFF MENU ---
  const staffMenu = [
    {
      key: "/group-management",
      icon: <FaUsers />, // ✅ sửa FaGroup thành FaUsers
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

  if (role === "Admin") {
    roleMenus = adminMenu;
  } else if (role === "Staff") {
    roleMenus = staffMenu;
  } else {
    // Nếu không có role cụ thể → hiển thị tất cả để test
    console.log("Role:", role, "- Hiển thị tất cả menu để test");
    roleMenus = [...adminMenu, ...staffMenu];
  }

  const allMenuItems = [...roleMenus, ...informationMenu, logoutItem];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
