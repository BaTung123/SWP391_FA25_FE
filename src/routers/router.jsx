import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RootLayout from "../layout/RootLayout";
import AuthLayout from "../layout/AuthLayout";
import SidebarLayout from "../layout/SidebarLayout";
import AdminPage from "../pages/admin/adminPage";
import MemberPage from "../pages/member/memberPage";

// Guest pages
const HomePage = lazy(() => import("../pages/guest/homePage"));
const AboutPage = lazy(() => import("../pages/guest/aboutPage"));
const ContactPage = lazy(() => import("../pages/guest/contactPage"));
const LoginPage = lazy(() => import("../pages/guest/loginPage"));
const RegisterPage = lazy(() => import("../pages/guest/registerPage"));

// Member pages
const ProfilePage = lazy(() => import("../pages/member/profilePage"));

// Admin pages
const AdminDashboardPage = lazy(() => import("../pages/admin/adminDashboardPage"));
const UserManagementPage = lazy(() => import("../pages/admin/userManagementPage"));

// Error pages
const UnauthorizedPage = lazy(() => import("../pages/error/unauthorizedPage"));
const NotFoundPage = lazy(() => import("../pages/error/notFoundPage"));

// Loading component
const Loading = () => <div>Loading...</div>;

// Route protection wrapper
const ProtectedRoute = ({ children, roleAccount }) => {
  const user = JSON.parse(localStorage.getItem("user"));
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

  // Information page with sidebar layout
  {
    path: "/information",
    element: <SidebarLayout />,
    children: [
      {
        path: "",
        element: (
          <div className="information-dashboard">
            <h1>Information Dashboard</h1>
            <p>Welcome to the information section.</p>
          </div>
        )
      },
    ],
  },

  // Member routes
  {
    path: "/member",
    element: <MemberPage />,
    children: [
      { 
        path: "profile", 
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={["Customer", "Staff"]}>
              <ProfilePage />
            </ProtectedRoute>
          </Suspense>
        )
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      { 
        path: "", 
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={["Admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          </Suspense>
        )
      },
      { 
        path: "user", 
        element: (
          <Suspense fallback={<Loading />}>
            <ProtectedRoute roleAccount={["Admin"]}>
              <UserManagementPage />
            </ProtectedRoute>
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
