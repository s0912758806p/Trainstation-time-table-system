import { lazy, Suspense, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ConfigProvider, Spin, theme as antdTheme } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { checkSession } from './store/authSlice';
import { useTheme } from './contexts/ThemeContext';

const TrainLoginPage  = lazy(() => import('./pages/TrainLoginPage'));
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const TrainLayout     = lazy(() => import('./components/TrainLayout'));
const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const TrainSchedulePage = lazy(() => import('./pages/TrainSchedulePage'));
const TicketQueryPage = lazy(() => import('./pages/TicketQueryPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const OrdersPage      = lazy(() => import('./pages/OrdersPage'));
const FAQPage         = lazy(() => import('./pages/FAQPage'));
const TrainDetailsPage = lazy(() => import('./pages/TrainDetailsPage'));
const StationInfoPage = lazy(() => import('./pages/StationInfoPage'));

const PageLoader = () => (
  <div className="page-loader">
    <Spin size="large" />
  </div>
);

function App() {
  const dispatch   = useDispatch();
  const { isDark } = useTheme();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  const configTheme = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary:       isDark ? '#818cf8' : '#6366f1',
      colorLink:          isDark ? '#818cf8' : '#6366f1',
      colorLinkHover:     isDark ? '#6366f1' : '#4f46e5',
      borderRadius:       8,
      borderRadiusLG:     12,
      borderRadiusSM:     6,
      fontFamily:
        "'Inter', 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'PingFang TC', 'Segoe UI', sans-serif",
      colorBgContainer:   isDark ? '#1e2d3d' : '#ffffff',
      colorBgLayout:      isDark ? '#111c2b' : '#f4f7fa',
      colorBorder:        isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
      colorTextBase:      isDark ? '#e2e8f0' : '#111827',
    },
    components: {
      Card: { borderRadius: 12 },
      Table: {
        borderRadius: 10,
        headerBg: isDark ? '#1a2b3c' : '#f8fafc',
        headerColor: isDark ? '#94a3b8' : '#64748b',
      },
      Button: { fontWeight: 500 },
    },
  };

  return (
    <ConfigProvider theme={configTheme}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <TrainLoginPage />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? <TrainLayout /> : <Navigate to="/login" />
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard"    element={<DashboardPage />} />
              <Route path="schedule"     element={<TrainSchedulePage />} />
              <Route path="tickets"      element={<TicketQueryPage />} />
              <Route path="profile"      element={<UserProfilePage />} />
              <Route path="orders"       element={<OrdersPage />} />
              <Route path="faq"          element={<FAQPage />} />
              <Route path="train-details" element={<TrainDetailsPage />} />
              <Route path="station-info" element={<StationInfoPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </ConfigProvider>
  );
}

export default App;
