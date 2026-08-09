import AdminDashboardPage from '@/features/dashboard/admin/AdminDashboardPage';
import UsersPage from '@/features/users-management/pages/UsersPage';
import RegionsPage from '@/features/regions-management/pages/RegionsPage';
import ScraperPage from '@/features/scraper-management/pages/ScraperPage';
import ReportsPage from '@/features/reports/pages/ReportsPage';
import ListingsPage from '@/features/listings/pages/ListingsPage'
import ProfilePage from '../features/dashboard/ProfilePage';
import SettingPage from '../features/dashboard/SettingPage';
import PropertiesPage from '../features/properties/pages/PropertiesPage';

export const adminRoutes = [
  { path: 'dashboard', element: <AdminDashboardPage /> },
  { path: 'listings', element: <ListingsPage /> },
  { path: 'properties', element: <PropertiesPage /> },
  { path: 'users', element: <UsersPage /> },
  { path: 'regions', element: <RegionsPage /> },
  { path: 'scraper', element: <ScraperPage /> },
  { path: 'reports', element: <ReportsPage /> },
  { path: 'profile', element: <ProfilePage /> },
  { path: 'profile/settings', element: <SettingPage /> },
];