import { lazy, Suspense, useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { checkSession } from './store/authSlice';

const TrainLoginPage = lazy(() => import('./pages/TrainLoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const TrainLayout = lazy(() => import('./components/TrainLayout'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TrainSchedulePage = lazy(() => import('./pages/TrainSchedulePage'));
const TicketQueryPage = lazy(() => import('./pages/TicketQueryPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TrainDetailsPage = lazy(() => import('./pages/TrainDetailsPage'));
const StationInfoPage = lazy(() => import('./pages/StationInfoPage'));

const PageLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spin size="large" />
  </div>
);

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
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
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="schedule" element={<TrainSchedulePage />} />
            <Route path="tickets" element={<TicketQueryPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="train-details" element={<TrainDetailsPage />} />
            <Route path="station-info" element={<StationInfoPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
