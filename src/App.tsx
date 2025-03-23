import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import TrainLoginPage from './pages/TrainLoginPage';
import TrainSchedulePage from './pages/TrainSchedulePage';
import TicketQueryPage from './pages/TicketQueryPage';
import TrainLayout from './components/TrainLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { checkSession } from './store/authSlice';

// 添加警告處理函數，忽略 startTransition 警告
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  // 忽略 React Router 的 startTransition 警告
  if (
    typeof args[0] === 'string' &&
    args[0].includes(
      'React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7'
    )
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // 應用啟動時檢查會話狀態
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/schedule" /> : <TrainLoginPage />
          }
        />

        <Route
          path="/"
          element={isAuthenticated ? <TrainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/schedule" />} />
          <Route path="schedule" element={<TrainSchedulePage />} />
          <Route path="tickets" element={<TicketQueryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
