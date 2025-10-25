import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import SidebarLayout from "../layout/SidebarLayout";
import MemberLayout from "../layout/MemberLayout";

// Guest pages
const HomePage = lazy(() => import("../pages/guest/homePage"));
const AboutPage = lazy(() => import("../pages/guest/aboutPage"));
const ContactPage = lazy(() => import("../pages/guest/contactPage"));
const WarehousePage = lazy(() => import("../pages/guest/warehousePage"));
const LoginPage = lazy(() => import("../pages/guest/loginPage"));
const RegisterPage = lazy(() => import("../pages/guest/registerPage"));

// Member pages
const MemberPage = lazy(() => import("../pages/member/memberPage")); // ⬅️ đổi tên biến import
const ProfilePage = lazy(() => import("../pages/member/profilePage"));
const RegistercarPage = lazy(() => import("../pages/member/registercarPage"));
const QRPage = lazy(() => import("../pages/member/qrPage"));

// Admin pages
const AdminDashboardPage = lazy(() =>
  import("../pages/admin/adminDashboardPage")
);
const UserManagementPage = lazy(() =>
  import("../pages/admin/userManagementPage")
);
const VehicleManagementPage = lazy(() =>
  import("../pages/admin/vehicleManagementPage")
);

// Staff pages
const StaffVehicleManagementPage = lazy(() =>
  import("../pages/staff/groupPage")
);
const BookingManagementPage = lazy(() =>
  import("../pages/staff/bookingManagementPage")
);
const MaintenancePage = lazy(() => import("../pages/staff/maintenancePage"));
const PaymentPage = lazy(() => import("../pages/staff/paymentPage"));

// Error pages
const UnauthorizedPage = lazy(() => import("../pages/error/unauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/error/notFoundPage"));

const Loading = () => <div>Loading...</div>;

const ProtectedRoute = ({ children, roleAccount }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role;

  if (!token) return <Navigate to="/auth/login" replace />;
  if (!roleAccount.includes(role))
    return <Navigate to="/unauthorized" replace />;
  return children;
};

export const router = createBrowserRouter([
  // Guest + RootLayout
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
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<Loading />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: "contact",
        element: (
          <Suspense fallback={<Loading />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: "warehouse",
        element: (
          <Suspense fallback={<Loading />}>
            <WarehousePage />
          </Suspense>
        ),
      },
    ],
  },

  // Auth
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
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },

  // Profile (nếu muốn)
  {
    path: "/profile",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[0, 1]}>
              <ProfilePage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },

  // Member (dùng RootLayout để có header/footer)
  {
    path: "/member",
    element: <MemberLayout />, // ⬅️ thay vì RootLayout
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[0, 1]}>
              <HomePage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[0, 1]}>
              <ProfilePage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "registercar",
        element: (
          <Suspense fallback={<Loading />}>
            {/* <RegistercarPage /> */}
            <ProtectedRoute roleAccount={[0, 1]}>
              <RegistercarPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "wallet",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[0, 1]}>
              <QRPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },

  // Admin
  {
    path: "/admin",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "user-management",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <UserManagementPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "vehicle-management",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <VehicleManagementPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },

  // Staff
  {
    path: "/staff",
    element: <SidebarLayout />,
    children: [
      {
        path: "group-management",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <StaffVehicleManagementPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "booking-management",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <BookingManagementPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "maintenance",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <MaintenancePage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "payment",
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={[1]}>
              <PaymentPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },

  // Errors
  {
    path: "/unauthorized",
    element: (
      <Suspense fallback={<Loading />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
