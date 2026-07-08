import { createBrowserRouter } from "react-router-dom";

// Pages
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../features/landing/pages/LandingPage";

// Route Guards
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";

export const Router = createBrowserRouter([
  // Landing Page
  {
    path: "/",
    element: <LandingPage />,
  },

  // Auth
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

  // Protected
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <div>PROTECTED PAGE *Dashboard* coming soon...</div>,
        // element: <DashboardLayout/>
        // children:[ other path in dashboard]
      },
      // TODO: Add other protected pages here
    ],
  },

  // Not found 404
  {
    path: "*",
    element: <div>NOT FOUND PAGE !!</div>,
    // TODO: element: <NotFoundPage />,
  },
]);