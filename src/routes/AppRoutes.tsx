import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TrainLoginPage from '../pages/TrainLoginPage';
import TrainSchedulePage from '../pages/TrainSchedulePage';
import TrainDetailsPage from '../pages/TrainDetailsPage';
import UserProfilePage from '../pages/UserProfilePage';
import StationInfoPage from '../pages/StationInfoPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const routesMap = [
    { path: '/login', element: <TrainLoginPage />, isProtected: false },
    { path: '/', element: <TrainSchedulePage />, isProtected: true },
    {
      path: '/trainDetailsTable',
      element: <TrainDetailsPage />,
      isProtected: true,
    },
    {
      path: '/profile',
      element: <UserProfilePage />,
      isProtected: true,
    },
    {
      path: '/station/:stationId',
      element: <StationInfoPage />,
      isProtected: false,
    },
  ];

  return (
    <Router>
      <Routes>
        {/* routesMap */}
        {routesMap.map(({ path, element, isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  {element}
                </ProtectedRoute>
              ) : (
                element
              )
            }
          ></Route>
        ))}

        {/* Default Route(404) */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
