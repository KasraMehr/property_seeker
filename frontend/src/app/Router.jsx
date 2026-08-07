// App route configurations
import { createBrowserRouter } from "react-router-dom";

// Pages
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../features/landing/pages/LandingPage";
// import BadgesShowcase from "@/showcases/BadgesShowcase"
// Guards & Redirects
import PublicRoute from "../routes/PublicRoute";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardRedirect from "../routes/DashboardRedirect";
import RoleRoute from "../routes/RoleRoute";

// Route Modules
import { adminRoutes } from "@/routes/adminRoutes";
import { operatorRoutes } from "@/routes/operatorRoutes";
import AdminLayout from "@/features/dashboard/layouts/AdminLayout";
import OperatorLayout from "@/features/dashboard/layouts/OperatorLayout";
// import SelectShowcase from "@/showcases/SelectShowcase";
// import ModalShowcase from "@/showcases/ModalShowcase";
// import TableShowcase from "@/showcases/TableShowcase";

export const Router = createBrowserRouter([
  // ---------- Public pages
  {
    path: "/",
    element: <LandingPage />,
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
      // Admin + superuser only
      {
        element: <RoleRoute allow="owner" />,
        children: [
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [...adminRoutes],
          },
        ],
      },
      // any other logged in users
      {
        element: <RoleRoute allow="operator" />,
        children: [
          {
            path: "/operator",
            element: <OperatorLayout />,
            children: [...operatorRoutes],
          },
        ],
      },
      {
        path: "/dashboard",
        element: <DashboardRedirect />,
      },
    ],
  },

  // Showcases
  // {
  //   path: "/select-showcase",
  //   element: <SelectShowcase/>

  // },
  // {
  //   path: "/badge-showcase",
  //   element: <BadgesShowcase />,
  // },
  // {
  //   path: "/modal-showcase",
  //   element: <ModalShowcase />,
  // },

  // {
  //   path: "/table-showcase",
  //   element: <TableShowcase/>
  // },

  // Not found 404 handler
  {
    path: "*",
    element: <div>NOT FOUND PAGE !! 404 </div>,
  },
]);
