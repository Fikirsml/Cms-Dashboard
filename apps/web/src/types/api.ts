export type PublicUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
  _count?: {
    projects: number;
    members: number;
  };
};

export type ProjectStatus =
  | 'BACKLOG'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type Project = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  status: ProjectStatus;
  workspaceId: string;
  leadId: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  lead?: Pick<PublicUser, 'id' | 'name' | 'email' | 'avatarUrl'> | null;
  _count?: {
    issues: number;
  };
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
  workspace?: Workspace;
};

export type MeResponse = {
  user: PublicUser;
};

export type WorkspacesResponse = {
  workspaces: Workspace[];
};

export type WorkspaceResponse = {
  workspace: Workspace;
  role?: string;
};

export type ProjectsResponse = {
  projects: Project[];
};

export type ProjectResponse = {
  project: Project;
};
