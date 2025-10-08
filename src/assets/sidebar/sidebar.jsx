import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaCar,
  FaUser,
  FaChartLine,
  FaCalendarAlt,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaUserShield,
  FaUserTie,
  FaHome,
  FaInfoCircle,
  FaPhone
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "Member";
  
  // Danh sách tất cả các menu item
  
  // --- ADMIN ---
  const adminMenu = [
    {
      key: "/admin",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      path: "/admin"
    },
    {
      key: "/admin/user",
      icon: <FaUsers />,
      label: "User Management",
      path: "/admin/user"
    },
    {
      key: "/admin/vehicles",
      icon: <FaCar />,
      label: "Vehicle Management",
      path: "/admin/vehicles"
    },
    {
      key: "/admin/reports",
      icon: <FaChartLine />,
      label: "Reports",
      path: "/admin/reports"
    }
  ];

  // --- MEMBER ---
  const memberMenu = [
    {
      key: "/member/profile",
      icon: <FaUser />,
      label: "Profile",
      path: "/member/profile"
    },
    {
      key: "/member/vehicles",
      icon: <FaCar />,
      label: "My Vehicles",
      path: "/member/vehicles"
    },
    {
      key: "/member/booking",
      icon: <FaCalendarAlt />,
      label: "Booking",
      path: "/member/booking"
    },
    {
      key: "/member/payments",
      icon: <FaClipboardList />,
      label: "Payments",
      path: "/member/payments"
    }
  ];

  // --- STAFF ---
  const staffMenu = [
    {
      key: "/staff/vehicles",
      icon: <FaCar />,
      label: "Vehicle Management",
      path: "/staff/vehicles"
    },
    {
      key: "/staff/booking",
      icon: <FaCalendarAlt />,
      label: "Booking Management",
      path: "/staff/booking"
    },
    {
      key: "/staff/maintenance",
      icon: <FaCog />,
      label: "Maintenance",
      path: "/staff/maintenance"
    },
    {
      key: "/staff/reports",
      icon: <FaChartLine />,
      label: "Reports",
      path: "/staff/reports"
    }
  ];

  // --- GENERAL ---
  const generalMenu = [
    {
      key: "/",
      icon: <FaHome />,
      label: "Home",
      path: "/"
    },
    {
      key: "/about",
      icon: <FaInfoCircle />,
      label: "About",
      path: "/about"
    },
    {
      key: "/contact",
      icon: <FaPhone />,
      label: "Contact",
      path: "/contact"
    }
  ];

  // --- PROFILE ---
  const profileMenu = [
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
    path: "/logout",
    isLogout: true
  };

  let roleMenus = [];
  if (role === "Admin") {
    roleMenus = adminMenu;
  } else if (role === "Staff") {
    roleMenus = staffMenu;
  } else if (role === "Member") {
    roleMenus = memberMenu;
  }

  const allMenuItems = [
    ...generalMenu,
    ...roleMenus,
    ...profileMenu,
    logoutItem
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const handleMenuClick = (item) => {
    if (item.isLogout) {
      handleLogout();
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'Admin':
        return <FaUserShield className="w-5 h-5 text-red-400" />;
      case 'Staff':
        return <FaUserTie className="w-5 h-5 text-blue-400" />;
      case 'Member':
        return <FaUser className="w-5 h-5 text-green-400" />;
      default:
        return <FaUser className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div 
      className="fixed left-0 top-0 h-screen w-64 bg-indigo-900 text-white z-50 shadow-lg"
      style={{ backgroundColor: "#073a82" }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-center border-b border-indigo-800">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center h-16">
            <span className="text-2xl font-bold text-white text-center">EV Co-ownership</span>
            <div className="flex items-center mt-1">
              {getRoleIcon()}
              <span className="text-sm text-gray-300 text-center ml-2">{role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-indigo-800">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium text-white">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
              <p className="text-xs text-gray-300">{user.email}</p>
            </div>
          </div>
        </div>
      )}

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
