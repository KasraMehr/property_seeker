import OperatorDashboardPage from '@/features/dashboard/operator/OperatorDashboardPage';
import ListingsPage from '@/features/listings/pages/ListingsPage'
import CallsPage from '@/features/calls/pages/CallsPage';
import PropertiesPage from '@/features/properties/pages/PropertiesPage';
import FollowupsPage from '@/features/followups/pages/FollowupsPage';

export const operatorRoutes = [
  { path: 'dashboard', element: <OperatorDashboardPage /> },
  { path: 'listings', element: <ListingsPage /> },
  { path: 'calls', element: <CallsPage /> },
  { path: 'properties', element: <PropertiesPage /> },
  { path: 'followups', element: <FollowupsPage /> },
];