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
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              color: "#38bdf8",
              fontSize: "24px",
              fontWeight: "bold",
              fontFamily: "tahoma, sans-serif",
              direction: "rtl",
            }}
          >
            شما در داشبورد هستید...
          </div>
        ), // element: <DashboardLayout/>
        // children:[ other path in dashboard]
      },
      // TODO: Add other protected pages here
    ],
  },

  // Not found 404
  {
    path: "*",
    element: <div>NOT FOUND PAGE !! 404 </div>,
    // TODO: element: <NotFoundPage />,
  },
]);
