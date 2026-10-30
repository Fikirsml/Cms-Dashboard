import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import type { Project, Workspace } from '@/types/api';

/**
 * CMS-005 — Workspace detail + projects list
 *
 * UI is in place. Your job: wire data + form logic (see TODO(logic) markers).
 *
 * API:
 *   GET  /workspaces/:workspaceId
 *   GET  /workspaces/:workspaceId/projects
 *   POST /workspaces/:workspaceId/projects
 *        body: { name, key, description? }
 *        key: /^[A-Z][A-Z0-9]{1,9}$/
 */

export default function WorkspaceDetailPage() {
  // TODO(logic): const { workspaceId } = useParams()
  const workspaceId = 'REPLACE_WITH_PARAM';

  // TODO(logic): token from useAuthStore
  // TODO(logic): useQuery for workspace — queryKey: ['workspaces', workspaceId]
  // TODO(logic): useQuery for projects — queryKey: ['workspaces', workspaceId, 'projects']

  const [showCreate, setShowCreate] = useState(false);

  // Placeholder data so you can see the UI while wiring logic
  const isLoading = false;
  const isError = false;
  const errorMessage = '';
  const workspace: Workspace | null = null;
  const projects: Project[] = [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        Loading workspace…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
        {errorMessage || 'Failed to load workspace'}
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/workspaces"
          className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Workspaces
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            {/* TODO(logic): workspace?.name */}
            {workspace?.name ?? 'Workspace'}
          </h1>
          {workspace?.slug && (
            <p className="mt-1 text-xs text-slate-500 font-mono">{workspace.slug}</p>
          )}
          {workspace?.description && (
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">{workspace.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          {showCreate ? 'Close' : 'New project'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="mb-8 max-w-lg">
          <CreateProjectForm
            onCancel={() => setShowCreate(false)}
            // TODO(logic): onSubmit from RHF + useMutation
            // TODO(logic): isSubmitting from mutation.isPending
            // TODO(logic): serverError from mutation error
            // On success: invalidate ['workspaces', workspaceId, 'projects'], setShowCreate(false)
          />
        </div>
      )}

      {/* Projects */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Projects</h2>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
          <p className="text-slate-400">No projects yet</p>
          <p className="mt-1 text-sm text-slate-500">Create a project to start tracking issues.</p>
          {!showCreate && (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              New project
            </button>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              // TODO(logic): optional navigate to /projects/:id later
            />
          ))}
        </ul>
      )}

      {/* Dev hint — remove when logic is wired */}
      <p className="mt-10 text-xs text-slate-600 font-mono">
        workspaceId param: {workspaceId} · wire useParams + useQuery
      </p>
    </div>
  );
}
