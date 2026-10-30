import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import type { WorkspacesResponse } from '@/types/api';

export default function WorkspacesPage() {
  const token = useAuthStore((s) => s.token);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () =>
      api<WorkspacesResponse>('/workspaces', {
        token,
      }),
    enabled: Boolean(token),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        Loading workspaces…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
        {error instanceof Error ? error.message : 'Failed to load workspaces'}
      </div>
    );
  }

  const workspaces = data?.workspaces ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Workspaces</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Select a workspace to view projects and issues.
        </p>
      </div>

      {workspaces.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
          <p className="text-slate-400">No workspaces yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Create one from the API or register a new account.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <li key={ws.id}>
              <Link
                to={`/workspaces/${ws.id}`}
                className="block rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-white">{ws.name}</h2>
                    <p className="mt-0.5 text-xs text-slate-500 font-mono">{ws.slug}</p>
                  </div>
                  {ws.role && (
                    <span className="shrink-0 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400 uppercase tracking-wide">
                      {ws.role}
                    </span>
                  )}
                </div>
                {ws.description && (
                  <p className="mt-3 text-sm text-slate-400 line-clamp-2">{ws.description}</p>
                )}
                <div className="mt-4 flex gap-4 text-xs text-slate-500">
                  {ws._count && (
                    <>
                      <span>{ws._count.projects} projects</span>
                      <span>{ws._count.members} members</span>
                    </>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
