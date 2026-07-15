/**
 * Application Router Configurations - Sets up nested route hierarchy, navigation paths, public guards, and protected client/owner areas.
 */

import { createBrowserRouter } from "react-router-dom";

// Pages
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../features/landing/pages/LandingPage";

// Route Guards
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";
import OwnerRoute from "../routes/OwnerRoute"
import DashboardLayout from "../features/dashboard/layouts/DashboardLayout";

export const Router = createBrowserRouter([
  // Landing Page
  {
    path: "/",
    element: <LandingPage />,
  },

  // Auth Routing
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

  // Protected Dashboard Area
  {
    path: "/dashboard",
    // element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <div className="flex h-[60vh] items-center justify-center text-xl font-bold text-primary">
                به پیشخوان ملک‌جو خوش آمدید
              </div>
            ),
          },
          {
            path: "properties",
            element: (
              <div className="text-lg font-semibold text-foreground">
                صفحه مدیریت املاک
              </div>
            ),
          },
          {
            path: "settings",
            element: (
              <div className="text-lg font-semibold text-foreground">
                تنظیمات سیستم
              </div>
            ),
          },

          // Owners-only routes
          {
            element: <OwnerRoute />,
            children: [
              {
                path: "users",
                element: (
                  <div className="text-lg font-semibold text-foreground">
                    صفحه مدیریت کاربران آژانس (فقط مخصوص مالک)
                  </div>
                ),
              },
            ],
          },
        ],
      },
      // TODO: Add other protected pages here
    ],
  },

  // Not found 404 handler
  {
    path: "*",
    element: <div>NOT FOUND PAGE !! 404 </div>,
    // TODO: element: <NotFoundPage />,
  },
]);