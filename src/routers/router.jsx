import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import SidebarLayout from "../layout/SidebarLayout";

// Guest pages
const HomePage = lazy(() => import("../pages/guest/homePage"));
const AboutPage = lazy(() => import("../pages/guest/aboutPage"));
const ContactPage = lazy(() => import("../pages/guest/contactPage"));
const WarehousePage = lazy(() => import("../pages/guest/warehousePage"));
const LoginPage = lazy(() => import("../pages/guest/loginPage"));
const RegisterPage = lazy(() => import("../pages/guest/registerPage"));

// Member pages
const ProfilePage = lazy(() => import("../pages/member/profilePage"));
const RegistercarPage = lazy(() => import("../pages/member/registercarPage"));

// Admin pages
const AdminDashboardPage = lazy(() => import("../pages/admin/adminDashboardPage"));
const UserManagementPage = lazy(() => import("../pages/admin/userManagementPage"));
const VehicleManagementPage = lazy(() => import("../pages/admin/vehicleManagementPage"));

// Staff pages
const StaffVehicleManagementPage = lazy(() => import("../pages/staff/vehicleManagementPage"));
const BookingManagementPage = lazy(() => import("../pages/staff/bookingManagementPage"));
const MaintenancePage = lazy(() => import("../pages/staff/maintenancePage"));
const PaymentPage = lazy(() => import("../pages/staff/paymentPage"));
const CoOwnershipRegistrationPage = lazy(() => import("../pages/staff/coOwnershipRegistrationPage"));
const StaffReportsPage = lazy(() => import("../pages/staff/reportsPage"));

// Error pages
const UnauthorizedPage = lazy(() => import("../pages/error/unauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/error/notFoundPage"));

// Loading component
const Loading = () => <div>Loading...</div>;

// Route protection wrapper
const ProtectedRoute = ({ children, roleAccount }) => {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  if (!user) return <Navigate to="/auth/login" />;

  if (!roleAccount.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export const router = createBrowserRouter([
  // Guest routes with RootLayout
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { 
        path: "", 
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        )
      },
      { 
        path: "about", 
        element: (
          <Suspense fallback={<Loading />}>
            <AboutPage />
          </Suspense>
        )
      },
      { 
        path: "contact", 
        element: (
          <Suspense fallback={<Loading />}>
            <ContactPage />
          </Suspense>
        )
      },
      { 
        path: "warehouse", 
        element: (
          <Suspense fallback={<Loading />}>
            <WarehousePage />
          </Suspense>
        )
      },
    ],
  },

  // Auth routes with AuthLayout
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { 
        path: "login", 
        element: (
          <Suspense fallback={<Loading />}>
            <LoginPage />
          </Suspense>
        )
      },
      { 
        path: "register", 
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterPage />
          </Suspense>
        )
      },
    ],
  },

  // Profile page with sidebar layout
  {
    path: "/profile",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        )
      },
    ],
  },

  // Member routes without SidebarLayout
  {
    path: "/member",
    element: <RootLayout />,
    children: [
      { 
        path: "profile", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Member", "Staff", "Admin"]}> */}
              <ProfilePage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "registercar", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Member", "Staff", "Admin"]}> */}
              <RegistercarPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
    ],
  },

  // Admin routes with SidebarLayout
  // LƯU Ý: ProtectedRoute đã được comment để test không cần đăng nhập
  // Khi deploy production, uncomment các ProtectedRoute và cấu hình role phù hợp
  {
    path: "/admin",
    element: <SidebarLayout />,
    children: [
      { 
        path: "", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Admin"]}> */}
              <AdminDashboardPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "user-management", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Admin"]}> */}
              <UserManagementPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "vehicle-management", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Admin"]}> */}
              <VehicleManagementPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
    ],
  },

  // Staff routes with SidebarLayout
  // LƯU Ý: ProtectedRoute đã được comment để test không cần đăng nhập
  {
    path: "/staff",
    element: <SidebarLayout />,
    children: [
      { 
        path: "vehicle-management", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Staff"]}> */}
              <StaffVehicleManagementPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "booking-management", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Staff"]}> */}
              <BookingManagementPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "maintenance", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Staff"]}> */}
              <MaintenancePage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "payment", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Staff"]}> */}
              <PaymentPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "co-ownership-registration", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Staff"]}> */}
              <CoOwnershipRegistrationPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
      { 
        path: "reports", 
        element: (
          <Suspense fallback={<Loading />}>
            {/* <ProtectedRoute roleAccount={["Staff"]}> */}
              <StaffReportsPage />
            {/* </ProtectedRoute> */}
          </Suspense>
        )
      },
    ],
  },

  // Error routes
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<Loading />}>
        <UnauthorizedPage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFoundPage />
      </Suspense>
    )
  },
]);
