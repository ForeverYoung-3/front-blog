import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin, requireEditor }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isEditor } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (requireEditor && !isEditor()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
