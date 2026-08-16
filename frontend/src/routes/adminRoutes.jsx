import AdminDashboardPage from "@/features/dashboard/admin/AdminDashboardPage";
import UsersPage from "@/features/users-management/pages/UsersPage";
import LocationPage from "@/features/location-management/pages/LocationPage";
import ScraperPage from "@/features/scraper-management/pages/ScraperPage";
import ReportsPage from "@/features/reports/pages/ReportsPage";
import ListingsPage from "@/features/listings/pages/ListingsPage";
import ProfilePage from "../features/dashboard/pages/ProfilePage";
// import SettingPage from "../features/dashboard/pages/SettingPage";
import PropertiesPage from "../features/properties/pages/PropertiesPage";
import CustomersPage from "../features/customers/pages/CustomersPage";
import CallsPage from "../features/calls/pages/CallsPage"
import ActivityLogPage from "../features/activity-log/pages/ActivityLogPage";

export const adminRoutes = [
  { path: "dashboard", element: <AdminDashboardPage /> },
  { path: "listings", element: <ListingsPage /> },
  { path: "properties", element: <PropertiesPage /> },
  { path: "calls", element: <CallsPage /> },
  { path: "customers", element: <CustomersPage /> },
  { path: "users", element: <UsersPage /> },
  { path: "regions", element: <LocationPage /> },
  { path: "scraper", element: <ScraperPage /> },
  { path: "reports", element: <ReportsPage /> },
  { path: "activity-log", element: <ActivityLogPage /> },
  { path: "profile", element: <ProfilePage /> },
  // { path: "profile/settings", element: <SettingPage /> },
];
