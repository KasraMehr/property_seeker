// App route configurations
import { createBrowserRouter } from "react-router-dom";

// Pages
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../features/landing/pages/LandingPage";
import BadgesShowcase from "../theme/showcases/BadgesShowcase"
// Guards & Redirects
import PublicRoute from "../routes/PublicRoute";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardRedirect from "../routes/DashboardRedirect";

// Route Modules
import { adminRoutes } from "../routes/adminRoutes";
import { operatorRoutes } from "../routes/operatorRoutes";
import AdminLayout from "../features/dashboard/layouts/AdminLayout";
import OperatorLayout from "../features/dashboard/layouts/OperatorLayout";

export const Router = createBrowserRouter([
  // ---------- Public pages
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/showcase",
    element: <BadgesShowcase />,
  },
  
  // Login page
  {
    path: "/login",
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },

  // ------------ Protected pages
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [...adminRoutes],
      },
      {
        path: "/operator",
        element: <OperatorLayout />,
        children: [...operatorRoutes],
      },
      {
        path: "/dashboard",
        element: <DashboardRedirect />,
      },
    ],
  },

  // Not found 404 handler
  {
    path: "*",
    element: <div>NOT FOUND PAGE !! 404 </div>,
  },
]);
