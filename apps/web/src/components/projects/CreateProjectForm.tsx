/**
 * Presentational shell for create-project.
 * Wire React Hook Form + Zod + useMutation where marked TODO(logic).
 */

type CreateProjectFormProps = {
  /** Called when user cancels / closes the form */
  onCancel?: () => void;
  /**
   * TODO(logic): replace with RHF handleSubmit.
   * Parent or this component should call POST /workspaces/:workspaceId/projects
   */
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  serverError?: string | null;
};

export function CreateProjectForm({
  onCancel,
  onSubmit,
  isSubmitting = false,
  serverError = null,
}: CreateProjectFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-white">New project</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {serverError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-300">
          {serverError}
        </div>
      )}

      {/* TODO(logic): register('name') via RHF */}
      <div>
        <label htmlFor="project-name" className="block text-sm font-medium text-slate-300 mb-1.5">
          Name
        </label>
        <input
          id="project-name"
          name="name"
          type="text"
          placeholder="Website redesign"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {/* TODO(logic): field error message */}
      </div>

      {/* TODO(logic): register('key') — API expects 2–10 uppercase alphanumeric, e.g. WEB */}
      <div>
        <label htmlFor="project-key" className="block text-sm font-medium text-slate-300 mb-1.5">
          Key
        </label>
        <input
          id="project-key"
          name="key"
          type="text"
          placeholder="WEB"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-slate-500">2–10 chars, uppercase letters/numbers (e.g. WEB)</p>
        {/* TODO(logic): field error message */}
      </div>

      {/* TODO(logic): register('description') optional */}
      <div>
        <label
          htmlFor="project-description"
          className="block text-sm font-medium text-slate-300 mb-1.5"
        >
          Description <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="project-description"
          name="description"
          rows={3}
          placeholder="What is this project about?"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          {isSubmitting ? 'Creating…' : 'Create project'}
        </button>
      </div>
    </form>
  );
}
