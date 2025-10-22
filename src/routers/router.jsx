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
const QRPage = lazy(() => import("../pages/member/qrPage"));

// Admin pages
const AdminDashboardPage = lazy(() => import("../pages/admin/adminDashboardPage"));
const UserManagementPage = lazy(() => import("../pages/admin/userManagementPage"));
const VehicleManagementPage = lazy(() => import("../pages/admin/vehicleManagementPage"));

// Staff pages (nếu staff cũng role=1)
const StaffVehicleManagementPage = lazy(() => import("../pages/staff/groupPage"));
const BookingManagementPage = lazy(() => import("../pages/staff/bookingManagementPage"));
const MaintenancePage = lazy(() => import("../pages/staff/maintenancePage"));
const PaymentPage = lazy(() => import("../pages/staff/paymentPage"));

// Error pages
const UnauthorizedPage = lazy(() => import("../pages/error/unauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/error/notFoundPage"));

const Loading = () => <div>Loading...</div>;

/** Route protection
 * - Lấy user từ localStorage
 * - Kiểm tra role dạng số: 1 (admin/staff), 0 (member)
 */
const ProtectedRoute = ({ children, roleAccount }) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.role; // 0 | 1

  if (!token || !user) return <Navigate to="/auth/login" replace />;

  if (!roleAccount.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

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

  // Profile (ví dụ mở rộng, nếu muốn chỉ user đã login mới vào)
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

  // Member
  {
    path: "/member",
    element: <RootLayout />,
    children: [
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

  // Admin (role 1 = admin/staff)
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

  // Staff (nếu bạn vẫn muốn tách khu staff; cùng role 1)
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
