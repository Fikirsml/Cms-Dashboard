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
