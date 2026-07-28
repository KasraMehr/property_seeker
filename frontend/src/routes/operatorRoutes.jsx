import OperatorDashboardPage from '@/features/dashboard/operator/OperatorDashboardPage';
import LeadsPage from '@/features/leads/pages/LeadsPage';
import CallsPage from '@/features/calls/pages/CallsPage';
import PropertiesPage from '@/features/properties/pages/PropertiesPage';
import FollowupsPage from '@/features/followups/pages/FollowupsPage';

export const operatorRoutes = [
  { path: 'dashboard', element: <OperatorDashboardPage /> },
  { path: 'leads', element: <LeadsPage /> },
  { path: 'calls', element: <CallsPage /> },
  { path: 'properties', element: <PropertiesPage /> },
  { path: 'followups', element: <FollowupsPage /> },
];