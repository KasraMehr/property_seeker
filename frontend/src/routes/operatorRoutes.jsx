import OperatorDashboardPage from '@/features/dashboard/operator/OperatorDashboardPage';
import ListingsPage from '@/features/listings/pages/ListingsPage'
import CallsPage from '@/features/calls/pages/CallsPage';
import PropertiesPage from '@/features/properties/pages/PropertiesPage';
import FollowupsPage from '@/features/followups/pages/FollowupsPage';
import ProfilePage from '../features/dashboard/pages/ProfilePage';
// import SettingPage from '../features/dashboard/pages/SettingPage';
import CustomersPage from "../features/customers/pages/CustomersPage";


export const operatorRoutes = [
  { path: 'dashboard', element: <OperatorDashboardPage /> },
  { path: 'listings', element: <ListingsPage /> },
  { path: 'calls', element: <CallsPage /> },
  { path: "customers", element: <CustomersPage /> },
  { path: 'properties', element: <PropertiesPage /> },
  { path: 'followups', element: <FollowupsPage /> },
  { path: 'profile', element: <ProfilePage /> },
  // { path: 'profile/settings', element: <SettingPage /> },
];