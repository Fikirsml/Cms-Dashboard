import { prisma } from './prisma.js';
import { forbidden, notFound } from './errors.js';

/** Ensure the user is a member of the workspace. Returns membership. */
export async function requireWorkspaceMember(
  workspaceId: string,
  userId: string,
) {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: { workspaceId, userId },
    },
    include: { workspace: true },
  });

  if (!membership) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });
    if (!workspace) throw notFound('Workspace not found');
    throw forbidden('You are not a member of this workspace');
  }

  return membership;
}

/** Load project and ensure caller is a member of its workspace. */
export async function requireProjectAccess(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { workspace: true },
  });
  if (!project) throw notFound('Project not found');

  await requireWorkspaceMember(project.workspaceId, userId);
  return project;
}
