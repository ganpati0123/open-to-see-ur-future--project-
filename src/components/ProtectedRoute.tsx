import { Navigate, Outlet } from 'react-router-dom';
import { AuthLoading } from './AuthShell';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
