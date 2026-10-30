import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

export default function AppShell() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-slate-800">
          <Link to="/workspaces" className="font-bold text-lg tracking-tight text-white">
            Forge
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            to="/workspaces"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span className="text-slate-500">◇</span>
            Workspaces
          </Link>
          {/* Future: Projects, Issues, Settings */}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="rounded-lg px-3 py-2 text-xs text-slate-500">
            {user?.name ?? 'User'}
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 shrink-0 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6">
          <div className="text-sm text-slate-400">Enterprise Project Management</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300 hidden sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
