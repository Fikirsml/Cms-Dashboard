import type { Project } from '@/types/api';

const STATUS_STYLES: Record<string, string> = {
  BACKLOG: 'bg-slate-800 text-slate-400',
  PLANNED: 'bg-sky-500/15 text-sky-300',
  IN_PROGRESS: 'bg-amber-500/15 text-amber-300',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300',
  CANCELLED: 'bg-red-500/15 text-red-300',
};

type ProjectCardProps = {
  project: Project;
  /** Optional: wire navigation in the parent */
  onClick?: () => void;
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusClass = STATUS_STYLES[project.status] ?? STATUS_STYLES.BACKLOG;

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-indigo-400 shrink-0">{project.key}</span>
              <h3 className="font-medium text-white truncate">{project.name}</h3>
            </div>
            {project.description && (
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">{project.description}</p>
            )}
          </div>
          <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs uppercase tracking-wide ${statusClass}`}>
            {project.status.replace('_', ' ')}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          {project._count != null && <span>{project._count.issues} issues</span>}
          {project.lead && <span>Lead: {project.lead.name}</span>}
        </div>
      </button>
    </li>
  );
}
