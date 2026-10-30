import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

/** Redirects unauthenticated users to /login */
export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

/** Redirects authenticated users away from auth pages */
export function GuestRoute() {
  const token = useAuthStore((s) => s.token);

  if (token) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Outlet />;
}
