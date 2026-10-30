// Shared types, constants, and utilities for the Forge monorepo

export type Id = string;

/** Workspace membership roles */
export const WORKSPACE_ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

/** Project lifecycle statuses */
export const PROJECT_STATUSES = [
  'BACKLOG',
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Issue workflow statuses */
export const ISSUE_STATUSES = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
  'CANCELLED',
] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

/** Issue priority levels */
export const ISSUE_PRIORITIES = [
  'NO_PRIORITY',
  'URGENT',
  'HIGH',
  'MEDIUM',
  'LOW',
] as const;
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

/** Human-readable issue identifier (e.g. "FORGE-42") */
export function formatIssueKey(projectKey: string, number: number): string {
  return `${projectKey}-${number}`;
}
