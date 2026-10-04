import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AppLayout from '../layouts/AppLayout.jsx';
import LoadingState from '../components/LoadingState.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import Categories from '../pages/Categories.jsx';
import Settings from '../pages/Settings.jsx';

function Protected({ children }) {
  const { user, booting } = useAuth();
  if (booting) return <LoadingState fullscreen label="Loading SpendWise..." />;
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="categories" element={<Categories />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
