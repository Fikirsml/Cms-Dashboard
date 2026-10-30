import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '@/components/layout/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import WorkspacesPage from '@/pages/WorkspacesPage';
import { useAuthStore } from '@/stores/auth';

function Landing() {
  const token = useAuthStore((s) => s.token);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Forge</h1>
      <p className="text-slate-400 text-lg max-w-md text-center">
        Enterprise Project Management Platform
      </p>
      <div className="flex gap-4">
        {token ? (
          <Link
            to="/workspaces"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium"
          >
            Go to workspaces
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors font-medium"
            >
              Create account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Public auth routes — redirect if already logged in */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected app shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/workspaces" element={<WorkspacesPage />} />
          {/* Future: /workspaces/:id, /projects/:id, etc. */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
